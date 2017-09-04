import {div, strong, input, label} from '@cycle/dom'

const cssClass = '.toggle-button';

export default function toggleButton(input$){

    const update$ = input$.DOM
        .select(cssClass)
        .events('change')
        .map(event => event.target.checked)
        .startWith(false);
    
    const state$ = input$.props
        .map(props => update$
            .map(isChecked => ({
                label: props.label,
                value: isChecked
            }))
            // .startWith(props)
        ).switch()
        .shareReplay(1);

    const view$ = state$
        .map(newState => 
            div([
                label(strong(newState.label)),
                input(cssClass, { 
                    attrs: {
                        type: 'checkbox',
                        value: newState.value
                    } 
                })
            ])
        );


    const output$ = {
        DOM: view$,
        value: state$.map(state => state.value)
    }

    return output$;
}