import {run} from '@cycle/run'
import {h3, div, input, label, makeDOMDriver} from '@cycle/dom'

import makeSketchDriver from './drivers/sketchDriver';
import MandelbrotSet from './fractals/mandelbrot';

const FractalApp = new window.p5(MandelbrotSet);

function main(sources){
    const input$ = sources.DOM
        .select('#numIterations')
        .events('input');

    const numIterations$ = input$
        .map(e => e.target.value)
        .startWith('100');

    const virtualDOM$ = numIterations$.map(numIters => {
        return div([
            h3(numIters|0),
            label('Number of Iterations'),
            input('#numIterations', {
                attrs: {
                    type: 'range',
                    min: 100,
                    value: numIters|0,
                    max: 1000,
                    step: 100
                }
            })
        ])
    });

    return { DOM: virtualDOM$ }
}

run(main, { 
    DOM: makeDOMDriver('#controls'),
    sketch: makeSketchDriver(FractalApp)
});
