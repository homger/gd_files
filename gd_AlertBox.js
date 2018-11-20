'use strict';




class gd_AlertBox{
    constructor(container, removeAllAlert = true, zIndex = 100){
        this.alertBox = document.createElement("div");
        this.childCount = 0;
        if(container){
            container.appendChild(this.alertBox);
            this.hasContainer = true;
        }
        this.alertBox.classList.toggle("gd_AlertBox");
        this.baseWidth = "10vw";
        this.removeAllAlert = removeAllAlert;
        this.setStyle();
        if(!this.hasContainer){
            document.body.appendChild(this.alertBox);
        }

        if(this.removeAllAlert){
            let removeAllitem = this.addItem("Click here to remove all");
            removeAllitem.item.addEventListener("click",function(){
                this.removeAll();
            }.bind(this));
            
        }
        this.zIndex = zIndex;
    }
    set zIndex(index){
        this.alertBox.style.zIndex = index;
    }
    setStyle(){
        if(this.hasContainer){
            this.alertBox.style.width = "100%";
        }
        else{
            this.alertBox.style.width = this.baseWidth;
            this.alertBox.style.position = "fixed";
            this.alertBox.style.top = "10px";
            this.alertBox.style.right = "10px";
        }
        this.alertBox.style.height = "auto";
        this.alertBox.style.padding = "3px";

    }

    addItem(message){
        this.childCount += 1;
        let alertItem = new gd_AlertItem(message, this);
        if( this.removeAllAlert){
            if(this.childCount > 1){
                this.alertBox.insertBefore(alertItem.item, this.alertBox.firstChild.nextSibling);
            }
            else{
                this.alertBox.appendChild(alertItem.item);
            }
        }
        return alertItem;
    }
    addAlert(message){
        this.addItem(message);
    }

    __childRemoved(){
        this.childCount -= 1;
        if(this.childCount == 0){
            this.alertBox.parentNode.removeChild(this.alertBox);
        }
    }

    removeAll(){
        let length = this.alertBox.childNodes.length;
        for(let i = 0; i < length; ++i){
            this.alertBox.removeChild(this.alertBox.firstChild);
            this.__childRemoved();
        }
    }

}




class gd_AlertItem{
    constructor(msg, alertBox){
        this.item = document.createElement("div");
        this.overLay = document.createElement("div");
        this.alertBox = alertBox;
        this.setStyle();
        this.setEvent();
        this.item.innerHTML = `<p>${msg}</p>`;
        this.item.appendChild(this.overLay);
    }

    setStyle(){
        this.item.style.position = "relative";
        this.item.style.width = "100%";
        this.item.style.height = "auto";
        this.item.style.padding = "2px";
        this.item.style.textAlign = "center";
        this.item.classList.toggle("gd_AlertItem");

        this.overLay.style.width = "100%";
        this.overLay.style.height = "100%";
        this.overLay.style.position = "absolute";
        this.overLay.style.top = "0";
        this.overLay.style.left = "0";
    }

    setEvent(){
        this.item.addEventListener("click", this.click.bind(this) );
    }
    
    click(){
        this.item.removeEventListener("click", this.click.bind(this));
        this.item.parentNode.removeChild(this.item);
        this.alertBox.__childRemoved();
    }
}