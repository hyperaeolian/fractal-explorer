import {div, br, button} from '@cycle/dom'

const CSS_CLASS = '.cyc-button';

export default function Button(input$){

   const state$ = input$.DOM
        .select(CSS_CLASS)
        .events('click')
        .map(e => true)
        .startWith(false)
        .shareReplay(1);

    const view$ = state$
        .map(wasClicked =>
            div([ button(CSS_CLASS, input$.props.label) ])
        );

    // Pass the template and updated value back to the parent
    const sinks = {
        DOM: view$,
        value: state$.map(state => state.value)
    };

    return sinks;
}