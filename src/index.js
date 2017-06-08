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
        step: 1,
        value: 400
    });

    const infSlider = createSlider({
        label: 'Escape Radius',
        min: 10,
        max: 100,
        step: 1,
        value: 20
    });

    const hueSlider = createSlider({
        label: "Hue",
        min: 0,
        max: 360,
        step: 1,
        value: 10
    });

    const satSlider = createSlider({
        label: "Saturation",
        min: 0,
        max: 100,
        step: 1,
        value: 10
    });

    const brightSlider = createSlider({
        label: "Brightness",
        min: 0,
        max: 100,
        step: 1,
        value: 10
    });

    const xZoomSlider = createSlider({
        label: "Zoom X",
        min: -250,
        max: 0,
        step: 10,
        value: -250
    });

    const yZoomSlider = createSlider({
        label: "Zoom Y",
        min: 0,
        max: 250,
        step: 10,
        value: 250
    });

    const escButton = createToggleButton({
        label: "Escape Coloring"
    });

    // TODO: create reset button to clear params

    // Register our components so that we can perform bulk
    //  operations on them
    const registry = Register([
        itrSlider,
        infSlider,
        hueSlider,
        satSlider,
        brightSlider,
        xZoomSlider,
        yZoomSlider,
        escButton
    ]);

    // Put component states in a form that's readable for the sketch
    const makeStatesObject = states => ({
            "iterations": states[itrSlider.id],
            "bound": states[infSlider.id],
            "hue": states[hueSlider.id],
            "saturation": states[satSlider.id],
            "brightness": states[brightSlider.id],
            "zoom": {
                x: states[xZoomSlider.id],
                y: states[yZoomSlider.id]
            },
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