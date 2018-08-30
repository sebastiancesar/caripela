import { Injectable } from "@angular/core";

const IMG_WIDTH = 224;
const IMG_HEIGHT = 224;

@Injectable()
export class CaptureBrowserService {
    
    private webcamElement: HTMLVideoElement;
    private canvas: HTMLCanvasElement;

    constructor() {
      this.webcamElement = <HTMLVideoElement>(document.createElement('video'));
      this.canvas = document.createElement('canvas');
      this.canvas.width = IMG_WIDTH;
      this.canvas.height = IMG_HEIGHT;
    }
  
    getWebcamElement() {
      return this.webcamElement;
    }

    capture() {
      let context = this.canvas.getContext('2d');
      context.drawImage(this.webcamElement, 0, 0, IMG_WIDTH, IMG_HEIGHT);
      let imageData = this.canvas.toDataURL('image/jpeg', 8.5);
      imageData = imageData.replace(/^data:image\/(png|jpeg);base64,/, '');
      return imageData
    }
  
    /**
     * Adjusts the video size so we can make a centered square crop without
     * including whitespace.
     * @param {number} width The real width of the video element.
     * @param {number} height The real height of the video element.
     */
    adjustVideoSize(width, height) {
      const aspectRatio = width / height;
      if (width >= height) {
        this.webcamElement.width = aspectRatio * this.webcamElement.height;
      } else if (width < height) {
        this.webcamElement.height = this.webcamElement.width / aspectRatio;
      }
    }
  
    getVideoSrc () {
        return this.webcamElement.srcObject;
    }
    
    setup() {
      const videoConstrains =  { width: 224, height: 224 };      
      return new Promise((resolve, reject) => {
        let mediaDevices = navigator.mediaDevices;            
        if (mediaDevices.getUserMedia) {
          mediaDevices.getUserMedia({video: videoConstrains, audio: false})
            .then( stream => {
              this.webcamElement.addEventListener('loadeddata', async () => {
                this.adjustVideoSize(
                    this.webcamElement.videoWidth,
                    this.webcamElement.videoHeight);
                resolve(stream);
              }, false);
              this.webcamElement.srcObject = stream;
            })
            .catch(error => {
              console.error('captureBrowser fail promise error', error);
              reject();
            });
        } else {
          reject();
        }
      });
    }
  }
  