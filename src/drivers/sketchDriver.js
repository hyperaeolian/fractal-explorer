import xs from 'xstream'


export default function makeSketchDriver(App){
	
	function sketchDriver(parameters$){
		parameters$.addListener({
			next: params => App.update(params),
			error: () => { console.warn("An error occurred in sketch Driver"); },
			complete: () => {}
		});
	}

	return sketchDriver;

}