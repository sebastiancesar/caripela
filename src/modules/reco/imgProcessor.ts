import { ImgProcessorClient, ImgProcessorWsClient } from './wsClient';
import { Observable } from 'rxjs';
import { SessionService } from './sessionHandler';

const IMG_PROCESSOR_ENDPOINT = 'https://192.168.1.100:5000';
const NEW_SESSION = 'backend_new_session';
const RESET = 'backend_reset';
const ADD_SAMPLE = 'backend_add_sample';
const TRAIN = 'backend_train';
const TRAINING_COMPLETED = 'training_completed';
const PREDICT = 'backend_predict';

export interface ImgProcessor {
  initSession: Function,
    reset: Function,
    addSample: Function,
    train: Function,
    predict: Function,
    onPredictedObservable: Function,
    removeOnPredicted: Function
}

export class ImgProcessorServer implements ImgProcessor {

  client: ImgProcessorClient;
  private sessionService: SessionService;
  private sid: string;

  constructor() {
    this.client = new ImgProcessorWsClient(IMG_PROCESSOR_ENDPOINT).init();
    this.sessionService = new SessionService();
    this.sid = this.sessionService.getSession();
  }

  /**
   * Create a new session in the ImgProcessor server using the sessionId stored
   * in this.sid
   */
  initSession() {
    this.client.emit(NEW_SESSION, {
      sessionId: this.sid
    });
  }

  reset() {
    this.client.emit(RESET, {
      sessionId: this.sid
    });
  }

  addSample(sample, class_id: string) {
    const data = {
      sessionId: this.sid,
      sample: sample,
      class_id: class_id
    };
    this.client.emit(ADD_SAMPLE, data);
  }

  train(): Promise < void > {
    this.client.emit(TRAIN, {
      sessionId: this.sid
    });
    return new Promise < void > ((resolve) => {
      this.client.on(TRAINING_COMPLETED, () => {
        resolve();
      });
    });
  }

  predict(sample) {
    this.client.emit(PREDICT, {
      sessionId: this.sid,
      sample: sample
    });
  }

  onPredictedObservable() {
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
