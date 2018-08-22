'use strict';
class gd_Point{
    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

}

class gd_Signature{
    constructor(container){
        this.container = container;
        this.memberSetup();
        
    }

    memberSetup(){
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

        this.mousedown_function = this.mousedown_function.bind(this);
        this.mousemove_function = this.mousemove_function.bind(this);
        this.mouseup_function = this.mouseup_function.bind(this);
        this.mouseleave_function = this.mouseleave_function.bind(this);
        
        $(this.canvas).mousedown(this.mousedown_function);
        $(this.canvas).mousemove(this.mousemove_function);
        $(this.canvas).mouseup(this.mouseup_function);
        $(this.canvas).mouseleave(this.mouseleave_function);

        this.setDrawStyle();
        this.context.fillStyle = "#FFFFFF";
        this.clear();
    }
    
    setCanvasDimension(){
        this.canvasWidth = $(this.container).width();
        this.canvasHeight = $(this.container).height();
        $(this.canvas).attr({
            "width": this.canvasWidth,
            "height": this.canvasHeight,
        });
        this.canvasOffset = $(this.canvas).offset();
    }

    clear(){
        this.context.fillRect(0,0, this.canvasWidth, this.canvasHeight);
    }

    mousedown_function(event){
        console.log("DOWN");
        this.mousedown = true;
        this.currentPos.x = event.pageX - this.canvasOffset.left;
        this.currentPos.y = event.pageY - this.canvasOffset.top;
    }
    
    mousemove_function(event){
        console.log("MOVE");
        if(this.mousedown == true){
            console.log("MOVE T");
            this.previousPos.x = this.currentPos.x;
            this.previousPos.y = this.currentPos.y;

            this.currentPos.x = event.pageX - this.canvasOffset.left;
            this.currentPos.y = event.pageY - this.canvasOffset.top;

            this.draw();
            console.log("x: " + this.currentPos.x + "    y: " + this.currentPos.y);
        }
    }

    mouseup_function(){
        this.mousedown = false;
        console.log("UP");
    }

    mouseleave_function(){
        console.log("LEAVE");
        this.mousedown = false;
    }

    draw(){
        this.context.beginPath();
        this.context.moveTo(this.previousPos.x, this.previousPos.y);
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        this.context.stroke();
    }
    setDrawStyle(){

        this.context.lineCap = "round";
        this.context.lineJoin = "round";
        this.context.lineWidth = "2px";
    }
}