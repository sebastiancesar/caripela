import { Observable } from 'rxjs';
import { CaptureBrowserService } from '../capture/captureBrowser';
import { RecoServerRemote } from './servers';


export class Reco {
  
    captureService: CaptureBrowserService;
    serverML: string;
    server: any;
    startedInterval: any;
    predictedClass: number;
    predictedClassConfidence: number;
    lastPrediction: any;
    predicted: Observable<any>;
    observer: any;

    private predictSubscription: any;

    constructor (captureService: CaptureBrowserService) {
        this.captureService = captureService;
        this.server = new RecoServerRemote();                
        this.serverML = 'backend';        
    }
  
    reset(): void {
        this.server.reset();
    }
    
    getWebcamElement () {
        return this.captureService.getWebcamElement();
    }

    addSamples (classId, samplesAdded) {
        const fn = this._addSample.bind(this, classId, samplesAdded);
        return this._setIntervalSamples(fn, 50, 20);
    }

    startObservable () {                
        let timer = Observable.interval(500);
        
        this.predictSubscription = timer.subscribe(() => {
            return this._predict();
        });            
        
        return this.server.onPredictedObservable();
    }

    stopObservable () {
        this.predictSubscription.unsubscribe();
    }

    train () {
        this.server.train();
    }

    _predicted (response) {
        this.lastPrediction.classId = response.class_id;            
        this.lastPrediction.confidence = response.confidence;
        if (!this.lastPrediction) {
            this.observer.error({msg: 'Empty prediction'});
        } else {
            this.observer.next(response);
        }
    }

    _predict () {
        const img = this.captureService.capture();
        this.server.predict(img);
    }

    _addSample (classId, samplesAdded) {
        const img = this.captureService.capture();
        this.server.addSample(img, classId);
        samplesAdded += 1;
        console.log('sample added for label ', classId);
    }   

    _setIntervalSamples (fn,  delay, repetitions) {
        return new Promise((resolve, reject) => {
            var x = 0;
            var intervalID = window.setInterval(() => {    
                fn();
        
                if (++x === repetitions) {
                    window.clearInterval(intervalID);
                    resolve();
                }
            }, delay);
        });
    }
}
    // start (lastPrediction: any) {        
    //     let observable = new Observable((observer) => {
    //         this.observer = observer;
    //     });
    //     this.lastPrediction = lastPrediction;
    //     const fnPedicted = this._predicted.bind(this);
        
    //     this.server.onPredicted(fnPedicted);
    //     const fn = this._predict.bind(this);
    //     this.startedInterval = window.setInterval(fn, 500);
    //     return observable;
    // }

     // _setIntervalX (callback, delay, repetitions) {
    //     var x = 0,
    //         intervalID = window.setInterval(() => {    
    //             callback();
    
    //             if (++x === repetitions) {
    //                 window.clearInterval(intervalID);
    //             }
    //         }, delay);
    // }

    // stop () {
    //     console.log('stop');
    //     window.clearInterval(this.startedInterval);
    //     this.server.removeOnPredicted(this._predicted);
    // }