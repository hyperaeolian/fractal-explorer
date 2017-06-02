import * as Cycle from '@cycle/rxjs-run'
import Rx from 'rxjs'
import {h3, p, div, input, label, makeDOMDriver} from '@cycle/dom'

import makeSketchDriver from './drivers/sketchDriver'
import MandelbrotSet from './fractals/mandelbrot'
import {Register, ComponentFactory} from './components/factory'


function main(sources){

    const Factory = ComponentFactory(sources);
    const createSlider = Factory('Slider');
    const createToggleButton = Factory('ToggleButton');

    const itrSlider = createSlider({
        label: 'Iterations',
        min: 10,
        max: 1000,
        step: 10,
        value: 100
    });

    const infSlider = createSlider({
        label: 'Escape Radius',
        min: 10,
        max: 100,
        step: 1,
        value: 20
    });

    const hsbSliderParams = {
        min: 0,
        max: 255,
        step: 5,
        value: 0
    };

    const hsbSliders = ['Hue', 'Saturation', 'Brightness']
        .map(label => createSlider(
            Object.assign(
                { label: `Color--${label}`},
                hsbSliderParams
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
        ...hsbSliders,
        escButton
    ]);

    // Put component states in a form that's readable for the sketch
    const makeStatesObject = states => ({
            "iterations": states[itrSlider.id],
            "bound": states[infSlider.id],
            "hue": states[hsbSliders[0].id],
            "saturation": states[hsbSliders[1].id],
            "brightness": states[hsbSliders[2].id],
            "esc": states[escButton.id]
    });

    const AppView$ = Rx.Observable.combineLatest(...registry.views)
        .map(views => div([ ...views ]));

    const AppState$ = Rx.Observable.combineLatest(...registry.states)
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