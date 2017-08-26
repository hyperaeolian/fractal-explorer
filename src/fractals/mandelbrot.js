import memoize from 'memoizee'

import Complex from '../complex'
import Broadcaster from '../broadcaster'



export default new window.p5(function MandelbrotApp(p){
    
    const WIDTH = 512;
    const HEIGHT = 512;
    const epsilon = 0.00001;
    const normalize = memoize(p.map, { primitive: true});
    const stateEmitter = new Broadcaster();

    const DefaultState = {
        maxIters: 400,
        escapeRadius: 20,
        escapeColoring: false,
        zoomX: -2.5,
        zoomY: 2.5,
        hsb: { h: 0, s: 0, b: 0 },
        reset: false
    };

    let State;
    let Render;
    const log2 = Math.log(2.0);

    p.update = function(state) {
        if (state.reset){
            State = Object.assign({}, DefaultState);
        } else {
            State.maxIters     = state.iterations|0;
            State.escapeRadius = state.bound|0;
            State.zoomX        = (state.zoomX|0) * .01;
            State.zoomY        = (state.zoomY|0) * .01;
            State.hsb = {
                h: state.hsb.hue|0,
                s: state.hsb.saturation|0,
                b: state.hsb.brightness|0
            }
        }
        Render();
    }



    p.setup = function(){
        State = Object.assign({}, DefaultState);
        p.createCanvas(WIDTH, HEIGHT).parent('renderedOutputArea');
        p.loadPixels();
        p.pixelDensity(1);
        p.colorMode(p.HSB);
        p.noLoop();
        Render = p.redraw.bind(this);
        stateEmitter.subscribe('status', status => {
            if (status === 'rendering'){
                console.log("rendering");
            } else if (status === '!rendering') {
                console.log("not rendering");
            }
        });
    }

    p.draw = () => {
        renderMandelbrotSet(State);
    }


    const renderMandelbrotSet = state => {
        let itr;
        let colorValue;
        stateEmitter.broadcast('status', 'rendering');

        let pixels = [];
        let colorValues = [];
        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {

                let Z = new Complex(
                    normalize(i, 0, WIDTH, state.zoomX, state.zoomY),
                    normalize(j, 0, HEIGHT, state.zoomX, state.zoomY)
                );

                let C = new Complex(Z);

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
                pixels.push((i + (j << 9)) << 2);
            }
        }

        colorFractal(state.hsb, colorValues, pixels);
        p.updatePixels();
        stateEmitter.broadcast('status', '!rendering');
    }

    function colorFractal(hsbObj, colorValues, pixels){
        for (let i = 0, len = colorValues.length; i < len; ++i){
            let hsb = getNormedHSB(hsbObj, colorValues[i]);
            let pixel = pixels[i];
            p.pixels[  pixel] = hsb.HUE;
            p.pixels[++pixel] = hsb.SATURATION;
            p.pixels[++pixel] = hsb.BRIGHTNESS;
            p.pixels[++pixel] = 250;
        }
    }

    const getNormedHSB = (hsb, val) => {
        let h = hsb.h + val;
        let s = hsb.s + val;
        let b = hsb.b + val;

        return {
            HUE:        h <= 360 ? h : p.norm(h, 0, 360),
            SATURATION: s <= 100 ? s : p.norm(s, 0, 100),
            BRIGHTNESS: b <= 100 ? b : p.norm(b, 0, 100)
        }
    };
});