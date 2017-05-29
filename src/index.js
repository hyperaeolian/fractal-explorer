import xs from 'xstream'
import * as Cycle from '@cycle/run'
import {h3, p, div, input, label, makeDOMDriver} from '@cycle/dom'

import makeSketchDriver from './drivers/sketchDriver'
import MandelbrotSet from './fractals/mandelbrot'
import {Register, ComponentFactory} from './components/factory'


function main(sources){

    const Factory = ComponentFactory(sources);
    const createSlider = Factory('Slider');
    const createButton = Factory('Button');

    const itrSlider = createSlider({
        label: 'Number of Iterations',
        min: 100,
        max: 800,
        step: 10,
        value: 100
    });

    const infSlider = createSlider({
        label: 'Upper Bound',
        min: 10,
        max: 100,
        step: 1,
        value: 20
    });

    const colorSliderParams = {
        min: 0,
        max: 255,
        step: 5,
        value: 0
    };

    // TODO: create reset button to clear params

    const colorSliders = ['Red', 'Green', 'Blue', 'Alpha']
        .map(label => createSlider(
            Object.assign(
                { label: `Color - ${label}`},
                colorSliderParams
            )
        )
    );

    const escButton = createButton({
        label: "Escape Coloring"
    });

    const registry = Register([
        itrSlider,
        infSlider,
        ...colorSliders,
        escButton
    ]);

    const AppView$ = xs.combine(...registry.views)
        .map(views => div([ ...views ]));

    const AppState$ = xs.combine(...registry.states)
        .map(([iters, bound, r, g, b, a, esc]) => ({ iters, bound, esc }));

    
    return {
        DOM: AppView$,
        Sketch: AppState$
    }
}


Cycle.run(main, {
    DOM: makeDOMDriver('#controls'),
    Sketch: makeSketchDriver(MandelbrotSet)
});