import debounce from 'xstream/extra/debounce'

const loadingScreenEl = document.getElementById('busy-indicator-container');

export default function makeSketchDriver(App){

    return outgoing$ => {
        outgoing$
            .compose(debounce(500))
            .addListener({
                next: params => {
                    loadingScreenEl.style.display = 'block';
                    // TODO: refactor timeouts using cycle
                    new Promise((resolve, reject) => {
                        setTimeout(() => { App.update(params); }, 1000);
                        resolve();
                    }).then(() => {
                        setTimeout(() => {
                            loadingScreenEl.style.display = 'none';
                        }, 1000);
                    }, err => console.error(err));
                },
                error: err => console.error("[Error] Sketch Driver -- ", err),
                complete: () => {}
            });
    }
}