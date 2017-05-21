import {div, label, strong, input} from '@cycle/dom'


export default function Slider(sources){

    // Get the updated value for the slider
    const update$ = sources.DOM
        .select('.slider')
        .events('input')
        .map(e => e.target.value);

    // Pass props received from parent into the slider's attrs
    const state$ = sources.props
        .map(props => update$
            .map(updatedValue => ({
                label: props.label,
                min: props.min,
                max: props.max,
                step: props.step,
                value: updatedValue
            })).startWith(props)
        ).flatten();

    // Construct the template for our labeled slider component
    const view$ = state$.map(state =>
        div('.param-slider-component', [
            label('.slider-label', [
                `${state.label}: `, strong(state.value)
            ]),
            input('.slider', {
                attrs: {
                    type: 'range',
                    min: state.min,
                    max: state.max,
                    value: state.value,
                    step: state.step
                }
            })
        ])
    );

    // Pass the template and updated value back to the parent
    const sinks = {
        DOM: view$,
        value: state$.map(state => state.value)
    };

    return sinks;
}