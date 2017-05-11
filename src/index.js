import Complex from './complex';

const MAX_ITERATIONS = 100;
const INFINITY = 20;


window.setup = function() {
    createCanvas(200, 200);
    loadPixels();
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {

        let Z = Complex.of(
            map(i, 0, width, -2.5, 2.5),
            map(j, 0, height, -2.5, 2.5)
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

        let pix = (i + j * width) * 4;
        pixels[pix + 0] = colorValue;
        pixels[pix + 1] = colorValue;
        pixels[pix + 2] = colorValue;
        pixels[pix + 3] = 255;
        }
    }
    updatePixels();
}

window.draw = function() {

}


const normalizeToRGBValue = (val, maxValue) => {
  /*
   * Take a value from 0 to @param maxValue
   *   and map it to a scale of 0 to 255
   */
    let value = map(val, 0, maxValue, 0, 1);
    return map(sqrt(value), 0, 1, 0, 255);
}