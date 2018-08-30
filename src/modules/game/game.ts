export class Game {

    faceLabels: Array<string>;    
    currentFace = 0;
    private samplesAdded = {};        
    private lastFace: any = { label: '', class_id: -1 };

    constructor (faces) {        
        this.faceLabels = faces;
        this.faceLabels.forEach((label, index) => {
            this.samplesAdded[index] = 0;
        });
    }
    
    getSamplesAdded () {
        return this.samplesAdded;
    }

    getNextFaceLabel () : string {
        const face = this.faceLabels[this.currentFace];
        this.currentFace += 1;
        return face;
    }

    getRandomFace () {
        let index = this.getRandom(0, 3);
        let newFace = { label: this.faceLabels[index], class_id: index };
        while (newFace.class_id === this.lastFace.class_id) {
            index = this.getRandom(0, 3);
            newFace = { label: this.faceLabels[index], class_id: index };            
        }
        this.lastFace = newFace;
        return newFace;
    }

    getRandom (min, max) {
        return Math.floor((Math.random() * (max - min) + min));
    }

}