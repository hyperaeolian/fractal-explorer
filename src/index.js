import xs from 'xstream'
import run from '@cycle/run'
import {h3, p, div, input, label, makeDOMDriver} from '@cycle/dom'
import isolate from '@cycle/isolate'
import makeSketchDriver from './drivers/sketchDriver'
import Slider from './components/slider'
import ToggleButton from './components/toggleButton'
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

    const infProps$ = xs.of({
        label: 'Upper Bound',
        min: 10,
        max: 100,
        step: 1,
        value: 20
    });

    // Create a slider for numberOfIterations
    const numItersSlider = Slider({
        DOM: sources.DOM,
        props: itrProps$      
    });

    const infinitySlider = isolate(Slider)({
        DOM: sources.DOM,
        props: infProps$
    });

    // Create a toggle button for `Escape Coloring` param
    const escBtn = ToggleButton({ 
        DOM: sources.DOM,
        props: { label: "Escape Coloring" } 
    });

    const numItersView$ = numItersSlider.DOM;
    const numItersState$ = numItersSlider.value;

    const infinityView$ = infinitySlider.DOM;
    const infinityState$ = infinitySlider.value;

    const escColoringView$ = escBtn.DOM;
    const escColoringState$ = escBtn.state;


    const AppView$ = xs.combine(numItersView$, infinityView$, escColoringView$)
        .map(([itersView, infView, escView]) => 
            div([ escView, infView, itersView ])
        );

    const AppState$ = xs.combine(numItersState$, infinityState$, escColoringState$)
        .map(([iters, bound, esc]) => ({ iters, bound, esc }));

    
    return { DOM: AppView$, Sketch: AppState$ }
}


const Drivers = {
    DOM: makeDOMDriver('#controls'),
    Sketch: makeSketchDriver(MandelbrotSet)
}


run(main, Drivers);