import xs from 'xstream'
import {div, input, label} from '@cycle/dom'

const cssClass = '.toggle-button';
const attrs = {
    type: 'checkbox'
};

export default function toggleButton(sources){
    const state$ = sources.DOM
        .select(cssClass)
        .events('change')
        .map(ev => ev.target.checked)
        .startWith(false)
        .debug(`[ToggleButton State] "${sources.props.label}"`);

    const view$ = state$
        .map(toggled =>
            div([
                label(sources.props.label),
                input(cssClass, { attrs })
            ])
        );
    
    return {
        DOM: view$,
        state: state$.map(state => state)
    }
}