import xs from 'xstream'
import {div, strong, input, label} from '@cycle/dom'

const cssClass = '.toggle-button';

export default function toggleButton(sources){
    const state$ = sources.DOM
        .select(cssClass)
        .events('change')
        .map(ev => ev.target.checked)
        .startWith(false);

    const view$ = state$
        .map(checked =>
            div([
                label(strong(sources.props.label)),
                input(cssClass, { 
                    attrs: {
                        type: 'checkbox',
                        checked
                    } 
                })
            ])
        );

    return {
        DOM: view$,
        value: state$.map(state => state)
    }
}