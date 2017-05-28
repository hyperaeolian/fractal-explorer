import xs from 'xstream'
import isolate from '@cycle/isolate'
import Slider from './slider'
import ToggleButton from './toggleButton' 


export default class ComponentFactory {
	constructor(sources){
		this._sources = sources;
	}

	createSlider(props){
		const params = {
			DOM: this._sources.DOM,
			props: xs.of(props),
		};

		const slider = isolate(Slider)(params);
		
		return {
			instance: slider,
			view$: slider.DOM,
			value$: slider.value
		}
	}

	createToggleButton(props){
		const params = {
			DOM: this._sources.DOM,
			props
		};

		const button = isolate(ToggleButton)(params);

		return {
			instance: button,
			view$: button.DOM,
			state$: button.state
		}
	}
}