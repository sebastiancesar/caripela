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
    private samplesPerClass: any = {};

    constructor (captureService: CaptureBrowserService) {
        this.captureService = captureService;
        this.reco = new Reco(this.captureService);
    }
    
    init () {
        return this.captureService.setup();        
    }
    
    createNewGame () : Game {
        return this.reset();        
    }

    reset () : Game {
        this.reco.reset();
        let game = new Game(BASIC_FACES);
        this.currentGame = game;
        return game;
    }

    getVideoSource () {
        return this.captureService.getVideoSrc();
    }

    getNextFaceLabel () : string {
        if (this.currentGame.isLastFace()) {
            this.prepareSamplesPerClass();
            return 'end';
        }        
        return this.currentGame.getNextFaceLabel();
    }
    
    getSamplesPerClass () {
        return this.samplesPerClass;
    }
    
    private prepareSamplesPerClass () {
        let samples = this.currentGame.getSamples();
        
        for (let index in samples) {
            let sampleHolder = { class_id: index, label: samples[index].label, sample: '' };
            sampleHolder.sample = this.getImage(samples[index]);
            this.samplesPerClass[index] = sampleHolder;
        }
            
        return this.samplesPerClass;
    }
    
    private getImage (sampleHolder) {
        let img = sampleHolder.samples[10];        
        return 'data:image/jpeg;base64,' + img;
    }

    addSamples (faceLabel) {        
        const classId = this.getClassIdForLabel(faceLabel);
        return this.reco.addSamples(classId)
            .then((samplesHolder) => {
                this.currentGame.samplesAdded(samplesHolder);
            });
    }

    train () {
        return this.reco.train();            
    }
    
    startObservable () {
        return this.reco.startObservable();
    }
    
    stopObservable () {
        return this.reco.stopObservable();
    }
 
    getFacesLabel () {
        return BASIC_FACES;
    }

    getRandomFace () {
        return this.currentGame.getRandomFace();
    }

    private getClassIdForLabel (label) {
        return BASIC_FACES.indexOf(label);
    }
}