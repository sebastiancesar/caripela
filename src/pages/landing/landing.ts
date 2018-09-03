import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { SamplerPage } from '../sampler/sampler';
import { PlayPage } from '../play/play';
import { TrainingPage } from '../training/training';
import { GameManager } from '../../modules/game/gameManager';


@Component({
    selector: 'landing-page',
    templateUrl: 'landing.html'
})
export class LandingPage {

    videoSource: any;
    navCtrl: NavController;
    videoLoaded: Boolean = false;
    private gameManager: GameManager;

    constructor (navCtrl: NavController, platform: Platform, gameManager: GameManager) {
        this.navCtrl = navCtrl;
        this.gameManager = gameManager;
        this.gameManager.createNewGame();
        platform.ready()
            .then(() => {                
                this.init();
            });
    }
    
    init () {
        this.gameManager.init()        
            .then(() => {                                
                this.videoSource = this.gameManager.getVideoSource();
                this.videoLoaded = true;
            })                
    }

    reset () {
        this.gameManager.reset();
    }
    
    start () {
        this.navCtrl.push(SamplerPage);
    }

}
  