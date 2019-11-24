import { Injectable } from '@angular/core';
import { Reco } from '../reco/reco';
import { CaptureBrowserService } from '../../modules/capture/captureBrowser';
import { Game } from './game';

const BASIC_FACES = ['Nabo', 'Bragueta', 'Mamerto', 'Zapallo'];

@Injectable()
export class GameManager {

  private captureService: CaptureBrowserService;
  private currentGame: Game;
  private reco: Reco;
  private samplesPerClass: Array < any > = [];

  constructor(captureService: CaptureBrowserService) {
    this.captureService = captureService;
    this.reco = new Reco(this.captureService);
  }

  init() {
    return this.captureService.setup();
  }

  initSession(): Game {
    this.reco.initSession();
    return this.reset();
  }

  reset(): Game {
    this.reco.reset();
    let game = new Game(BASIC_FACES);
    this.currentGame = game;
    return game;
  }

  getWebcamStream(): MediaStream {
    return this.captureService.getWebcamStream();
  }

  getNextFaceLabel(): string {
    if (this.currentGame.isLastFace()) {
      this.prepareSamplesPerClass();
      return 'end';
    }
    return this.currentGame.getNextFaceLabel();
  }

  getSamplesPerClass() {
    return this.samplesPerClass;
  }

  private prepareSamplesPerClass() {
    let samples = this.currentGame.getSamples();

    for (let index in samples) {
      let sampleHolder = {
        class_id: index,
        label: samples[index].label,
        sample: ''
      };
      sampleHolder.sample = this.getImage(samples[index]);
      this.samplesPerClass[index] = sampleHolder;
    }

    return this.samplesPerClass;
  }

  private getImage(sampleHolder) {
    let img = sampleHolder.samples[10];
    return 'data:image/jpeg;base64,' + img;
  }

  // onSampleClassCompleted () {
  //     return this.reco.onClassSamplesCompleted()
  //         .subscribe((imageClass: any) => {
  //             let sampleHolder = { 
  //                 class_id: imageClass.class_id, 
  //                 label: BASIC_FACES[parseInt(imageClass.class_id)], 
  //                 sample: 'data:image/jpeg;base64,' + imageClass.image 
  //             };
  //             this.samplesPerClass.push(sampleHolder);                
  //         });            
  // }

  addSamples(faceLabel) {
    const classId = this.getClassIdForLabel(faceLabel);
    return this.reco.addSamples(classId)
      .then((samplesHolder) => {
        this.currentGame.samplesAdded(samplesHolder);
      });
  }

  train() {
    return this.reco.train();
  }

  // getClassesImg () : Promise<Array<void>> {
  //     return this.reco.getClassesImg()
  //         .then((img_classes: any) => {
  //             let result = [];
  //             for (const key in Object.keys(img_classes)) {
  //                 let sampleHolder = { 
  //                     class_id: key, 
  //                     label: BASIC_FACES[parseInt(key)], 
  //                     sample: 'data:image/jpeg;base64,' + img_classes[key] };
  //                 result.push(sampleHolder);
  //             }                    
  //             return result;
  //         });
  // }

  startObservable() {
    return this.reco.startObservable();
  }

  stopObservable() {
    return this.reco.stopObservable();
  }

  getFacesLabel() {
    return BASIC_FACES;
  }

  getRandomFace() {
    return this.currentGame.getRandomFace();
  }

  private getClassIdForLabel(label) {
    return BASIC_FACES.indexOf(label);
  }
}
