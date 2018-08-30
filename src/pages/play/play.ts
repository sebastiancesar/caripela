import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { GameManager } from '../../modules/game/gameManager';
import { Observable } from 'rxjs'
import { Animations } from './animations';


@Component({
    selector: 'play-page',
    templateUrl: 'play.html',
    animations: [Animations.showPoint, Animations.cheerPoints,
        Animations.faceLabel ]
})
export class PlayPage {
            
    private videoSource: any;
    private gameManager: GameManager;
    private animation = false;
    private faceLabel: string;
    private startedStream: any;    
    private faceToGet: any;
    private globalPoints: number = 0;    
    private points: number = 0;
    countdown: string = '30.00';    
    private countdownInterval;
    lastPrediction = { class_id: -1, confidence: -1 };
    isPlaying = false;
    // Animations states
    heightBar: string = '0%';
    cheerPoints: boolean = false;
    pointsState = ['hiddenPoint', 'hiddenPoint', 'hiddenPoint'];
    faceLabelState = '';

    constructor (gameManager: GameManager) {
        this.gameManager = gameManager;    
        this.videoSource = this.gameManager.getVideoSource();
    }

    predicted (prediction) {
        console.log(prediction);
        this.lastPrediction.class_id = prediction.class_id;
        this.lastPrediction.confidence = prediction.confidence;
        const confidenceNumber = (parseFloat(prediction.confidence) * 100);
        if (prediction.class_id === this.faceToGet.class_id) {
            this.heightBar = confidenceNumber + '%';
            if (confidenceNumber > 96) {
                this.incrementPoint();                    
            }
        }
    }

    getRandom (min, max) {
        return Math.floor((Math.random() * (max - min) + min));
    } 

    startCountdown () {
        let updateTime = () => {
            this.countdown = (parseFloat(this.countdown) - 0.100).toFixed(2).toString();
            if (parseFloat(this.countdown) <= 0) {
                this.finishGame();                
            }
        };        
        this.countdownInterval = setInterval(updateTime.bind(this), 100);
    }

    finishGame () {
        clearInterval(this.countdownInterval);
        this.startedStream.unsubscribe();
        this.gameManager.stopObservable();
        this.isPlaying = false;
    }   

    start () {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.getNextFaceContinued();
            this.animation = false;            
            this.points = 0;
            this.pointsState = ['hiddenPoint', 'hiddenPoint', 'hiddenPoint'];
            this.heightBar = '0%';
            this.countdown = '30.00';
        }

        this.startCountdown();
        let obs = this.gameManager.startObservable();
        this.startedStream = obs.subscribe(this.predicted.bind(this));             
    }

    startMock () {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.getNextFaceContinued();
        }   
        this.startCountdown();
        let obs = Observable
            .interval(300)
            .map(x => { 
                return { class_id: this.getRandom(0, 3), confidence: (this.getRandom(80, 100) / 100).toFixed(2) }; 
            });
        this.startedStream = obs.subscribe(this.predicted.bind(this));
    }
    
    newFace () {
        this.animation = false;
        this.getNextFaceContinued();
        this.points = 0;
        this.pointsState = ['hiddenPoint', 'hiddenPoint', 'hiddenPoint'];
        this.heightBar = '0%';     
    }
    
    incrementPoint () {
        this.pointsState[this.points] = 'visiblePoint';
        this.animation = true;
        this.points += 1;
        if (this.points === 3) {
            this.globalPoints += 1;
            this.cheerPoints = true;
        } 
    }

    stop () {
        this.startedStream.unsubscribe();
        this.gameManager.stopObservable();
    }

    getNextFaceContinued () {        
        this.faceToGet = this.gameManager.getRandomFace();;
        this.faceLabel = this.faceToGet.label;
        this.faceLabelState = 'populated';
    }

    /* Animations callbacks */

    showPointDone () {        
        if (this.points === 3) {
            this.cheerPoints = true;
        } else {
            this.animation = false;
        }
    }

    cheerPointsDone () {
        this.cheerPoints = false;
        this.faceLabelState = 'empty';        
    }

    faceLabelDone (event) {
        if (event.toState === 'empty') {
            this.newFace();
        }
    }

    // addFace () {
    //     this.faceLabelState = 'populated';
    // }
    // removeFace () {
    //     this.faceLabelState = 'empty';
    // }
}
  