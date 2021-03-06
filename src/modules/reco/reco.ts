import { Observable } from 'rxjs';
import { CaptureBrowserService } from '../capture/captureBrowser';
import { ImgProcessor, ImgProcessorServer } from './imgProcessor';

const SAMPLES_PER_CLASS = 20;
const INTERVAL_BETWEEN_SAMPLES = 100; // ms
const INTERVAL_BETWEEN_CAPTURE = 500; // ms

/**
 * Encapsulate some aspect related to the Game and interact with the ImgProcessor.
 */
export class Reco {

  captureService: CaptureBrowserService;
  imgProcessor: ImgProcessor;
  startedInterval: any;
  predictedClass: number;
  predictedClassConfidence: number;
  lastPrediction: any;
  predicted: Observable < any > ;
  observer: any;

  private predictSubscription: any;

  constructor(captureService: CaptureBrowserService) {
    this.captureService = captureService;
    this.imgProcessor = new ImgProcessorServer();
  }

  initSession() {
    return this.imgProcessor.initSession();
  }

  reset() {
    this.imgProcessor.reset();
  }

  addSamples(classId) {
    let samplesHolder = {
      classId: classId,
      samples: []
    };
    return new Promise((resolve, reject) => {
      return Observable.interval(INTERVAL_BETWEEN_SAMPLES)
        .take(SAMPLES_PER_CLASS)
        .subscribe(
          this._addSample.bind(this, classId, samplesHolder),
          (err) => {
            console.error(err);
            reject(err);
          },
          () => {
            resolve(samplesHolder);
          }
        );
    });
  }

  startObservable() {
    let timer = Observable.interval(INTERVAL_BETWEEN_CAPTURE);

    this.predictSubscription = timer.subscribe(() => {
      return this._predict();
    });

    return this.imgProcessor.onPredictedObservable();
  }

  stopObservable() {
    this.predictSubscription.unsubscribe();
  }

  train(): Promise < void > {
    return this.imgProcessor.train();
  }

  _predicted(response) {
    this.lastPrediction.classId = response.class_id;
    this.lastPrediction.confidence = response.confidence;
    if (!this.lastPrediction) {
      this.observer.error({
        msg: 'Empty prediction'
      });
    } else {
      this.observer.next(response);
    }
  }

  _predict() {
    const img = this.captureService.capture();
    this.imgProcessor.predict(img);
  }

  _addSample(classId, samplesHolder) {
    const img = this.captureService.capture();
    this.imgProcessor.addSample(img, classId);
    samplesHolder.samples.push(img);
    console.log('sample added for label ', classId);
  }
}
