import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { GameManager } from '../../modules/game/gameManager';
import { PlayPage } from '../play/play';


@Component({
    selector: 'sampler-page',
    templateUrl: 'sampler-view.html'
})
export class SamplerPage {
        
    private faceLabel: string;    
    private videoSource: any;
    private current: Number = 0;
    private max: Number = 3;
    private samplesAdded = 0;
    private gameManager: GameManager;
    navCtrl: NavController;
    showButton = 'capture';

    constructor (navCtrl: NavController, gameManager: GameManager) {
        this.navCtrl = navCtrl;
        this.gameManager = gameManager;
        this.faceLabel = this.gameManager.getNextFaceLabel();
        this.videoSource = this.gameManager.getVideoSource();
    }

    capture () {
        this.showButton = '';
        this.gameManager.addSamples(this.faceLabel)
            .then(() => {            
                console.log('samples added');
                this.showButton = 'next';
            });
    }

    next () {
        this.faceLabel = this.gameManager.getNextFaceLabel();
        if (this.faceLabel === 'end') {
            this.navCtrl.push(PlayPage);
        }
        this.showButton = 'capture';
    }

}
  