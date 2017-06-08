import debounce from 'xstream/extra/debounce'

export default function makeSketchDriver(App){
    
    return parameters$ => {
        parameters$
        .compose(debounce(500))
        .addListener({
            next: params => App.update(params),
            error: err => console.warn("[Error] Sketch Driver -- ", err),
            complete: () => {}
        });
    }
}