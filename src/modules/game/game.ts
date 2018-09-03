export class Game {

    faceLabels: Array<string>;    
    currentFace = 0;
    private numClasses: number = 0;
    private samples = [];
    private lastFace: any = { label: '', class_id: -1 };

    constructor (faces) {        
        this.faceLabels = faces;     
        this.numClasses = this.faceLabels.length;
    }
    
    isLastFace () : boolean {
        return this.currentFace === this.faceLabels.length;
    }
    
    getSamples () {
        return this.samples;
    }

    samplesAdded (samplesHolder) : void {
        samplesHolder.label = this.faceLabels[samplesHolder.classId];
        this.samples.push(samplesHolder);
    }

    getNextFaceLabel () : string {
        const face = this.faceLabels[this.currentFace];
        this.currentFace += 1;
        return face;
    }

    getRandomFace () {
        let index = this.getRandom(0, this.numClasses);
        let newFace = { label: this.faceLabels[index], class_id: index };
        while (newFace.class_id === this.lastFace.class_id) {
            index = this.getRandom(0, this.numClasses);
            newFace = { label: this.faceLabels[index], class_id: index };            
        }
        this.lastFace = newFace;
        return newFace;
    }

    getRandom (min, max) {
        return Math.floor((Math.random() * (max - min) + min));
    }

}