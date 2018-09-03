import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { GameManager } from '../../modules/game/gameManager';
import { Observable, Subject } from 'rxjs'
import { Animations } from './animations';
import { LandingPage } from '../landing/landing';

const EMPTY_POINTS = ['hiddenPoint', 'hiddenPoint', 'hiddenPoint'];
const CONFIDENCE_THRESHOLD = 97;
const TIMER = 30;

@Component({
    selector: 'play-page',
    templateUrl: 'play.html',
    animations: [Animations.showPoint, Animations.cheerPoints,
        Animations.faceLabel ]
})
export class PlayPage {
                
    private navCtrl: NavController;
    private videoSource: any;
    private gameManager: GameManager;
    private faceLabel: string;
    private startedStream: any;    
    private faceToGet: any = {label: '', class_id: -1, img: ''};
    private globalPoints: number = 0;    
    private points: number = 0;
    private countdownApi : Subject<any> = new Subject<any>();
    private countdownOptions: any = { length: TIMER, api: this.countdownApi };    
    private samplesPerClass: any;
    lastPrediction = { class_id: -1, confidence: -1 };
    isPlaying = false;
    // Animations states
    heightBar: string = '0%';
    cheerPoints: boolean = false;
    pointsState = EMPTY_POINTS;
    faceLabelState = '';

    constructor (navCtrl: NavController, gameManager: GameManager) {
        this.navCtrl = navCtrl;
        this.gameManager = gameManager;    
        this.videoSource = this.gameManager.getVideoSource();    
        this.configureCountdown();
        this.samplesPerClass = this.gameManager.getSamplesPerClass(); 
    }

    /* TODO merge with more streams? */
    configureCountdown () {
        let subs = (event) => {
            if (event.name === 'finished') {
                this.finishGame();
            }
        };
        this.countdownApi.subscribe(subs.bind(this));
    }


    predicted (prediction) {
        console.log(prediction);
        this.lastPrediction.class_id = prediction.class_id;
        this.lastPrediction.confidence = prediction.confidence;
        const confidenceNumber = (parseFloat(prediction.confidence) * 100);        
        if (prediction.class_id === this.faceToGet.class_id) {
            this.heightBar = confidenceNumber + '%';
            if (confidenceNumber > CONFIDENCE_THRESHOLD) {
                this.incrementPoint();                    
            }
        }
    }

    finishGame () {
        this.startedStream.unsubscribe();
        this.gameManager.stopObservable();
        this.isPlaying = false;
    }   

    start () {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.getNextFaceContinued();            
            this.points = 0;
            for (let i = 0; i <= 3; i++) {
                this.pointsState[i] = 'hiddenPoint';
            }
            this.globalPoints = 0;
            this.faceLabelState = 'empty';
            this.heightBar = '0%';
            this.countdownApi.next({name: 'reset'});
        }

        this.countdownApi.next({name: 'start'});
        let obs = this.gameManager.startObservable();
        this.startedStream = obs.subscribe(this.predicted.bind(this));             
    }
    
    newFace () {        
        this.getNextFaceContinued();
        this.points = 0;
        for (let i = 0; i <= 3; i++) {
            this.pointsState[i] = 'hiddenPoint';
        }
        this.heightBar = '0%';     
    }
    
    incrementPoint () {
        this.pointsState[this.points] = 'visiblePoint';                
        if (this.points === 3) {
            this.globalPoints += 1;
            this.cheerPoints = true;
        } else {
            this.points += 1;
        }
    }

    stop () {
        try {
            this.startedStream.unsubscribe();
            this.gameManager.stopObservable();
            this.countdownApi.next({name: 'restart'});
        } catch (err) {
            console.log('stopping');
        }
        
        if (!this.isPlaying) {
            this.navCtrl.push(LandingPage);
        }
    }

    getNextFaceContinued () {        
        this.faceToGet = this.gameManager.getRandomFace();
        this.faceToGet.img = this.samplesPerClass[this.faceToGet.class_id].sample;
        console.log('getNextFaceContinued > face to get ', this.faceToGet);
    }

    /* Animations callbacks */

    showPointDone () {        
        this.heightBar = '0%';
        if (this.points === 3) {
            this.cheerPoints = true;
        }
    }

    cheerPointsDone (event) {
        this.cheerPoints = false;
        if (event.fromState === 'cheering' &&
            event.toState === 'notCheering') {            
                this.newFace();        
        }
    }
    
    /* Mocks */
    predictMock () {
        this.predicted({class_id: this.faceToGet.class_id, confidence: 99 });
    }
    startMock () {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.getNextFaceContinued();
        }   
        this.countdownApi.next({ name: 'start'}); //startCountdown();
        let obs = Observable
            .interval(300)
            .map(x => { 
                return { class_id: this.getRandom(0, 4), confidence: (this.getRandom(80, 100) / 100).toFixed(2) }; 
            });
        this.startedStream = obs.subscribe(this.predicted.bind(this));
    }

    getRandom (min, max) {
        return Math.floor((Math.random() * (max - min) + min));
    } 

}
  