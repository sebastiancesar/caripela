import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { GameManager } from '../../modules/game/gameManager';
import { Animations } from '../play/animations';
import { PlayPage } from '../play/play';
import { LandingPage } from '../landing/landing';

const MOCK_FACES = [{ label: 'nabo', sample: '' }, { label: 'nabo', sample: ''}, { label: 'nabo', sample: '' }, { label: 'nabo', sample: '' }];
@Component({
  selector: 'training-page',
  templateUrl: 'training.html',
  animations: [Animations.start]
})
export class TrainingPage {

  private labelsLength: Array < number > = [0, 1, 2, 3];
  private navCtrl: NavController;
  private gameManager: GameManager;
  private facesLabel: Array < any > = [];
  private training: boolean = true;
  startState = 'hiddenStart';

  constructor(navCtrl: NavController, gameManager: GameManager) {
    this.navCtrl = navCtrl;
    this.gameManager = gameManager;
    this.gameManager.train()
      .then(() => {
        this.training = false;
        this.startDone();
      });
    this.facesLabel = this.gameManager.getSamplesPerClass();
  }

  startDone() {
    this.startState = 'visibleStart';
    let startFn = () => {
      this.navCtrl.push(PlayPage);
    };
    setTimeout(startFn, 1000);
  }

  reset() {
    this.gameManager.reset();
    this.navCtrl.push(LandingPage);
  }

  /* MOCK methods, only for quick testing */
  startMock() {
    this.facesLabel = MOCK_FACES;
    let fn = () => {
      this.training = false;
      this.startState = 'visibleStart';
    };
    setTimeout(fn.bind(this), 2000);
  }

  restartMock() {
    this.startState = 'hiddenStart';
    this.training = true;
    let fn = () => {
      this.training = false;
      this.startState = 'visibleStart';
    };
    setTimeout(fn.bind(this), 2000);
  }
}
