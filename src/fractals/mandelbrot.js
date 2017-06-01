import Complex from '../complex'


export default new window.p5(function(p){
    
    const WIDTH = 550;
    const HEIGHT = 550;

    const normalize = p.map;
    let render;

    const State = {
        maxIterations: 100,
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
            State.maxIterations  = state.iterations|0;
            State.escapeRadius   = state.bound|0;
            State.hue            = state.hue|0;
            State.saturation     = state.saturation|0;
            State.brightness           = state.brightness|0;
            State.escapeColoring = state.esc;
        }
        render();
    }


    p.setup = function(){
        p.createCanvas(WIDTH, HEIGHT).parent('renderedOutputArea');
        p.loadPixels();
        p.pixelDensity(1);
        p.colorMode(p.HSB, 255);
        p.noLoop();
        render = p.redraw.bind(this);
    }


    p.draw = () => {
        renderMandelbrotSet(State);
    }


    const renderMandelbrotSet = function(state){
        let iteration;
        let colorIndex;
        let hue, saturation, brightness;

        const N = state.maxIterations;

        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {

                let Z = Complex.of(
                    normalize(i, 0, WIDTH, -2.5, 2.5),
                    normalize(j, 0, HEIGHT, -2.5, 2.5)
                );

                let C = Complex.of(Z);

                iteration = 0;

                while (Z.magnitude() < state.escapeRadius && iteration < N)
                {
                    // Mandelbrot's equation: Zn+1 = Zn^2 + C
                    Z = Z.multiply(Z).add(C);
                    iteration++;
                }
                
                if (state.escapeColoring && iteration === N) {
                    colorIndex = 0;
                } else {
                    // Continuous coloring algorithm
                    //  TODO: may need to lerp colorIndex value
                    if (iteration < N){
                        Z = Z.multiply(Z).add(C); iteration++;
                        Z = Z.multiply(Z).add(C); iteration++;
                        const logZ = Math.log(Z.pow(2)) / 2;
                        const mu = iteration - Math.log(logZ / Math.log(2)) / Math.log(state.escapeRadius);
                        colorIndex = mu / N * 768;
                        if (colorIndex >= 768 || colorIndex < 0){
                            colorIndex = 0;
                        }
                    }
                    colorIndex = normalizeHSBValue(iteration, N);
                }
    
                hue   = state.hue   + colorIndex;
                saturation = state.saturation + colorIndex;
                brightness = state.brightness + colorIndex;
                
                let pixel = (i + j * WIDTH) * 4;
                p.pixels[pixel  ] = getValidHSBValue(hue);
                p.pixels[++pixel] = getValidHSBValue(saturation);
                p.pixels[++pixel] = getValidHSBValue(brightness);
                p.pixels[++pixel] = 250;
            }
        }

        p.updatePixels();
    }

    const getValidHSBValue = value => {
        return value > 255 ? normalizeHSBValue(value) : value;
    };

    const normalizeHSBValue = (val, maxValue=510) => {
        // TODO: memoize me
        let value = normalize(val, 0, maxValue, 0, 1);
        return normalize(Math.sqrt(value), 0, 1, 0, 255);
    }
});