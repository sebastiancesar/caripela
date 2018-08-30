import { trigger, state, style, keyframes, transition, animate } from '@angular/animations';

const bounceOutRight = animate('1000ms', keyframes([
    style({ opacity: 1, transform: 'translate3d(-20px, 0, 0)', offset: 0.2}),
    style({ opacity: 0, transform: 'translate3d(2000px, 0, 0)', offset: 1}),                
]));

const zoomOutUp = animate('1000ms', keyframes([
    style({ opacity: 1, transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)', offset: 0.4 ,
        'animation-timing-function': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)'}),
    style({ opacity: 0, transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0)', offset: 1 ,
        'transform-origin': 'center bottom', 'animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.32, 1)'})
]));

const rubberBand = animate('1000ms' , keyframes([
    style({ transform: 'scale3d(1, 1, 1)', offset: 0}),
    style({ transform: 'scale3d(1.25, 0.75, 1)', offset: 0.3}),
    style({ transform: 'scale3d(0.75, 1.25, 1)', offset: 0.4}),
    style({ transform: 'scale3d(1.15, 0.85, 1)', offset: 0.5}),
    style({ transform: 'scale3d(0.95, 1.05, 1)', offset: 0.65}),
    style({ transform: 'scale3d(1.05, 0.95, 1)', offset: 0.75}),
    style({ transform: 'scale3d(1, 1, 1)', offset: 1})
]));

export const Animations = {
    showPoint: trigger('showPoint', [
        state('hiddenPoint', style({ visibility: 'hidden' })),
        state('visiblePoint', style({ visibility: 'visible' })),
        transition('hiddenPoint => visiblePoint', 
            animate('500ms ease-in', keyframes([
                style({ visibility: 'visible', transform: 'scale(1,1)', offset: 0 }),
                style({ transform: 'scale(1.6,1.6)', offset: 0.5 }),
                style({ transform: 'scale(1,1)', offset: 1.0 }),
            ]))
        )
    ]),
    cheerPoints: trigger('cheerPoints', [
        transition('false => true', rubberBand)
    ]),
    faceLabel: trigger('faceLabel', [       
        transition('populated => empty', zoomOutUp )
    ]) 
}

 // state('empty', style({ visibility: 'hidden' })),
        // state('populated', style({ visibility: 'visible' })),
        // transition('* => populated',
        //     animate('300ms', keyframes([
        //         style({ opacity: 0, transform: 'translate3d(-3000px, 0, 0)', offset: 0}),
        //         style({ opacity: 1, transform: 'translate3d(25px, 0, 0)', offset: 0.6}),
        //         style({ transform: 'translate3d(-10px, 0, 0)', offset: 0.75}),
        //         style({ transform: 'translate3d(5px, 0, 0)', offset: 0.9}),
        //         style({ transform: 'translate3d(0, 0, 0)', offset: 1}),
        //     ]))
        // ),