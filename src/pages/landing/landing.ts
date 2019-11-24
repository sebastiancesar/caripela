import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { SamplerPage } from '../sampler/sampler';
import { GameManager } from '../../modules/game/gameManager';


@Component({
  selector: 'landing-page',
  templateUrl: 'landing.html'
})
export class LandingPage {

  webcamStream: MediaStream;
  navCtrl: NavController;
  videoLoaded: Boolean = false;
  private gameManager: GameManager;

  constructor(navCtrl: NavController, platform: Platform, gameManager: GameManager) {
    this.navCtrl = navCtrl;
    this.gameManager = gameManager;

    platform.ready()
      .then(() => {
        this.init();
      });
  }

  init() {
    this.gameManager.init()
      .then(() => {
        this.webcamStream = this.gameManager.getWebcamStream();
        this.videoLoaded = true;
      })
  }

  reset() {
    this.gameManager.reset();
  }

  start() {
    this.gameManager.initSession();
    this.navCtrl.push(SamplerPage);
  }

}
