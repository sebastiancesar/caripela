import { Component, Output, Input, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';


@Component({
    selector: 'final-countdown',
    templateUrl: 'countdown.html'
})
export class FinalCountdown implements OnInit {
    
    private subscribeInterval: any;
    private length: string;
    private countdown: string;    
    @Input() private options: any;
    private apiCountdown: Subject<any>;
    
    constructor () {            
        
    }
    
    ngOnInit(): void {
        this.length = this.options.length + '.00';
        this.countdown = this.length;
        this.apiCountdown = this.options.api;
        this.configStream();
    }
    
    start () {        
        const totalLength = this.options.length * 100;
        let obs = Observable.interval(100)
            .take(totalLength);
        
        let updateTime = () => {
            this.countdown = (parseFloat(this.countdown) - 0.100).toFixed(2).toString();
            if (parseFloat(this.countdown) <= 0) {            
                this.finish();
            }
        };        
        this.subscribeInterval = obs.subscribe(updateTime.bind(this));        
    }

    finish () {
        this.apiCountdown.next({name: 'finished'});
        this.subscribeInterval.unsubscribe();
    }

    reset () {
        this.countdown = this.length;
        try {
            this.subscribeInterval.unsubscribe();
        } catch (err) {
            console.log('nothing to unsubscribed');
        }

    }

    configStream () {
        this.apiCountdown.subscribe((event) => {
            switch (event.name) {
                case 'start':
                    this.start();
                    break;                
                case 'reset':
                    this.reset();
                    break;
            }
        });
    }

}


