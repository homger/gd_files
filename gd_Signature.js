'use strict';
class gd_Point{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }
}

class gd_stroke{
    constructor(point){
        this.stroke = [];
        if(point){
            this.addPoint(point);
        }
    }
    addPoint(point){
        this.stroke.push(point);
        console.log("POINT ADDED");
    }
}

class gd_strokeArray{
    constructor(){
        this.strokeArray = [];
        this.currentStrokeIndex = -1;
        
    }
    startStroke(point){
        this.strokeArray.push( new gd_stroke(point) );
        ++this.currentStrokeIndex;
        console.log("STROKE STARTED");
    }
    addPoint(point){
        this.strokeArray[this.currentStrokeIndex].addPoint(point);
    }
    getStroke(n){
        return this.strokeArray[n];
    }
    dumpData(){
        this.strokeArray = [];
        this.currentStrokeIndex = -1;
    }
}

class gd_Signature{
    constructor(container){
        this.container = container;
        this.memberSetup();
        
        window.addEventListener("resize", this.wondowChangeEvent.bind(this));
        window.addEventListener("scroll", this.wondowChangeEvent.bind(this));
    }

    memberSetup(){
        this.strokeArray = new gd_strokeArray();
        this.strokeColor = "#000000";

        let cach = ["relative", "absolute", "fixed"];
        let set = true;
        for(let i in cach){
            if($(this.container).css("position") == cach[i] ){
                set =false;
                break;
            }
        }
        if(set){
            $(this.container).css("position","relative");
        }


        this.mousedown = false;
        this.previousPos = new gd_Point(0,0);
        this.currentPos = new gd_Point(0,0);


        this.canvas = document.createElement("canvas");
        $(this.container).append(this.canvas);
        this.context = this.canvas.getContext("2d");

        this.setCanvasDimension();


                
        $(this.canvas).mousedown(this.mousedown_function.bind(this));
        $(this.canvas).mousemove(this.mousemove_function.bind(this));
        $(this.canvas).mouseup(this.mouseup_function.bind(this));
        $(this.canvas).mouseleave(this.mouseleave_function.bind(this));


        this.canvas.addEventListener("touchstart", this.touchstart_function.bind(this));
        
        this.canvas.addEventListener("touchmove", function(e){
            e.preventDefault();
            this.touchmove_function(e);
        }.bind(this) );

        this.canvas.addEventListener("touchcancel", this.mouseup_function);
        this.canvas.addEventListener("touchend", this.mouseup_function);
        

        this.setDrawStyle();
        
        this.clear();
    }
    
    wondowChangeEvent(){
        this.setCanvasDimension();
        this.reDraw();
    }

    setCanvasDimension(){
        this.canvasWidth = $(this.container).width();
        this.canvasHeight = $(this.container).height();
        $(this.canvas).attr({
            "width": this.canvasWidth,
            "height": this.canvasHeight,
        });
        this.canvasOffset =    this.canvas.getBoundingClientRect();    //$(this.canvas).offset();
    }

    clear(){
        this.context.fillStyle = "#FFFFFF";
        this.context.fillRect(0,0, this.canvasWidth, this.canvasHeight);
        this.context.fillStyle = this.strokeColor;

    }
    clearStrokeData(){
        this.strokeArray.dumpData();
    }

    touchstart_function(event){
        console.log("DOWN");
        this.mousedown = true;
        this.currentPos.x = event.touches[0].clientX - this.canvasOffset.left;
        this.currentPos.y = event.touches[0].clientY - this.canvasOffset.top;
        this.strokeArray.startStroke( new gd_Point(this.currentPos.x, this.currentPos.y) );
    }
    
    touchmove_function(event){
        //console.log("MOVE");
        if(this.mousedown == true){
            //console.log("MOVE T");
            this.previousPos.x = this.currentPos.x;
            this.previousPos.y = this.currentPos.y;

            this.currentPos.x = event.touches[0].clientX  - this.canvasOffset.left;
            this.currentPos.y = event.touches[0].clientY - this.canvasOffset.top;

            this.draw();
            this.strokeArray.addPoint(new gd_Point(this.currentPos.x, this.currentPos.y) );
            console.log("x: " + this.currentPos.x + "    y: " + this.currentPos.y);
        }
    }

    mousedown_function(event){
        console.log("DOWN");
        this.mousedown = true;
        this.currentPos.x = event.clientX - this.canvasOffset.left;
        this.currentPos.y = event.clientY - this.canvasOffset.top;
        this.strokeArray.startStroke( new gd_Point(this.currentPos.x, this.currentPos.y) );
    }
    
    mousemove_function(event){
        //console.log("MOVE");
        if(this.mousedown == true){
            //console.log("MOVE T");
            this.previousPos.x = this.currentPos.x;
            this.previousPos.y = this.currentPos.y;

            this.currentPos.x = event.clientX - this.canvasOffset.left;
            this.currentPos.y = event.clientY - this.canvasOffset.top;

            this.draw();
            this.strokeArray.addPoint(new gd_Point(this.currentPos.x, this.currentPos.y) );
            //console.log("x: " + this.currentPos.x + "    y: " + this.currentPos.y);
            //console.log("left: " + this.canvasOffset.left + "    top: " + this.canvasOffset.top);
        }
    }



    mouseup_function(){
        this.mousedown = false;
        //console.log("UP");
    }

    mouseleave_function(){
        //console.log("LEAVE");
        this.mousedown = false;
    }

    reDraw(){
        this.clear();
        let strokeArrayLength = this.strokeArray.strokeArray.length;
        let strokeLength;
        let stroke;
        
        this.context.beginPath();
        for(let i = 0; i < strokeArrayLength; ++i) {
            stroke = this.strokeArray.getStroke(i);
            strokeLength = stroke.stroke.length;
            

            this.currentPos = stroke.stroke[0];
            this.context.moveTo(this.currentPos.x, this.currentPos.y);

            for(let j = 1; j < strokeLength; ++j){
                //this.previousPos = this.currentPos;
                this.currentPos = stroke.stroke[j];

                this.context.lineTo(this.currentPos.x, this.currentPos.y);

                //this.draw();
            }
            
        }
        this.context.stroke();
        
    }
    draw(){
        this.context.beginPath();
        this.context.moveTo(this.previousPos.x, this.previousPos.y);
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        this.context.stroke();
        
        console.log("draw");
        console.log("x: " + this.currentPos.x + "    y: " + this.currentPos.y);
    }
    setDrawStyle(){

        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = "2px";
    }
}