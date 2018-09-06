'use strict';



class gd_SlideShow {
    constructor(globalContainer) {
        this.globalContainer = globalContainer;
        this.container;

        this.activeNext = false;
        this.activePrevious = false;

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


        this.containerSetUp();
    }


addSlide(slide) {
    // THE SLDIE GOES IN A DIV
    if(slide instanceof HTMLElement) {
        this.slideArray.push( document.createElement("div") );
        this.slideArray[this.slideCount].appendChild(slide);
        this.slideCount++;

        this.slideStyleSetup( this.slideArray[this.slideCount - 1] );

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

next() {
    if(this.activeNext) {

        this.outSlideIndex = this.previousIndex;
        this.calculateIndexs(1);
        this.inSlideIndex = this.nextIndex;
        this.setPositionLeft();
        this.containerChildRegulate();
        console.log("N");
    }
}

previous() {
    if(this.activePrevious) {

        this.outSlideIndex = this.nextIndex;
        this.calculateIndexs(-1);
        this.inSlideIndex = this.previousIndex;
        this.setPositionLeft();
        this.containerChildRegulate();
        console.log("P");
    }

    /*console.log(`
            P : ${this.previousIndex} || C :  ${this.currentIndex} || N : ${this.nextIndex}
        `);*/
}
/************ AUTO SLIDE ********* */

startAutoSlide(seconds) {
    this.autoSlideActive = true;
    if( seconds ) {
        this.autoSlideTime = seconds * 1000;
    }
    this.autoSlide();
}

autoSlide() {
    this[this.autoSlideDirection]();
    if(this.autoSlideActive) {
        this.autoSlideTimeOut  = setTimeout(this.autoSlide, this.autoSlideTime);
    }
}

stopAutoSlide() {
    this.autoSlideActive = false;
    clearTimeout( this.autoSlideTimeOut );
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


/****************** SETUP ***********************/

containerSetUp() {
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
    slide.style.transitionProperty = "left, right";
    slide.style.transitionDuration = "0.5s";

    if(slide.childNodes[0].nodeName == "IMG"  ) {

        slide.childNodes[0].style.maxHeight = "100%";
        slide.childNodes[0].style.maxWidth = "100%";
        }
        
    }
    
}