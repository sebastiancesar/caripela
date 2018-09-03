import { RecoWsClient } from './wsClient';
import { Observable } from 'rxjs';


export class RecoServerRemote {

    client: RecoWsClient;
    
    constructor () {        
        this.client = new RecoWsClient().init();
    }

    reset (): void {
        this.client.emit('backend_reset');
    }

    addSample (sample, class_id) {
        const data = { sample: sample, class_id: class_id };
        this.client.emit('backend_add_sample', data);
    }

    train () : Promise<void> {
        this.client.emit('backend_train');
        return new Promise<void>((resolve) => {
            this.client.on('training_completed', () => {
                resolve();
            });
        });
    }

    predict (sample) {
        this.client.emit('backend_predict', { sample: sample });
    }

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