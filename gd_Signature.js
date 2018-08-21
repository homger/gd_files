
class gd_Signature{
    constructor(container, width = "300px", heigth = "200px"){
        this.signatureCanvas = document.createElement("canvas");
        this.width = width;
        this.heigth = heigth;
        this.container = container;
        this.container.appendChild(this.signatureCanvas);
    }

    draw(){
        this.context.moveTo(this.from.x, this.from.y);
        this.context.lineTo(this.to.x, this.to.y);
        this.context.stroke();
        console.log("draw: x: " + this.to.x + "  y: "+ this.to.y);
    }

    signatureCanvasSetUp(){
    
        this.signatureCanvas.style.width = this.width;
        this.signatureCanvas.style.heigth = this.heigth;
        this.context = this.signatureCanvas.getContext("2d");
    
        this.context.strokeStyle = "black";
        this.context.lineWidth = "5px";
        this.context.lineJoin = "round";
        this.context.lineCap = "round";
    
        this.canvasOffset.left = $(signatureCanvas).offset().left;
        this.canvasOffset.top = $(signatureCanvas).offset().top;
        
        $(signatureCanvas).mousedown(function(event){
            mousedown = true;
            mouseCurrentPosition.x = event.pageX - canvasOffset.left;
            mouseCurrentPosition.y = event.pageY - canvasOffset.top;
    
        });
        $(signatureCanvas).mouseup(function(){
            mousedown = false;
        });
        $(signatureCanvas).mouseleave(function(){
            mousedown = false;
        });
        $(signatureCanvas).mousemove(function(event){
            if(mousedown){
                mousePreviousPosition.x = mouseCurrentPosition.x;
                mousePreviousPosition.y = mouseCurrentPosition.y;
                mouseCurrentPosition.x = event.pageX - canvasOffset.left;
                mouseCurrentPosition.y = event.pageY - canvasOffset.top;
                draw(context, mousePreviousPosition, mouseCurrentPosition);
            }
        });
    }


}


signatureCanvasSetUp() {
    
    $(signatureCanvas).attr("width", $(signatureCanvas).parent().attr("width") + "px");
    $(signatureCanvas).attr("height", $(signatureCanvas).parent().attr("height") + "px");
    let context = signatureCanvas.getContext("2d");

    context.strokeStyle = "black";
    context.lineWidth = "5px";
    context.lineJoin = "round";
    context.lineCap = "round";

    canvasOffset.left = $(signatureCanvas).offset().left;
    canvasOffset.top = $(signatureCanvas).offset().top;
    
    $(signatureCanvas).mousedown(function(event){
        mousedown = true;
        mouseCurrentPosition.x = event.pageX - canvasOffset.left;
        mouseCurrentPosition.y = event.pageY - canvasOffset.top;

    });
    $(signatureCanvas).mouseup(function(){
        mousedown = false;
    });
    $(signatureCanvas).mouseleave(function(){
        mousedown = false;
    });
    $(signatureCanvas).mousemove(function(event){
        if(mousedown){
            mousePreviousPosition.x = mouseCurrentPosition.x;
            mousePreviousPosition.y = mouseCurrentPosition.y;
            mouseCurrentPosition.x = event.pageX - canvasOffset.left;
            mouseCurrentPosition.y = event.pageY - canvasOffset.top;
            draw(context, mousePreviousPosition, mouseCurrentPosition);
        }
    });
}

draw(context, from, to){
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    console.log("draw: x: " + to.x + "  y: "+ to.y);
}