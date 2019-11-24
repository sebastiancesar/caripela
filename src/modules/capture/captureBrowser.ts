import { Injectable } from "@angular/core";

const IMG_WIDTH = 224;
const IMG_HEIGHT = 224;
const VIDEO_CONSTRAINS = {
  width: IMG_WIDTH,
  height: IMG_HEIGHT
};

/**
 * CaptureBrowserService provides the interface for interacting with the webcam.
 * It responsible for configuring the access to the device, configuring it and provide
 * a way to take captures in form of binary images. 
 */

@Injectable()
export class CaptureBrowserService {

  private videoElement: HTMLVideoElement;
  private canvas: HTMLCanvasElement;

  constructor() {
    this.videoElement = < HTMLVideoElement > (document.createElement('video'));
    this.canvas = document.createElement('canvas');
    this.canvas.width = IMG_WIDTH;
    this.canvas.height = IMG_HEIGHT;
  }

  capture() {
    let context = this.canvas.getContext('2d');
    context.drawImage(this.videoElement, 0, 0, IMG_WIDTH, IMG_HEIGHT);
    let imageData = this.canvas.toDataURL('image/jpeg', 8.5);
    imageData = imageData.replace(/^data:image\/(png|jpeg);base64,/, '');
    return imageData
  }

  getWebcamStream(): MediaStream {
    return this.videoElement.srcObject as MediaStream;
  }

  /**
   * Through getUserMedia API, you can access the computer’s web camera through web browsers.
   * Once you got the access to the webcam, you get a Stream, that stream is streamed into
   * a <video> element but is not attached to the DOM. The <video> is playing what cames from the webcam.
   * For getting access to the webcam through the MediaDevices presents in the browser, this
   * getUserMedia prompts the user for permission.
   * The stream and the <video> element are properties of this Service. 
   * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
   * 
   * @returns Promise<void> - The promise is resolved when the service is fully configured. 
   */
  setup() {
    return new Promise((resolve, reject) => {
      const mediaDevices: MediaDevices = navigator.mediaDevices;
      if (mediaDevices.getUserMedia) {
        this.requestForWebCamStream(mediaDevices)
          .then((stream: MediaStream) => {
            return this.configureVideoForStream(stream);
          })
          .then( () => { resolve(); })
          .catch(error => {
            console.error('captureBrowser fail promise error', error);
            reject();
          });
      } else {
        reject();
      }
    });
  }

  /** Config the source for <video> element and adjust the size of it based on the given
   * stream
   * 
   * @param stream - A valid stream 
   * @returns {Promise <void> } - Resolved when the <video> is finally configured.
  */
  configureVideoForStream(stream: MediaStream): Promise<void> {
    this.videoElement.srcObject = stream;
    return new Promise((resolve) => {
      this.videoElement.addEventListener('loadeddata', () => {
        this.adjustVideoSize();
        resolve();
      }, false);
    });
  }

  /**
   * Adjusts the video size so we can make a centered square crop without
   * including whitespace.
   */
  adjustVideoSize() {
    // The real width/height of the video tag element.
    const {videoHeight, videoWidth } = this.videoElement;
    const aspectRatio = videoWidth / videoHeight;
    if (videoWidth >= videoHeight) {
      this.videoElement.width = aspectRatio * this.videoElement.height;
    } else if (videoWidth < videoHeight) {
      this.videoElement.height = this.videoElement.width / aspectRatio;
    }
  }

  requestForWebCamStream(mediaDevices: MediaDevices): Promise<MediaStream> {
    return mediaDevices.getUserMedia({
      video: VIDEO_CONSTRAINS,
      audio: false
    });
  }
}
