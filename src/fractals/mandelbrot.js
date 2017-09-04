import memoize from 'memoizee'

import Complex from '../complex'



export default new window.p5(function app(p5){
    
    const WIDTH = 512;
    const HEIGHT = 512;
    const epsilon = 0.00001;
    const log2 = Math.log(2.0);
    let appState;
    let render;
    let FIELD;

    const scale = memoize(p5.map, { primitive: true});

    const defaultState = {
        maxIters: 400,
        escapeRadius: 20,
        escapeColoring: false,
        zoomX: -2.5,
        zoomY: 2.5,
        hsb: { h: 0, s: 0, b: 0 },
        renderAsJulia: false,
        juliaConstant: 0.285,
        reset: false
    };



    p5.setup = function(){
        /**
        *   Called once on initialization and initializes and creates
        *   any variables or configurations
        */
        appState = Object.assign({}, defaultState);
        FIELD = createComplexPlane(appState.zoomX, appState.zoomY);
        p5.createCanvas(WIDTH, HEIGHT).parent('renderedOutputArea');
        p5.loadPixels();
        p5.pixelDensity(1);
        //FIXME: colorMode still seems to be RGB
        p5.colorMode(p5.HSB);
        p5.noLoop();
        render = p5.redraw.bind(this);
    }

    p5.draw = function(){
        renderMandelbrotSet(appState);
    }

    p5.update = function(state){
        /**
        *   Externally available function that is called whenever
        *       the callee would like the sketch to update itself.
        *
        *   @method update
        *   @param {Object} state - updated state the fractal should
        *                           use when re-rendering
        */
        if (state.reset){
            appState = Object.assign({}, defaultState);
        } else {

            // Render a new complex plane only if we need to
            //  (i.e., zoom values changed)
            let zoomXRecv = (state.zoomX|0) * .01;
            let zoomYRecv = (state.zoomY|0) * .01;
            if (appState.zoomX !== zoomXRecv ||
                appState.zoomY !== zoomYRecv ||
                appState.renderAsJulia !== state.renderAsJulia)
            {
                 appState.zoomX = zoomXRecv;
                 appState.zoomY = zoomYRecv;
                 FIELD = createComplexPlane(appState.zoomX, appState.zoomY);
            }
            appState.maxIters     = state.iterations|0;
            appState.escapeRadius = state.bound|0;
            appState.renderAsJulia = state.renderAsJulia;
            appState.juliaConstant = state.juliaConstant;
            appState.hsb = {
                h: state.hsb.hue|0,
                s: state.hsb.saturation|0,
                b: state.hsb.brightness|0
            }
        }
        render();
        return true;
    }

    function createComplexPlane(zoomX, zoomY){
        /**
        *   Generates a complex plane that can be used to render a fractal
        *
        *   @method createComplexPlane
        *   @param {Number} zoomX - the resolution along the x-axis of the
        *                           field to be rendered
        *   @param {Number} zoomY - the resolution along the y-axis of the
        *                           field to be rendered
        *   @returns {Array} field - a 2D array of complex numbers
        */
        let field = [];
        for (let i = 0; i < WIDTH; i++) {
            field.push([]);
            for(let j = 0; j < HEIGHT; j++){
                let x = new Complex(
                    scale(i, 0, WIDTH, zoomX, zoomY),
                    scale(j, 0, HEIGHT, zoomX, zoomY)
                )
                field[i].push(x);
            }
        }
        return field;
    }


    function renderMandelbrotSet(state){
        let itr;
        let colorValue;
        let colorValues = [];
        let pixels = [];
        
        let K;
        if (state.renderAsJulia){
            K = Complex.of(state.juliaConstant, state.juliaConstant); 
        }

        for (let x = 0, len = FIELD.length; x < len; x++){
            for (let y = 0, len = FIELD.length; y < len; y++){
                let Z = FIELD[x][y];
                let C = K || Complex.of(Z);
                itr = 0;

                while (Z.modulus() < state.escapeRadius && itr < state.maxIters){
                    // Mandelbrot's equation: Zn+1 = Zn^2 + C
                    Z = Z.multiply(Z).add(C);
                    itr++;
                }
                
                if (state.escapeColoring && itr === state.maxIters) {
                    colorValue = 0.0;
                } else {
                    // decrease the size of error term with a few more iterations
                     Z = Z.multiply(Z).add(C); itr++;
                     Z = Z.multiply(Z).add(C); itr++;

                    // continuous coloring via renormalized iteration count
                    colorValue = itr - Math.log(Math.log(Z.modulus())) / log2;
                }

                colorValues.push(colorValue);
                pixels.push((x + (y << 9)) << 2);
            }
        }

        colorFractal(state.hsb, colorValues, pixels);
        p5.updatePixels();
    }

    function colorFractal(hsbObj, colorValues, pixels){
        /**
        *   Adds color values to rendered fractal
        *
        *   @method colorFractal
        *   @param {Obj}   hsbObj - hue, saturation, brightness values requested
        *                           in the UI
        *   @param {Array} colorValues - values for color generated from calculation
        *   @param {Array} pixels - the fractal that needs to be colored
        */
        if (colorValues.length !== pixels.length){
            throw `Cannot color fractal`;
        }
        for (let i = 0, len = colorValues.length; i < len; ++i){
            let hsb = getNormedHSB(hsbObj, colorValues[i]);
            let pixel = pixels[i];
            p5.pixels[  pixel] = hsb.HUE;
            p5.pixels[++pixel] = hsb.SATURATION;
            p5.pixels[++pixel] = hsb.BRIGHTNESS;
            p5.pixels[++pixel] = 250;
        }
    }

    function getNormedHSB(hsb, val){
        /**
        *   Generates normalized color values using color values requested in the UI
        *       and color values calculated in the fractal generation step
        *
        *   @method getNormedHSB
        *   @param {Obj}    hsb - hue, saturation, brightness values requested in the UI
        *   @param {Number} val - value for color generated from calculation
        *   @returns {Object} - normalized hsb values using hsb and val
        */
        let h = hsb.h + val;
        let s = hsb.s + val;
        let b = hsb.b + val;


        return {
            HUE:        h <= 360 ? h : p5.norm(h, 0, 360),
            SATURATION: s <= 100 ? s : p5.norm(s, 0, 100),
            BRIGHTNESS: b <= 100 ? b : p5.norm(b, 0, 100)
        }
    };
});