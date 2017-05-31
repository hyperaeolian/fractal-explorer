import Complex from '../complex'


export default new window.p5(function(p){
    
    const WIDTH = 550;
    const HEIGHT = 550;

    const normalize = p.map;
    let render;

    const State = {
        maxIterations: 100,
        upperBound: 20,
        escapeColoring: false,
        red: 0,
        green: 0,
        blue: 0
    };

    p.update = function(state) {
        //console.log(`State: ${JSON.stringify(state)}`);
        State.maxIterations  = state.iterations|0;
        State.upperBound     = state.bound|0;
        State.red            = state.red|0;
        State.green          = state.green|0;
        State.blue           = state.blue|0;
        State.escapeColoring = state.esc;
        render();
    }


    p.setup = function(){
        p.createCanvas(WIDTH, HEIGHT).parent('renderedOutputArea');
        p.loadPixels();
        p.pixelDensity(1);
        p.noLoop();
        render = p.redraw.bind(this);
    }


    p.draw = () => {
        renderMandelbrotSet(State);
    }


    const renderMandelbrotSet = function(state){
        let num_iters;
        let colorValue;

        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {

                let Z = Complex.of(
                    normalize(i, 0, WIDTH, -2.5, 2.5),
                    normalize(j, 0, HEIGHT, -2.5, 2.5)
                );

                let C = Complex.of(Z);

                num_iters = 0;

                while (Z.magnitude() < state.upperBound &&
                       num_iters < state.maxIterations)
                {
                    // Mandelbrot's equation: Zn+1 = Zn^2 + C
                    Z = Z.multiply(Z).add(C);
                    num_iters++;
                }
                
                if (state.escapeColoring && num_iters === state.maxIterations) {
                    colorValue = 0;
                } else {
                    colorValue = normalizeRGBValue(
                        num_iters,
                        state.maxIterations
                    );
                }
    
                let Red   = state.red   + colorValue;
                let Green = state.green + colorValue;
                let Blue  = state.blue  + colorValue;
                
                let pixel = (i + j * WIDTH) * 4;
                p.pixels[pixel  ] = getValidRGBValue(Red);
                p.pixels[pixel+1] = getValidRGBValue(Green);
                p.pixels[pixel+2] = getValidRGBValue(Blue);
                p.pixels[pixel+3] = 250;
            }
        }

        p.updatePixels();
    }

    const getValidRGBValue = value => {
        return value > 255 ? normalizeRGBValue(value) : value;
    };

    const normalizeRGBValue = (val, maxValue=510) => {
        // TODO: memoize me
        // Scales @param val from a range of 0 to @param maxValue
        //   to a range of 0 to 255 (RGB values)
        let value = normalize(val, 0, maxValue, 0, 1);
        return normalize(Math.sqrt(value), 0, 1, 0, 255);
    }
});