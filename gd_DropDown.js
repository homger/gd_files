'use strict';


let __height = (element) => {
    return Math.max(
        //( element.scrollHeight + element.offsetHeight - element.clientHeight ),
        element.scrollHeight,
        element.offsetHeight,
        element.clientHeight,
    )
}

class gd_DropDown{
    constructor(dropclass){
        this.dropclass = dropclass;

        this.parseHTML();

    }
    parseHTML(){

        let dropclass_array = document.getElementsByClassName(this.dropclass);
        let gd_DropItem_Array = [];

        let length = dropclass_array.length;
        let indexCach = null;

        for(let i = 0; i < length; ++i){
            gd_DropItem_Array.push( new gd_DropItem(dropclass_array[i], this, i ) );

            if( gd_DropItem_Array[i].element.parentNode.is_gd_DropItem ){
                indexCach = gd_DropItem_Array[i].element.parentNode.gd_DropItem.mainArrayIndex;

                gd_DropItem_Array[indexCach].childsArray.push(gd_DropItem_Array[i]);
                gd_DropItem_Array[indexCach].childCount += 1;
                gd_DropItem_Array[i].parent = gd_DropItem_Array[indexCach];
            }
        }
        console.log("dropclass_array ITEM COUNT: " + length);
        for(let i = length-1; i >= 0; --i){
            if( gd_DropItem_Array[i].childCount == 0 ){
                gd_DropItem_Array[i].height = __height( gd_DropItem_Array[i].element ) + "px";
            }
            else if( gd_DropItem_Array[i].childCount >= 1 ){
                gd_DropItem_Array[i].height = "auto";
                gd_DropItem_Array[i].hasChild = true;
            }
            gd_DropItem_Array[i].setUp();
        }

    }


    click(dropItem){
        dropItem.isOpen = !dropItem.isOpen;
        
        if(dropItem.isOpen){
            dropItem.element.style.height = dropItem.height;
            dropItem.wasOpen = true;
            if(dropItem.parent){
                dropItem.parent.openChilds += 1;
                if(!dropItem.parent.isOpen){
                    dropItem.parent.open(1);
                }
            }
            if(dropItem.hasChild){
                let length = dropItem.childCount;
                for(let i = 0; i < length; ++i){
                    if(dropItem.childsArray[i].wasOpen){
                        dropItem.openChilds += 1;
                        dropItem.childsArray[i].open(2);
                    }
                }
            }
        }
        else{
            dropItem.wasOpen = false;
            if(dropItem.hasChild){
                let length = dropItem.childCount;
                for(let i = 0; i < length; ++i){
                    if(dropItem.childsArray[i].isOpen){
                        dropItem.openChilds -= 1;
                        dropItem.childsArray[i].close(1);
                    }
                }
            }
            if(dropItem.parent){
                dropItem.parent.openChilds -= 1;
                if(dropItem.parent.openChilds == 0){
                    dropItem.parent.close(2);
                }
            }
            dropItem.element.style.height = dropItem.closeHeight;
        }
    }



}








class gd_DropItem{
    constructor(element, manager, mainArrayIndex){
        this.element = element;
        this.element.gd_DropItem = this;
        this.element.is_gd_DropItem = true;
        this.manager = manager;
        this.childsArray = [];
        this.closeHeight = "10px";
        this.childCount = 0;
        this.openChilds = 0;
        this.isOpen = false;
        this.wasOpen = false;
        this.hasChild = false;
        this.parent = null;
        this.mainArrayIndex = mainArrayIndex;

    }
    setUp(){
        
        if(this.hasChild){
            this.height = "auto";
            this.closeHeight = "auto";
        }
        if(!this.isOpen){
            this.element.style.height = this.closeHeight;
        }
        else if(this.isOpen){
            if(this.parent){
                this.parent.openChilds += 1;
            }
            this.wasOpen = true;
            this.element.style.height = this.height;
        }
        this.element.addEventListener("click", this.click.bind(this));
    }
    click(event){
        if(this.element === event.target){
            this.manager.click(this);
        }
    }

    open(type){

        this.isOpen = true;
        this.element.style.height = this.height;
        if( type == 1){
            this.wasOpen = true;
            if(this.parent){
                this.parent.openChilds += 1;
                if(!this.parent.isOpen){
                    this.parent.open(1);
                }
            }
        }
        else if(type == 2){
            if(this.hasChild){
                for(let i = 0; i < this.childCount; ++i){
                    if(this.childsArray[i].wasOpen){
                        this.openChilds += 1;
                        this.childsArray[i].open(2);
                    }
                }
            }
        }        
    }
    close(type){

        this.isOpen = false;
        if( type == 1){
            if(this.hasChild){
                for(let i = 0; i < this.childCount; ++i){
                    if(this.childsArray[i].isOpen){
                        this.openChilds -= 1;
                        this.childsArray[i].close(1);
                    }
                }
            }
        }
        else if( type == 2){
            if(this.parent){
                this.parent.openChilds -= 1;
                if (this.parent.openChilds == 0){
                    this.parent.close(2);
                }
            }
        }
        this.element.style.height = this.closeHeight;
    }


}