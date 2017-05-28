import xs from 'xstream'
import * as Cycle from '@cycle/run'
import {h3, p, div, input, label, makeDOMDriver} from '@cycle/dom'

import makeSketchDriver from './drivers/sketchDriver'
import MandelbrotSet from './fractals/mandelbrot'
import ComponentFactory from './components/factory'


function main(sources){

    const Factory = new ComponentFactory(sources);

    const itrSlider = Factory.createSlider({
        label: 'Number of Iterations',
        min: 100,
        max: 800,
        step: 10,
        value: 100
    });

    const infSlider = Factory.createSlider({
        label: 'Upper Bound',
        min: 10,
        max: 100,
        step: 1,
        value: 20
    });

    const escButton = Factory.createToggleButton({
        label: "Escape Coloring"
    });

    const AppView$ = xs.combine(
        itrSlider.view$,
        infSlider.view$,
        escButton.view$
        ).map(views => div([ ...views ]));

    const AppState$ = xs.combine(
        itrSlider.value$,
        infSlider.value$,
        escButton.state$
        ).map(([iters, bound, esc]) => ({ iters, bound, esc }));

    
    return {
        DOM: AppView$,
        Sketch: AppState$
    }
}


Cycle.run(main, {
    DOM: makeDOMDriver('#controls'),
    Sketch: makeSketchDriver(MandelbrotSet)
});