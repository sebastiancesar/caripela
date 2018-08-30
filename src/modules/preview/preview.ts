import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'camera-preview',
    templateUrl: 'preview.html'
})
export class CameraPreview implements AfterViewInit {
    
    @Input() videoSource: any;
    @ViewChild('webcamholder') 
    private webcamholder: ElementRef;

    loadSource () {        
        this.webcamholder.nativeElement.srcObject = this.videoSource;
    }

    ngAfterViewInit(): void {
        this.loadSource();
    }
}


