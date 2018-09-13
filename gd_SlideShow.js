'use strict';



class gd_SlideShow {
    constructor(globalContainer) {
        this.globalContainer = globalContainer;
        this.container;

        this.activeNext = false;
        this.activePrevious = false;
        this.activeNextValue;
        this.activePreviousValue;

        this.currentIndex = 0;
        this.nextIndex;
        this.previousIndex;

        this.lastItem = true;

        this.slideArray = [];
        this.slideCount = 0;

        this.outSlideIndex;
        this.inSlideIndex;

        //AUTO
        this.autoSlideDirection = "next";
        this.autoSlideTime = 5000;
        this.autoSlideActive = false;
        this.autoSlideTimeOut;
        this.autoSlide = this.autoSlide.bind(this);

        this.transitionDone = this.transitionDone.bind(this);
        //style
        this.transitionDuration = 0.5;

        this.containerSetUp();

        
        document.addEventListener('keydown', this.keyEvent.bind(this));
    }
    keyEvent(event){
        
        if(event.key == "ArrowRight"){
            this.next();
        }
        else if(event.key == "ArrowLeft"){
            this.previous();
        }
    }

addSlide(slide) {
    // THE SLDIE GOES IN A DIV
    if(slide instanceof HTMLElement) {
        this.slideArray.push( document.createElement("div") );
        this.slideArray[this.slideCount].appendChild(slide);
        this.slideCount++;

        this.slideStyleSetup( this.slideArray[this.slideCount - 1] );

        this.slideArray[this.slideCount - 1].addEventListener("transitionend", this.transitionDone);

        if(this.lastItem){
            this.addRegulate();
            console.log("REGULATED");
        }
    }
    else {
        throw new Error("Argument is not: instanceof HTMLElement");
    }
}

add(slideArray) {

    this.lastItem = false;
    let length = slideArray.length;

    if(length > 0 ) {
        for(let i = 0; i < length; ++i) {
            if( i == length - 1){
                this.lastItem = true;
                console.log("LAST ITEM: " + i);
            }
            this.addSlide(slideArray[i]);
        }
    }

}

addRegulate() {
    if(this.slideCount >= 3) {
        this.activeNext = true;
        this.activePrevious = true;
    }
    else if(this.slideCount == 2) {
        if(this.currentIndex == 0) {
            this.activeNext = true;
        }
        else {
            this.activePrevious = true;
        }
    }
    else {
        this.activeNext = false;
        this.activePrevious = false;
    }
    this.calculateIndexs(0);
    this.setPositionLeft();
    this.containerChildRegulate(true);
}



calculateIndexs(shift) {

    this.currentIndex += shift;
    this.currentIndex < 0 ? this.currentIndex = this.slideCount - 1 : this.currentIndex %= this.slideCount;

    this.nextIndex = (this.currentIndex + 1) % this.slideCount;

    this.previousIndex = this.currentIndex - 1;
    if(this.previousIndex < 0) {
        this.previousIndex = this.slideCount - 1;
    }
}

setPositionLeft() {
    if(this.slideCount >= 3) {
        this.slideArray[this.previousIndex].style.left = "-100%";
        this.slideArray[this.currentIndex].style.left = "0%";
        this.slideArray[this.nextIndex].style.left = "100%";
    }
    else if(this.slideCount == 2) {
        if(this.activePrevious) {
            this.slideArray[this.currentIndex].style.left = "0%";
            this.slideArray[this.nextIndex].style.left = "100%";
            console.log("NEXT ACT");
        }
        else {
            this.slideArray[this.previousIndex].style.left = "-100%";
            this.slideArray[this.currentIndex].style.left = "0%";
        }
    }
    else if(this.slideCount == 1){
        this.slideArray[this.currentIndex].style.left = "0%";
    }
}

containerChildRegulate(callFromeAddFunction = false) {

    if( !callFromeAddFunction) {
        
        if(this.slideCount >= 3) {

            this.container.removeChild(this.slideArray[this.outSlideIndex]);
            this.container.appendChild(this.slideArray[this.inSlideIndex]);
        }
        else if(this.slideCount == 2){

            this.activeNext = this.activePrevious;
            this.activePrevious = !this.activePrevious;
        }


    }
    else {


        if(this.slideCount >= 3) {
            
            for(let i = this.container.childNodes.length; i > 0; --i) {

                this.container.removeChild(this.container.childNodes[i - 1] );
            }
            
            this.container.appendChild(this.slideArray[this.previousIndex]);
            this.container.appendChild(this.slideArray[this.currentIndex]);
            this.container.appendChild(this.slideArray[this.nextIndex]);
            
        }

        else if(this.slideCount == 2) {
            
            for(let i = this.container.childNodes.length; i > 0; --i) {

                this.container.removeChild(this.container.childNodes[i - 1] );
            }

            this.container.appendChild(this.slideArray[this.currentIndex]);
            if( this.activeNext) {
                this.container.appendChild(this.slideArray[this.nextIndex]);
            }
            else {
                this.container.appendChild(this.slideArray[this.previousIndex]);
            }

        }
        else if(this.slideCount == 1) {
            for(let i = this.container.childNodes.length; i > 0; --i) {

                this.container.removeChild(this.container.childNodes[i - 1] );
            }

            this.container.appendChild(this.slideArray[this.currentIndex]);
        }


    }
}
/******************** CONTROL ******************************/
setPreviousNextCachValue(){
    
    this.activeNextValue =  this.activeNext;
    this.activePreviousValue = this.activePrevious;
}

restorPreviousNextCachValue(){
    this.activeNext = this.activeNextValue;
    this.activePrevious = this.activePreviousValue;
}

next(_innerCall) {
    if(this.activeNext) {

        this.outSlideIndex = this.previousIndex;
        this.calculateIndexs(1);
        this.inSlideIndex = this.nextIndex;
        this.setPositionLeft();
        this.containerChildRegulate();
        console.log("N");
        console.log(_innerCall);
        
        if(_innerCall !== true){
            
            if( this.transitionDuration > 0) {
                this.setPreviousNextCachValue();
                this.activePrevious = false;
                this.activeNext = false;
                this.manualDirection = true;
            }

            if(this.autoSlideActive){
                this.stopAutoSlide();
                this.startAutoSlide();
            }
        }
        
    }
}

previous(_innerCall) {
    if(this.activePrevious) {

        this.outSlideIndex = this.nextIndex;
        this.calculateIndexs(-1);
        this.inSlideIndex = this.previousIndex;
        this.setPositionLeft();
        this.containerChildRegulate();
        console.log("P");
        console.log(_innerCall);

        if(_innerCall !== true){
            
            if( this.transitionDuration > 0) {
                this.setPreviousNextCachValue();
                this.activePrevious = false;
                this.activeNext = false;
                this.manualDirection = true;
            }
            
            if(this.autoSlideActive){
                this.stopAutoSlide();
                this.startAutoSlide();
            }
        }
        
    }

    /*console.log(`
            P : ${this.previousIndex} || C :  ${this.currentIndex} || N : ${this.nextIndex}
        `);*/
}
/************ AUTO SLIDE ********* */

startAutoSlide(seconds) {
    console.log("startAutoSlide");
    this.autoSlideActive = true;
    this.setAutoSlideTime(seconds);
    this.autoSlideTimeOut  = setTimeout(this.autoSlide, this.autoSlideTime);
}

setAutoSlideTime(time){
    if( time ) {
        if(time < 0.5){
            this.autoSlideTime = 500;
        }
        else{
            this.autoSlideTime = time * 1000;
        }

    }
    
}

autoSlide() {
    this[this.autoSlideDirection](true);
    if(this.autoSlideActive) {
        this.autoSlideTimeOut  = setTimeout(this.autoSlide, this.autoSlideTime);
    }
}

stopAutoSlide() {
    this.autoSlideActive = false;
    clearTimeout( this.autoSlideTimeOut );
    console.log("stoped");
}

setAutoSlideDirection(direction){
    this.stopAutoSlide();
    if(direction){
        this.autoSlideDirection = "next";
    }
    else{
        this.autoSlideDirection = "previous";
    }
    this.startAutoSlide();
}
set direction(direction){
    this.setAutoSlideDirection(direction);
}

/////////////////////BUTTON
appendButton(){
    if(!this.buttonMade){

        this.makeButton();
    }
    this.globalContainer.appendChild(this.previousButton);
    this.globalContainer.appendChild(this.nextButton);
}
removeButton(){
    this.globalContainer.removeChild(this.previousButton);
    this.globalContainer.removeChild(this.nextButton);
}
activateButton(){
    this.previousButton.disabled = false;
    this.nextButton.disabled = false;
}
disableButton(){
    this.previousButton.disabled = true;
    this.nextButton.disabled = true;
}
makeButton(){
    console.log("making button");
    this.previousButton = document.createElement("button");
    this.previousButton.id = "gd-SlideShow-previous-button";
    this.previousButton.addEventListener("click", this.previous.bind(this));
    this.nextButton = document.createElement("button");
    this.nextButton.id = "gd-SlideShow-next-button";
    this.nextButton.addEventListener("click", this.next.bind(this));
    
    this.buttonMade = true;
}

transitionDone(event){
    if(this.manualDirection && event.target === this.slideArray[this.currentIndex]){
        console.log("Transition done");
        
        console.log("Direction true");
        this.manualDirection = false;
        this.restorPreviousNextCachValue();
    }
}



/****************** SETUP ***********************/

containerSetUp() {

    let cach = ["relative", "absolute", "fixed"];
    let set = true;
    for(let i in cach){
        if($(this.globalContainer).css("position") == cach[i] ){
            set =false;
            break;
        }
    }
    if(set){
        $(this.globalContainer).css("position","relative");
    }



    this.container = document.createElement("div");
    this.container.id = "gd-slide-container";

    this.container.style.position = "relative";
    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.overflow = "hidden";
    this.container.style.backgroundColor = "#000";

    this.globalContainer.appendChild( this.container);
}

slideStyleSetup(slide) {

    slide.style.overflow = "hidden";
    slide.style.width = "100%";
    slide.style.height = "100%";
    slide.style.position = "absolute";
    slide.style.top = "0";
    /*slide.style.display = "flex";
    slide.style.alignItems = "center";*/
    slide.style.textAlign = "center";
    //slide.style.transitionTimingFunction = "linear";
    slide.style.transitionProperty = "left, right";
    slide.style.transitionDuration = this.transitionDuration +"s";

    if(slide.childNodes[0].nodeName == "IMG"  ) {

        slide.childNodes[0].style.maxHeight = "100%";
        slide.childNodes[0].style.maxWidth = "100%";
        }
        
    }

setTransitionDuration(duration){

    let length = this.slideArray.length;

        if(isNaN(duration)){
            throw new Error("Argument is not a number");
        }

        else if(this.transitionDuration * 1000 < this.autoSlideTime ){
            
            this.transitionDuration = duration;

            for(let i = 0; i < length; ++i){
                this.slideArray[i].style.transitionDuration = this.transitionDuration + "s";
            }
        }
    }
    
}