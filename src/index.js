import xs from 'xstream'
import * as Cycle from '@cycle/run'
import {h3, p, div, input, label, makeDOMDriver} from '@cycle/dom'

import makeSketchDriver from './drivers/sketchDriver'
import MandelbrotSet from './fractals/mandelbrot'
import {Register, ComponentFactory} from './components/factory'


function main(sources){

    const Factory = ComponentFactory(sources);
    const createSlider = Factory('Slider');
    const createToggleButton = Factory('ToggleButton');

    const itrSlider = createSlider({
        label: 'Number of Iterations',
        min: 10,
        max: 800,
        step: 10,
        value: 10
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

    const colorSliders = ['Red', 'Green', 'Blue']
        .map(label => createSlider(
            Object.assign(
                { label: `Color--${label}`},
                colorSliderParams
            ))
        );

    const escButton = createToggleButton({
        label: "Escape Coloring"
    });

    // TODO: create reset button to clear params

    // Register our components so that we can perform bulk
    //  operations on them
    const registry = Register([
        itrSlider,
        infSlider,
        ...colorSliders,
        escButton
    ]);

    // Put component states in a form that's readable for the sketch
    const makeStatesObject = states => ({
            "iterations": states[itrSlider.id],
            "bound": states[infSlider.id],
            "red": states[colorSliders[0].id],
            "green": states[colorSliders[1].id],
            "blue": states[colorSliders[2].id],
            "esc": states[escButton.id]
    });

    const AppView$ = xs.combine(...registry.views)
        .map(views => div([ ...views ]));

    const AppState$ = xs.combine(...registry.states)
        .map(states => makeStatesObject(states));

    
    return {
        DOM: AppView$,
        Sketch: AppState$
    }
}


Cycle.run(main, {
    DOM: makeDOMDriver('#controls'),
    Sketch: makeSketchDriver(MandelbrotSet)
});