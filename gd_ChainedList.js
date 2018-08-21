'use strict';
console.log("chainedList.js loaded");

class gd_ChainedList{
    constructor(){
        this.currentIndex = 0;
        this.nextIndex = 0;
        this.previousIndex = 0;
        this.itemCount = 0;
        this.itemsArray = [];
    }
    add(item) {
        this.itemsArray.push(item);
        ++this.itemCount;

        this.nextIndex = (this.currentIndex + 1) % this.itemCount;
        this.previousIndex = (this.currentIndex - 1);
        if(this.previousIndex < 0) {
            this.previousIndex = this.itemCount - 1;
        }
    }
    remove(item){

    }
    removeById(id){

    }
    removeByIndex(index){

    }
    toNext(){

        this.currentIndex = (this.currentIndex + 1) % this.itemCount;
        this.nextIndex = (this.currentIndex + 1) % this.itemCount;

        this.previousIndex = (this.currentIndex - 1);
        if(this.previousIndex < 0) {
            this.previousIndex = this.itemCount - 1;
        }
    }
    toPrevious(){

        this.currentIndex = (this.currentIndex - 1);
        if(this.currentIndex < 0) {
            this.currentIndex = this.itemCount - 1;
        }

        this.nextIndex = (this.currentIndex + 1) % this.itemCount;

        this.previousIndex = (this.currentIndex - 1);
        if(this.previousIndex < 0) {
            this.previousIndex = this.itemCount - 1;
        }
        
    }
    get current(){
        return this.itemsArray[this.currentIndex];
    }
    get next(){
        return this.itemsArray[this.nextIndex];
    }
    get previous(){
        return this.itemsArray[this.previousIndex];
    }
}