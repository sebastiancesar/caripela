import io from 'socket.io-client';

export class RecoWsClient {

    roomId: string;
    ws: any;
    
    constructor () {
        this.roomId = 'clientRoom';
        this.ws = io.connect('https://192.168.0.155:5000');
    }

    init () {
        this.ws.on('connect', () => {
            console.log('connected');
            this.ws.emit('response_connect', { msg: 'si, connected' });
        });
        
        this.ws.on('joined_room', (data) => {
            console.log('joined room ', data);
        });
        
        this.ws.emit('create', { roomId: this.roomId });
        
        this.ws.on('sample_added', () => {
            console.log('sample added');
        });
        
        return this;    
    }

    emit (eventName, data?) {
        if (data) {
            this.ws.emit(eventName, data);
        } else {
            this.ws.emit(eventName);
        }
    }

    on (eventName, cb) {
        this.ws.on(eventName, cb);
    }

    removeListener (eventName, cb) {
        this.ws.removeListener(eventName, cb);
    }
}