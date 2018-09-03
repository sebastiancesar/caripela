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

// Doesn't work, scale(0.1) rotate(30deg) , too much information.
const jackInTheBox = animate('1000ms ease-in', keyframes([
    style({ visibility: 'visible', opacity: 0, 
            transform: 'scale(0.1) rotate(30deg)',
            transformOrigin: 'center bottom', offset: 0}),
    style({ transform: 'rotate(-10deg)', offset: 0.5 }),            
    style({ transform: 'rotate(3deg)', offset: 0.7 }),
    style({ opacity: 1, transform: 'scale(1)', offset: 1 })                        
]));

const cool = animate('500ms ease-in', keyframes([
    style({ opacity: 1, transform: 'scale(1,1)', offset: 0 }),
    style({ transform: 'scale(1.6,1.6)', offset: 0.5 }),
    style({ opacity: 1, transform: 'scale(1,1)', offset: 1.0 }),
]));

export const Animations = {    
    showPoint: [    
        trigger('showPoint', [
            state('hiddenPoint', style({ opacity: 0.1 })),
            state('visiblePoint', style({ opacity: 1 })),
            transition('hiddenPoint => visiblePoint', cool),        
    ])],
    cheerPoints: [        
        trigger('cheerPoints', [
            transition('notCheering => cheering', rubberBand)
    ])],
    faceLabel: trigger('faceLabel', [
        transition('populated => empty', zoomOutUp )
    ]),
    start: trigger('start', [
        state('hiddenStart', style({visibility: 'hidden'})),
        state('visibleStart', style({visibility: 'visible'})),
        transition('hiddenStart => visibleStart', cool),
        // transition('visibleStart => hiddenStart', animate('200ms ease-in'))
    ])
}