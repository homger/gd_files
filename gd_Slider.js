'use strict';

let script1 = document.createElement("script");
script1.src = "chainedList.js";
//script1.async = "false";
//document.head.insertBefore(script1, document.head.childNodes[0]);

class gd_Slider{
    constructor(htmlContainer){

        this.containersSetup(htmlContainer);
        this.slideList = new gd_AutoArray();
        this.autoSlideChangeDirection = "nextSlide";
        
    }
    containersSetup(htmlContainer){
        this.htmlContainer = htmlContainer;
        this.container = document.createElement("div");
        this.subContainer = document.createElement("div");
        this.container.appendChild(this.subContainer);
        this.htmlContainer.appendChild(this.container);
        this.containersStyleSetup();
    }
    containersStyleSetup(){
        this.container.style.position = "relative";
        this.container.style.width = "100%";
        this.container.style.height = "100%";
        this.container.style.overflow = "hidden";
        this.container.style.backgroundColor = "#000";
        
        
        this.subContainer.style.width = "100%";
        this.subContainer.style.height = "80%";
        this.subContainer.style.position = "absolute";
        this.subContainer.style.top = "10%";
        this.subContainer.style.overflow = "hidden";
        //this.subContainer.style.display = "flex";
        this.subContainer.style.alignItems = "center";
        //this.subContainer.style.flexWrap = "nowrap";
    }
    addSlide(slide){
        if(slide instanceof HTMLElement){

            this.slideStyleSetup(slide);
            this.slideList.add(slide);

            if(this.slideList.itemCount == 1){
                this.subContainer.appendChild(slide);
                
            }
        }
        else{
            console.log("NOT AN HTMLElement");
        }
    }
    slideStyleSetup(slide){
        slide.style.display = "table";
        slide.style.maxWidth = "100%";
        slide.style.maxHeight = "100%";
        slide.style.position = "relative";
        slide.style.margin = "auto";
        slide.style.flexShrink = "0";
        slide.style.transitionProperty = "left, rigth";

    }
    nextSlide(){
        this.slideList.toNext();
        this.subContainer.replaceChild(this.slideList.current, this.slideList.previous);
    }
    previousSlide(){
        this.slideList.toPrevious();
        this.subContainer.replaceChild(this.slideList.current, this.slideList.next);
    }
    slidePositionRegulate(slide){
        if(slide === this.slideList.current){
            slide.style.left = "0";
        }
        else if(slide === this.slideList.next){
            slide.style.left = "100%";
        }
        else if(slide === this.slideList.previous){
            slide.style.left = "-100%";
        }
    }
    setSlideTimer( time ){
        /*this.nextSlide = this.nextSlide.bind(this);
        this.timerInterval = setInterval(this.nextSlide, time*1000);*/
        this.autoChangeDelay = time * 1000;
        this.autoSlideChange();
    }
    set slideTimer(time){
        this.setSlideTimer(time);
    }
    autoSlideChange(){
        this[this.autoSlideChangeDirection]();
        this.timeOut = setTimeout(this.autoSlideChange.bind(this), this.autoChangeDelay);
    }
    setSlideDirection(direction){
        autoSlideChangeDirection = direction;
    }
}
/*
document.onreadystatechange = function(){
    if(document.readyState === "interactive"){
        //document.head.insertBefore(script1, document.head.childNodes[0]);
        test = new Slider();
        print();





    }
}*/