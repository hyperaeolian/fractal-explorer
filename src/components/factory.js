import Rx from 'rxjs'
import isolate from '@cycle/isolate'
import Slider from './slider'
import Button from './button'
import ToggleButton from './toggleButton'


export function Register(components){
    return {
        views: components.map(cmpnt => cmpnt.view$),
        states: components.map(cmpnt => cmpnt.state$)
    }
}

export function ComponentFactory(sources){

    let id = 0;

    const components = {
        Button, Slider, ToggleButton
    }

    return type => {
        return props => {
            const params = {
                DOM: sources.DOM,
                props: Rx.Observable.of(props)
            };

            const componentType = components[type];

            const component = isolate(componentType)(params);

            return {
                id: id++,
                instance: component,
                view$: component.DOM,
                state$: component.value
            }
        }

    }
}