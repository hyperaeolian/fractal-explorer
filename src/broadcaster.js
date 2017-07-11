import Rx from 'rxjs'


export default class Broadcaster {
    constructor(){
        this.subjects = {};
    }

    broadcast(name, payload){
        this.subjects[name] || (this.subjects[name] = new Rx.Subject());
        this.subjects[name].next(payload);
    }

    subscribe(name, handler){
        this.subjects[name] || (this.subjects[name] = new Rx.Subject());
        return this.subjects[name].subscribe(handler);
    }

    dispose(){
        const subjects = this.subjects;
        for (var prop in subjects){
            if (Object.hasOwnProperty.call(subjects, prop)){
                subjects[prop].dispose();
            }
        }
        this.subjects = {};
    }
}
