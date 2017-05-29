import xs from 'xstream'
import isolate from '@cycle/isolate'
import Slider from './slider'
import ToggleButton from './toggleButton' 


export function Register(components){
    return {
        views: components.map(cmpnt => cmpnt.view$),
        states: components.map(cmpnt => cmpnt.state$)
    }
}

export function ComponentFactory(sources){

    let id = 0;

    return type => {
        return props => {
            let componentType;
            let params = { DOM: sources.DOM, props };

            switch(type){
                case 'Slider':
                    params['props'] = xs.of(props);
                    componentType = Slider;
                    break;
                case 'ToggleButton':
                    componentType = ToggleButton;
                    break;
            }

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