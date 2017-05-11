import Complex from './complex';


const MandelbrotSet = function(p5){
    
    const MAX_ITERATIONS = 700;
    const INFINITY = 50;
    const WIDTH = 600;
    const HEIGHT = 600;


    p5.setup = function() {

        p5.createCanvas(WIDTH, HEIGHT);
        p5.loadPixels();

        for (let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {

            let Z = Complex.of(
                p5.map(i, 0, WIDTH, -2.5, 2.5),
                p5.map(j, 0, HEIGHT, -2.5, 2.5)
            );

            let C = Complex.of(Z);

            let num_iters = 0;

            while (Z.magnitude() < INFINITY && num_iters < MAX_ITERATIONS) {
                // Mandelbrot's equation: Zn+1 = Zn^2 + C
                Z = Z.multiply(Z).add(C);
                num_iters++;
            }

            let colorValue = normalizeToRGBValue(num_iters, MAX_ITERATIONS);

            // Uncomment for escape time coloring
            //if (num_iters === MAX_ITERATIONS) {
            // bright = 0;
            //}

            let pix = (i + j * WIDTH) * 4;
            p5.pixels[pix + 0] = colorValue;
            p5.pixels[pix + 1] = colorValue;
            p5.pixels[pix + 2] = colorValue;
            p5.pixels[pix + 3] = 255;
            }
        }
        p5.updatePixels();
    }

    p5.draw = function() {

    }


    const normalizeToRGBValue = (val, maxValue) => {
      /*
       * Take a value from 0 to @param maxValue
       *   and map it to a scale of 0 to 255
       */
        let value = p5.map(val, 0, maxValue, 0, 1);
        return p5.map(p5.sqrt(value), 0, 1, 0, 255);
    }
}

const FractalApp = new window.p5(MandelbrotSet);