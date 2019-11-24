import io from 'socket.io-client';

export interface ImgProcessorClient { 
  init: Function,
  emit: Function,
  on: Function,
  removeListener: Function
}

export class ImgProcessorWsClient implements ImgProcessorClient {

  roomId: string;
  ws: any;

  constructor(imgProcessorEndpoint: string) {
    this.roomId = 'clientRoom';
    this.ws = io.connect(imgProcessorEndpoint);
  }

  init() {
    this.ws.on('connect', () => {
      console.log('connected');
      this.ws.emit('response_connect', {
        msg: 'si, connected'
      });
    });

    this.ws.on('joined_room', (data) => {
      console.log('joined room ', data);
    });

    this.ws.emit('create', {
      roomId: this.roomId
    });

    this.ws.on('sample_added', () => {
      console.log('sample added');
    });

    return this;
  }

  emit(eventName: string, data?:any ) {
    if (data) {
      this.ws.emit(eventName, data);
    } else {
      this.ws.emit(eventName);
    }
  }

  on(eventName: string, cb: Function) {
    this.ws.on(eventName, cb);
  }

  removeListener(eventName: string, cb: Function) {
    this.ws.removeListener(eventName, cb);
  }
}
