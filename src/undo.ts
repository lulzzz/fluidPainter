/// <reference path="paintCanvas.ts" />

// this class is designed to act like a queue / stack but without the creation and deletion of objects. 
// this is because i want to generate a set amount of buffers at the beginning and keep reususing them.
// this will only work nicely on object arrays due to javascript passing anything that isnt and object by value not reference.
class Undo {
    
    private storageArray : Object[] = [];
    private index : number = 0;
    private undoHead : number = 0;
    private redoHead : number = 0;

    private undoEnabled : boolean = false;
    private redoEnabled : boolean = false;

    constructor(data : Object[]) {
        this.storageArray = data;

        // we all ways leave a spot for the current image so we can redo back to normal.
        this.undoHead = data.length - 2;
        if(this.undoHead < 0) {
            throw new Error("Data array too small!");
        }
    };

    public reset() : void {
        this.index = 0;
        this.redoHead = 0;
        this.undoEnabled = false;
        this.redoEnabled = false;
    }

    public getDataArray() : Object[] {
        return this.storageArray;
    }

    public getIndex() : number {
        return this.index;
    }

    public MaxUndoAmount() : number {
        return this.undoHead + 1;
    }

    // this can be used for finding out if we're on our first undo or not.
    public isRedoEnabled() : boolean {
        return this.redoEnabled;
    }

    // we store our snapshot of the current item here.
    public getCurrentItemToStore() : any {

        if(this.index < this.undoHead) {
            this.redoHead = this.index;
            return this.storageArray[this.index];
        }
        
        this.redoHead = this.storageArray.length - 1;
        return this.storageArray[this.redoHead];
    };

    // returns item that can be overwritten
    public getItemToStoreTo() : any {
        // unod can now happen because we have values to revert to
        this.undoEnabled = true;
        // we can't redo because because we havnt undone anything.
        // we also reset the redoHead to force the user to the current item if they wanna use redo.
        this.redoEnabled = false;
        this.redoHead = 0;

        if (this.index <= this.undoHead) {
            let item = this.storageArray[this.index];
            this.index++;
            return item;
        }
        
        this.index = this.undoHead+1;
        return this.doShift();
    };

    private doShift() : any {
        // perform a shift on all the items
        let tmp = this.deepCopy(this.storageArray[0]);

        for(let i = 0; i < this.undoHead; i++) {
            this.storageArray[i] = this.deepCopy(this.storageArray[i+1]);
        };

        this.storageArray[this.undoHead] = tmp;
        return tmp;
    };

    // returns undo item
    public undo() : any {
        if(this.undoEnabled === false) return null;
        // we have undone so we can redo now.
        this.redoEnabled = true;
        
        this.index--;
        if(this.index < 0) {
            this.index = 0;
        };

        return this.storageArray[this.index];
    };

    // returns redo item;
    public redo() : any {
        if(this.redoEnabled === false || this.redoHead === 0) return null;

        this.index++;
        if(this.index > this.redoHead) {
            this.index = this.redoHead;
        };

        return this.storageArray[this.index];
    };

    // handy helper function to deep copy and object.
    private deepCopy(obj : Object) : Object {
        return JSON.parse(JSON.stringify(obj));
    };
}