import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { GameManager } from '../../modules/game/gameManager';
import { TrainingPage } from '../training/training';


@Component({
    selector: 'sampler-page',
    templateUrl: 'sampler-view.html'
})
export class SamplerPage {
        
    private faceLabel: string;    
    private videoSource: any;        
    private gameManager: GameManager;
    private navCtrl: NavController;
    private showButton = 'capture';

    // Round timer
    private current: Number = 0;
    private max: Number = 10;
    private capturing = false;

    constructor (navCtrl: NavController, gameManager: GameManager) {
        this.navCtrl = navCtrl;
        this.gameManager = gameManager;
        this.faceLabel = this.gameManager.getNextFaceLabel();
        this.videoSource = this.gameManager.getVideoSource();
    }

    capture () {
        this.capturing = true;
        this.current = 10;
        this.showButton = '';
        this.gameManager.addSamples(this.faceLabel)
            .then(() => {            
                console.log('samples added');
                this.capturing = false;
                this.next();
            });
    }

    next () {
        this.current = 0;                
        const nextFace = this.gameManager.getNextFaceLabel();
        if (nextFace === 'end') {
            this.navCtrl.push(TrainingPage);
        } else {
            this.faceLabel = nextFace;
        }
        this.showButton = 'capture';
    }
}
  