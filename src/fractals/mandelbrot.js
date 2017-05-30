import Complex from '../complex'

// Parameters for user control: Iterations, Infinity, Color, Zoom

export default new window.p5(function(p){
    
    const WIDTH = 550;
    const HEIGHT = 550;

    const normalize = p.map;

    let MaxIterations = 100;
    let UpperBound = 50;
    let ColorEscapedPixels = false;

    let Red = 0;
    let Green = 0;
    let Blue = 0;
    let Alpha = 250;

    const CurrentState = {
        maxIterations: 100,
        upperBound: 20,
        escapeColoring: false,
        red: 0,
        green: 0,
        blue: 0,
        alpha: 255
    };


    p.update = function(state) {
        console.log(`State: ${JSON.stringify(state)}`);
        CurrentState.maxIterations = state.iterations|0;
        CurrentState.upperBound = state.bound|0;
        CurrentState.red = state.red|0;
        CurrentState.green = state.green|0;
        CurrentState.blue = state.blue|0;
        CurrentState.alpha = state.alpha|0;
        CurrentState.escapeColoring = state.esc;
    }


    p.setup = function(){
        p.createCanvas(WIDTH, HEIGHT)
            .parent('renderedOutputArea');
        p.loadPixels();
        p.pixelDensity(1);
        p.noLoop();
    }


    p.draw = function(){
         _renderMandelbrotSet(CurrentState);
    }


    p.mouseReleased = function(){
        setTimeout(p.redraw.bind(this), 500);
    }

    const _renderMandelbrotSet = function(state){
        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {

                let Z = Complex.of(
                    normalize(i, 0, WIDTH, -2.5, 2.5),
                    normalize(j, 0, HEIGHT, -2.5, 2.5)
                );

                let C = Complex.of(Z);

                let num_iters = 0;

                while (Z.magnitude() < state.upperBound &&
                       num_iters < state.maxIterations) {
                    // Mandelbrot's equation: Zn+1 = Zn^2 + C
                    Z = Z.multiply(Z).add(C);
                    num_iters++;
                }

                let colorValue;

                if (state.escapeColoring && num_iters === state.maxIterations) {
                    colorValue = 0;
                }
                
                colorValue = _normalizeRGBValue(num_iters, state.maxIterations);
                Red = state.red + colorValue;
                Green = state.green + colorValue;
                Blue = state.blue + colorValue;
                
                let pixel = (i + j * WIDTH) * 4;
                p.pixels[pixel] = Red > 255 ? _normalizeRGBValue(state.red + colorValue) : Red;
                p.pixels[pixel+1] = Green > 255 ? _normalizeRGBValue(state.green + colorValue) : Green;
                p.pixels[pixel+2] = Blue > 255 ? _normalizeRGBValue(state.blue + colorValue): Blue;
                p.pixels[pixel+3] = 250;//_normalizeRGBValue(state.alpha + colorValue);
            }
        }
        p.updatePixels();
    }


    const _normalizeRGBValue = (val, maxValue=510) => {
        // TODO: memoize me
      // Scale @param val from a range of 0 to @param maxValue
      //   to a range of 0 to 255 (RGB values)
      
        let value = normalize(val, 0, maxValue, 0, 1);
        return normalize(Math.sqrt(value), 0, 1, 0, 255);
    }
});