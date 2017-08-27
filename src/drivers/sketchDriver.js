import debounce from 'xstream/extra/debounce'

const loadingScreenEl = document.getElementById('_state');

export default function makeSketchDriver(App){

    return parameters$ => {
        parameters$
        .compose(debounce(500))
        .addListener({
            next: params => {
                loadingScreenEl.innerHTML = 'Rendering...';
                // TODO: refactor timeouts using cycle
                new Promise((resolve, reject) => {
                    setTimeout(() => { App.update(params); }, 1000);
                    resolve();
                }).then(() => {
                    setTimeout(() => { loadingScreenEl.innerHTML = 'Ready.'; }, 1000);
                }, err => console.error(err));
            },
            error: err => console.warn("[Error] Sketch Driver -- ", err),
            complete: () => {}
        });
    }
}