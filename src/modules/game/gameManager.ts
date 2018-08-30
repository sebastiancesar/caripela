import { Injectable } from '@angular/core';
import { Reco } from '../reco/reco';
import { CaptureBrowserService } from '../../modules/capture/captureBrowser';
import { Game } from './game';

const BASIC_FACES = ['Nabo', 'Bragueta', 'Mamerto', 'Zapato'];

@Injectable()
export class GameManager {
    
    private captureService: CaptureBrowserService;
    private currentGame: Game;
    private reco: Reco;

    constructor (captureService: CaptureBrowserService) {
        this.captureService = captureService;
    }

    createNewGame () : Game {
        this.reco = new Reco(this.captureService);
        let game = new Game(BASIC_FACES);
        this.currentGame = game;
        return game;
    }

    init () {
        return this.captureService.setup();        
    }

    reset () {
        this.reco.reset();
        let game = new Game(BASIC_FACES);
        this.currentGame = game;
        return game;
    }

    getVideoSource () {
        return this.captureService.getVideoSrc();
    }

    getNextFaceLabel () : string {
        if (this.currentGame.currentFace === this.currentGame.faceLabels.length) {
            this.reco.train();
            return 'end';
        }        
        return this.currentGame.getNextFaceLabel();
    }
    
    addSamples (faceLabel) {
        let statusAdded = this.currentGame.getSamplesAdded();
        const classId = this.getClassIdForLabel(faceLabel);
        return this.reco.addSamples(classId, statusAdded);
        // return statusAdded[classId];
    }

    startObservable () {
        return this.reco.startObservable();
    }

    // start (lastPrediction) {
    //     return this.reco.start(lastPrediction);
    // }

    // stop () {
    //     return this.reco.stop();
    // }
    
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