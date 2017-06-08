import Complex from '../complex'


export default new window.p5(function(p){
    
    const WIDTH = 512;
    const HEIGHT = 512;
    const epsilon = 0.00001;

    const normalize = p.map;
    let render;

    const State = {
        maxIters: 400,
        escapeRadius: 20,
        escapeColoring: false,
        hue: 0,
        saturation: 0,
        brightness: 0
    };

    const DefaultState = Object.assign({}, State);

    p.update = function(state) {
        //console.log(`State: ${JSON.stringify(state)}`);
        if (state.shouldReset){
            // Set state to defaults
        } else {
            State.maxIters       = state.iterations|0;
            State.escapeRadius   = state.bound|0;
            State.hue            = state.hue|0;
            State.saturation     = state.saturation|0;
            State.brightness     = state.brightness|0;
            State.escapeColoring = state.esc;
        }
        render();
    }


    p.setup = function(){
        p.createCanvas(WIDTH, HEIGHT).parent('renderedOutputArea');
        p.loadPixels();
        p.pixelDensity(1);
        p.colorMode(p.HSB);
        p.noLoop();
        render = p.redraw.bind(this);
    }


    p.draw = () => {
        renderMandelbrotSet(State);
    }


    const renderMandelbrotSet = function(state){
        let itr;
        let colorValue;
        let zoomX = -2.5;
        let zoomY = 2.5;

        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {

                let Z = Complex.of(
                    normalize(i, 0, WIDTH, zoomX, zoomY),
                    normalize(j, 0, HEIGHT, zoomX, zoomY)
                );

                let C = Complex.of(Z);

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
                    let mu = itr - Math.log(Math.log(Z.modulus() * epsilon)) / Math.log(2.0);
                    colorValue = mu;
                }
                
                let hsb = getHSB(state, colorValue);
                let pixel = (i + (j << 9)) << 2;
                p.pixels[  pixel] = hsb.HUE;
                p.pixels[++pixel] = hsb.SATURATION;
                p.pixels[++pixel] = hsb.BRIGHTNESS;
                p.pixels[++pixel] = 250;
            }
        }
        p.updatePixels();
    }

    const getHSB = (state, val) => {
        let h = state.hue + val;
        let s = state.saturation + val;
        let b = state.brightness + val;

        return {
            HUE:        h <= 360 ? h : p.norm(h, 0, 360),
            SATURATION: s <= 100 ? s : p.norm(s, 0, 100),
            BRIGHTNESS: b <= 100 ? b : p.norm(b, 0, 100)
        }
    }
});