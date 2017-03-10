
class vec2 {

    public x : number;
    public y : number;

    constructor( _x : number, _y : number) {
        this.x = _x;
        this.y = _y;
    }

    public distance( pos : vec2) : any {
        return new vec2(this.x - pos.x, this.y - pos.y);
    }
}

class InputController {

    private forceApplied : boolean = false;
    private bMouseDown : boolean = false;

    private lastPos : vec2 = new vec2(0,0);
    private currentPos : vec2 = new vec2(0,0);

    private debugDrawState : string = "visualise";

    constructor(private canvas: HTMLCanvasElement, private forceHandler : any) {

        canvas.onmousedown = this.mouseDown.bind(this);
        canvas.onmouseup = this.mouseUp.bind(this);
        canvas.onmousemove = this.mouseMove.bind(this);
        canvas.onmouseleave = this.mouseUp.bind(this);

        // using listeners because the other way didnt work for touch
        canvas.addEventListener("touchstart", this.touchDown.bind(this), false);
        canvas.addEventListener("touchend", this.mouseUp.bind(this), false);
        canvas.addEventListener("touchmove", this.touchMove.bind(this), false);

        // for debugging
        window.onkeyup = this.debugDrawing.bind(this);
    }

    private mouseUp(e : Event) {
        this.bMouseDown = false;
    }

    private mouseDown(e : Event) {
        this.currentPos = this.getCursorPosition(this.canvas, e);
        this.bMouseDown = true;
    }

    private touchDown(e: Event) {
        this.currentPos = this.getTouchPosition(this.canvas, e);
        this.bMouseDown = true;
    }

    private touchMove(e : Event) {
        if(!this.bMouseDown) return;
        
        this.lastPos = this.currentPos;
        this.currentPos = this.getTouchPosition(this.canvas, e);
        
        this.addForce();
    }

    private mouseMove(e : Event) {
        if(!this.bMouseDown) return;
        
        this.lastPos = this.currentPos;
        this.currentPos = this.getCursorPosition(this.canvas, e);
        
        this.addForce();
    }

    private addForce() {
        // calc the distance
        var dist : vec2 = this.currentPos.distance(this.lastPos);

        // normalize
        let xforce : number = dist.x;// / this.canvas.width;
        let yforce : number = dist.y;// / this.canvas.height;

        // hardcode size for now
        this.forceHandler.addForce(this.currentPos.x, this.currentPos.y, xforce, yforce, 10);
    }

    private getCursorPosition(canvas, event) : any {
        var rect = canvas.getBoundingClientRect();
        return new vec2(event.clientX - rect.left, event.clientY - rect.top);
    }

    private getTouchPosition(canvas, event) : any {
        var rect = canvas.getBoundingClientRect();
        return new vec2(event.touches[0].clientX - rect.left, event.touches[0].clientY - rect.top);
    }

    // for testing debugDrawing

    public getDebugDrawState() : string {
        return this.debugDrawState;
    }

    private debugDrawing(e : KeyboardEvent) {
        let code = e.keyCode;

        switch(code) {
            case 49: {
                // key 1
                this.debugDrawState = "visualise";
                break;
            }
            case 50: {
                // key 1
                this.debugDrawState = "velocity";
                break;
            }
            case 51: {
                // key 2
                this.debugDrawState = "divergence";
                break;
            }
            case 52: {
                // key 3
                this.debugDrawState = "pressure";
                break;
            }
        }
    }
}