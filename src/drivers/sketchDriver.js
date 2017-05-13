import xs from 'xstream';
import {adapt} from '@cycle/run/lib/adapt';


export default function makeSketchDriver(App){
	
	function sketchDriver(outgoing$){
		outgoing$.addListener({
			next: outgoingParams => {
				console.log("Sending the following to our sketch", outgoingParams);
			},
			error: err => {
				console.error("Whoops, something went wrong with this: ", err);
			},
			complete: () => {
				console.log("Finished sending params to our sketch.");
			}
		});

		const incoming$ = xs.create({
			start: listener => {
				listener.next({ foo: 'bar'})
			},
			stop: () => {}
		});

		return adapt(incoming$);
	}

	return sketchDriver;
}