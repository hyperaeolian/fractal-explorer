import xs from 'xstream'
import run from '@cycle/run'
import {h3, div, input, label, makeDOMDriver} from '@cycle/dom'

import makeSketchDriver from './drivers/sketchDriver'
import MakeSlider from './components/slider'

import MandelbrotSet from './fractals/mandelbrot'


function main(sources){

    // Create a stream from the props for the iters slider
    const itrProps$ = xs.of({
        label: 'Number of Iterations',
        min: 100,
        max: 800,
        step: 10,
        value: 100
    });

    // Create a slider for numberOfIterations
    const numItersSlider = MakeSlider({
        DOM: sources.DOM,
        props: itrProps$      
    });

    const numItersVTree$ = numItersSlider.DOM;
    const numItersValue$ = numItersSlider.value;

    const virtualDOM$ = numItersVTree$.map(tree => div([ tree ]));

    return { DOM: virtualDOM$, Sketch: numItersValue$ }
}


const Drivers = {
    DOM: makeDOMDriver('#controls'),
    Sketch: makeSketchDriver(MandelbrotSet)
}


run(main, Drivers);