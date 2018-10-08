import { RecoWsClient } from './wsClient';
import { Observable } from 'rxjs';


export class SessionService {

    private sessionId: string;

    constructor () {
        try {
            this.sessionId = this.getSession();
        } catch (err) {
            this.sessionId = this.generateId();
            this.setSession(this.sessionId);
        }
    }

    generateId () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    setSession (sessionId) {
        localStorage.setItem('caripela_session', sessionId);
    }

    getSession () {
        const sessionId = localStorage.getItem('caripela_session');
        if (!sessionId) {
            throw new Error('No session created!');
        }
        return sessionId;
    }
}


export class RecoServerRemote {

    client: RecoWsClient;
    private sessionService: SessionService;
    private sid: string;

    constructor () {        
        this.client = new RecoWsClient().init();
        this.sessionService = new SessionService();
        this.sid = this.sessionService.getSession();
    }

    initSession () {
        this.client.emit('backend_new_session', { sessionId: this.sid });
    }

    reset (): void {
        this.client.emit('backend_reset', { sessionId: this.sid });
    }

    addSample (sample, class_id) {
        const data = { sessionId: this.sid, sample: sample, class_id: class_id };
        this.client.emit('backend_add_sample', data);
    }

    // getClassesImg () : Promise<void> {
    //     this.client.emit('backend_get_img_classes', { sessionId: this.sid });
    //     return new Promise<void>((resolve) => {
    //         this.client.on('training_img_classes', (response) => {
    //             resolve(response.img_classes);
    //         });
    //     });
    // }

    train () : Promise<void> {
        this.client.emit('backend_train', { sessionId: this.sid });
        return new Promise<void>((resolve) => {
            this.client.on('training_completed', () => {
                resolve();
            });
        });
    }

    predict (sample) {
        this.client.emit('backend_predict', { sessionId: this.sid, sample: sample });
    }

    // onClassSamplesCompleted () {
    //     return new Observable((observer) => {
    //         this.client.on('trainig_img_classes', (response) => {
    //             observer.next(response);
    //         });
    //     });
    // }

    onPredictedObservable () {
        return new Observable((observer) => {
            this.client.on('server_predicted', (response) => {                
                observer.next(response);
            });            
        });
    }

    removeOnPredicted(cb) {
        this.client.removeListener('server_predicted', cb);
    }
}
