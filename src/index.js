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

    // Create a slider for numberOfIterations
    const numItersSlider = Slider({
        DOM: sources.DOM,
        props: itrProps$      
    });

    // Create a toggle button for `Escape Coloring` param
    const escBtn = ToggleButton({ 
        DOM: sources.DOM,
        props: { label: "Escape Coloring" } 
    });

    const numItersView$ = numItersSlider.DOM;
    const numItersState$ = numItersSlider.value;

    const escColoringView$ = escBtn.DOM;
    const escColoringState$ = escBtn.state;


    const AppView$ = xs.combine(numItersView$, escColoringView$)
        .map(([itersView, escView]) => 
            div([ itersView, escView ])
        );

    const AppState$ = xs.combine(numItersState$, escColoringState$)
        .map(([iters, esc]) => ({ iters, esc }));

    
    return { DOM: AppView$, Sketch: AppState$ }
}


const Drivers = {
    DOM: makeDOMDriver('#controls'),
    Sketch: makeSketchDriver(MandelbrotSet)
}


run(main, Drivers);