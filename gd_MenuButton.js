'use strcit';
let gd_MenuButton_Made = false;
class gd_MenuButton{
    constructor(container, callFunction, useStyleSheet = false, thickness = 0.5 ,transDuration = 0.2){
        this.callFunction = callFunction;

        this.thickness = thickness;
        this.transDuration = transDuration;
        this._isOpen = false;
        this.useStyleSheet = useStyleSheet;

        this.calcTopPosition();
        this.makeButton(container);
        if(gd_MenuButton_Made){
            this.useStyleSheet = false;
        }
        this.setStyle(this.useStyleSheet);
        this.click(this.useStyleSheet);
        this.objectMade = true;
        gd_MenuButton_Made = true;
    }

    makeButton(container){
        this.button = document.createElement("div");
        this.button.classList.toggle("gd_MenuButton");
        for(let i = 0; i < 3; ++i){
            this.button.appendChild( document.createElement("div") );
            this.button.childNodes[i].classList.toggle("gd_MenuButton_Child");
        }
        /*this.button.innerHTML = `
            <div class="gd_MenuButton_Child"></div>
            <div class="gd_MenuButton_Child"></div>
            <div class="gd_MenuButton_Child"></div>
        `;*/



        container.appendChild(this.button);
    }

    calcTopPosition(){
        this.__top = 0;
        this.__mid = 50 - (this.thickness / 2) + "%";
        this.__bottom = 100 - (this.thickness) + "%";
    }

    set thickness(thickness){
        
        if(!isNaN(thickness)){
            
            this.__thickness = thickness;
            if(this.__thickness > 1 ){
                this.__thickness = 1;
            }
            else if (this.__thickness < 0){
                this.__thickness = 0;
            }
        }
        else{
            this.__thickness = 0.5;
        }
        if(this.objectMade){
            this.changeGeometry();
        }
    }
    get thickness(){
        return this.__thickness * 33.33;
    }

    set transDuration(transDuration){
        if(!isNaN(transDuration)){
            if(transDuration < 0){
                this.__transDuration = 0;
            }
            else{
                this.__transDuration = transDuration;
            }
        }
        else{
            this.__transDuration = 0.2;
        }
        if(this.objectMade){
            this.timeChange();
        }
    }
    get transDuration(){
        return this.__transDuration + "s";
    }


    setStyle(inStyleTag){

        if(inStyleTag){
            let style = document.createElement("style");
            style.innerHTML = `
            .gd_MenuButton{
                position: relative;
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
            }

            .gd_MenuButton_Child{
                position: absolute;
                width: 100%;
                height: ${this.thickness}%;
                margin: 0;
                padding: 0;
                left: 0;
                top: 0;
                transition-property: opacity transform top height;
                transition-duration: ${this.transDuration};
            }
            .gd_MenuButton_Child:nth-child(1){
                top: ${this.__top};
            }
            .gd_MenuButton_Child:nth-child(2){
                opacity: 1;
                top: ${this.__mid};
            }
            .gd_MenuButton_Child:nth-child(3){
                top: ${this.__bottom};
            }

            .gd_MenuButton.open .gd_MenuButton_Child:nth-child(1){
                top: ${this.__mid};
                transform: rotate(45deg);
            }
            .gd_MenuButton.open .gd_MenuButton_Child:nth-child(2){
                opacity: 0;
            }
            .gd_MenuButton.open .gd_MenuButton_Child:nth-child(3){
                top: ${this.__mid};
                transform: rotate(-45deg);
            }

            `;
            document.head.appendChild(style);
        }
        else{
            this.button.style.height = "100%";
            this.button.style.width = "100%";
            this.button.style.margin = "0";
            this.button.style.padding = "0";
            this.button.style.position = "relative";

            for(let i = 0; i < 3; ++i){
                this.button.childNodes[i].style.position = "absolute";
                this.button.childNodes[i].style.height = this.thickness + "%";
                this.button.childNodes[i].style.width = "100%";
                this.button.childNodes[i].style.margin = "0";
                this.button.childNodes[i].style.padding = "0";
                this.button.childNodes[i].style.left = 0;
                this.button.childNodes[i].style.transitionDuration = this.transDuration;
            }
            this.button.childNodes[0].style.top = this.__top;
            this.button.childNodes[0].style.transitionProperty = "transform top height";
            this.button.childNodes[1].style.top = this.__mid;
            this.button.childNodes[1].style.transitionProperty = "opacity height";
            this.button.childNodes[2].style.top = this.__bottom;
            this.button.childNodes[2].style.transitionProperty = "transform top height";
        }
    }

    click(useStyleSheet){
        if(useStyleSheet){
            this.button.addEventListener("click", this.cssStyleClick.bind(this) );
        }
        else{
            this.button.addEventListener("click", this.jsStyleClick.bind(this) );
        }

        
    }


    cssStyleClick(){
        this.button.classList.toggle("open");
        this.callFunction();
    }
    jsStyleClick(){

        if(!this._isOpen){
            this.button.childNodes[0].style.top = this.__mid;
            this.button.childNodes[0].style.transform = "rotate(45deg)";

            this.button.childNodes[1].style.opacity = 0;

            this.button.childNodes[2].style.top = this.__mid;
            this.button.childNodes[2].style.transform = "rotate(-45deg)"
            this._isOpen = true;
        }
        else{
            this.button.childNodes[0].style.top = this.__top;
            this.button.childNodes[0].style.transform = "rotate(0deg)";

            this.button.childNodes[1].style.opacity = 1;

            this.button.childNodes[2].style.top = this.__bottom;
            this.button.childNodes[2].style.transform = "rotate(0deg)"
            this._isOpen = false;

        }
        this.callFunction();
    }
    changeGeometry(){
        this.calcTopPosition();
        for(let i = 0; i < 3; ++i){
            this.button.childNodes[i].height = this.thickness + "%";
        }
        
        this.button.childNodes[0].style.top = this.__top;
        this.button.childNodes[1].style.top = this.__mid;
        this.button.childNodes[2].style.top = this.__bottom;

    }
    timeChange(){
        for(let i = 0; i < 3; ++i){
            this.button.childNodes[i].style.transitionDuration = this.transDuration;
        }
    }

}