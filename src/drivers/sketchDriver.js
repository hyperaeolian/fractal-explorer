import xs from 'xstream'


export default function makeSketchDriver(App){
    
    function sketchDriver(parameters$){
        parameters$.addListener({
            next: params => App.update(params),
            error: err => { console.warn("[Error] Sketch Driver -- ", err); },
            complete: () => {}
        });
    }

    return sketchDriver;

}