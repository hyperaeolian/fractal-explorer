import Complex from '../complex'

// Parameters for user control: Iterations, Infinity, Color, Zoom

export default new window.p5(function(p){
    
    const WIDTH = 550;
    const HEIGHT = 550;

    const normalize = p.map;

    let MaxIterations = 100;
    let UpperBound = 50;
    let ColorEscapedPixels = false;


    p.update = function(state) {
        MaxIterations = state.iters|0;
        UpperBound = state.bound;
        ColorEscapedPixels = state.esc;
    }


    p.setup = function(){
        p.createCanvas(WIDTH, HEIGHT)
            .parent('renderedOutputArea');
        p.loadPixels();
        p.pixelDensity(1);
        p.noLoop();
    }


    p.draw = function(){
         _renderMandelbrotSet(
            MaxIterations,
            ColorEscapedPixels,
            UpperBound
        );
    }


    p.mouseReleased = function(){
        p.redraw();
    }

    const _renderMandelbrotSet = function(
        max_iters,
        colorEsc,
        upperBound)
    {
        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {

                let Z = Complex.of(
                    normalize(i, 0, WIDTH, -2.5, 2.5),
                    normalize(j, 0, HEIGHT, -2.5, 2.5)
                );

                let C = Complex.of(Z);

                let num_iters = 0;

                while (Z.magnitude() < upperBound && num_iters < max_iters) {
                    // Mandelbrot's equation: Zn+1 = Zn^2 + C
                    Z = Z.multiply(Z).add(C);
                    num_iters++;
                }

                let colorValue = _normalizeToRGBValue(num_iters, max_iters);

                if (colorEsc && num_iters === max_iters) {
                    colorValue = 0;
                }

                let pixel = (i + j * WIDTH) * 4;
                p.pixels[pixel + 0] = colorValue;
                p.pixels[pixel + 1] = colorValue;
                p.pixels[pixel + 2] = colorValue;
                p.pixels[pixel + 3] = 255;
            }
        }
        p.updatePixels();
    }


    const _normalizeToRGBValue = (val, maxValue) => {
      // Scale @param val from a range of 0 to @param maxValue
      //   to a range of 0 to 255 (RGB values)
      
        let value = normalize(val, 0, maxValue, 0, 1);
        return normalize(Math.sqrt(value), 0, 1, 0, 255);
    }
});