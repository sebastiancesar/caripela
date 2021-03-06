import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { GameManager } from '../../modules/game/gameManager';
import { TrainingPage } from '../training/training';
import { LandingPage } from '../landing/landing';


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
  private current: Number = 0; // percentage completed in the widget.TODO extract to another component
  private max: Number = 10; // the same, related with the progress bar in percetange.
  private capturing = false;

  constructor(navCtrl: NavController, gameManager: GameManager) {
    this.navCtrl = navCtrl;
    this.gameManager = gameManager;
    this.faceLabel = this.gameManager.getNextFaceLabel();
    this.videoSource = this.gameManager.getWebcamStream();
  }

  /**
   * Triggers the capturing pictures frenzy!
   */
  capture() {
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

  /** 
   * Iterate over the Categories and jump to the Training page when there are 
   * no more categories 
   */
  next() {
    const nextFace = this.gameManager.getNextFaceLabel();
    this.current = 0;
    if (nextFace === 'end') {
      this.navCtrl.push(TrainingPage);
    } else {
      this.faceLabel = nextFace;
    }
    this.showButton = 'capture';
  }

  reset() {
    this.gameManager.reset();
    this.navCtrl.push(LandingPage);
  }
}
