'use strict';

var A_LIST_CSS_INSERTED = false;

/// This one is good but the " this.binding() " function doesn't
/// TAKES AN OBJECT (args) TO CONSTRUCT
/// args.list has the list of items
/// args.selected has the INDEX OF the SELECTED ITEM
/// args.clickFunction has the FUNCTION TO BE EXECUTED wen clicking on a NON SELECTED ITEM
/// args.inactive_list is an ARRAY WHERE EACH ELEMENT IS THE INDEX OF an UNACTIVE ELEMENT
/// args.container CONTAINT EVERY THING is there so you can move it using css or js easily..

class gd_Alist{
    constructor(args){
        this.object_op = true;
        Array.isArray(args.list) ? this.list = args.list : this.object_op = false;
        
        if(this.object_op){
            //this.binding();  :(  

            this.initial_setUp(args);  
            this.updateItems_data();

            this.isOpen = false;
            this.apply_style(this.isOpen);
            this.eventsSetup();
        }
        else{
            console.log( Error("args.list wrong data...") );
            
        }
    }

    initial_setUp(args){
        if(document.readyState !== "complete"){
            console.warn("document.readySate !== complete");
        }
        

        this.selected_index = 0;
        if(args.selected){
            this.selected_index = args.selected;
        }

            this.special_clickFunction = false;
        if(args.clickFunction && typeof args.clickFunction === "function"){
            this.special_clickFunction = true;
            this.itemClick_Function = args.clickFunction;
        }

        this.has_deactivated_Items = false;
        if( Array.isArray(args.inactive_list) ){
            this.deactivated_items = args.inactive_list;
            this.has_deactivated_Items = true;
            console.log("HAS INACTIVE : " + this.has_deactivated_Items);
        }

        if(args.container){
            this.container = args.container;
        }
        else{
            this.container = document.createElement("div");

            this.container.style.width = "50px";
            this.container.style.height = "50px";
            this.container.style.position = "fixed";
            this.container.style.top = "5px";
            this.container.style.right = "10px";
        }
        this.insertCss();
        
        this.items_count = this.list.length;
        this.items_data = [];
        this.items_list = [];

        let deactivated_cach = false;
        this.list.forEach((element, index) => {
            this.items_list.push(document.createElement("div"));
            this.items_list[index].innerHTML = element;
            this.items_list[index].classList = "a_list_item";
            this.items_list[index].index = index;
            console.log("HAS : " + this.deactivated_items.includes(index));

            if(this.has_deactivated_Items && this.deactivated_items.includes(index)){
                deactivated_cach = true;
            }

            this.items_data.push(
                {
                    "open_style" : {
                        "transform": "rotate(0deg)",
                        "left": "0",
                        "transitionDuration": "0s",
                        "transitionDelay": "0s",
                    },
                    "close_style" : {
                        "transform": "rotate(0deg)",
                        "left": "0",
                        "transitionDuration": "0s",
                        "transitionDelay": "0s",
                    },
                    "selected" : this.selected_index === index ? true : false,
                    "items_list_index" : index,
                    "deactivated" : deactivated_cach,
                }
            );
            if(this.items_data[index].selected){
                this.items_list[index].classList.toggle("a_list_selected");
            }
            deactivated_cach = false;
        });
        this.update_Items_Class();

        this.items_openClose_props = Object.keys(this.items_data[0].open_style);

        this.main_container = document.createElement("div");
        this.main_container.classList = "a_list_main_container";
        this.items_list.forEach(item => {
            this.main_container.appendChild(item);
        });



        document.body.appendChild(this.container);
        this.container.appendChild(this.main_container);

    }

    update_Items_Class(){
        this.items_data.forEach(element => {
            if(element.deactivated){
                console.log("update_Items_Class");
                this.items_list[element.items_list_index].classList.toggle("a_list_disactivated");
            }
        });
    }

    updateItems_data(){
        let i = 1;
        let selected_found = false;
        let deg = 360;
        
        this.items_data.forEach((element, index) => {

            if(!this.items_data[index].selected){
                this.items_data[index].open_style.transform = `rotate(-${deg}deg)`;
                this.items_data[index].open_style.left = `-${110 * i}%`;


                this.items_data[index].open_style.transitionDelay = `${0.1 * ( this.items_count - i)}s`;
                this.items_data[index].close_style.transitionDelay = `${0.1 * i}s`;

                this.items_data[index].open_style.transitionDuration = `${0.4}s`;
                this.items_data[index].close_style.transitionDuration = `${0.4}s`;
                

                ++i;
            }
            this.items_data[this.selected_index].open_style.transform = "0deg";
            this.items_data[this.selected_index].open_style.left = "0%";
            
            console.log(element);
        });
    }
    apply_style(open){

        let option = "close_style";
        if(open) { option = "open_style" };
        let item_cach;
        this.items_data.forEach(item => {

            item_cach = this.items_list[item.items_list_index];
            this.items_openClose_props.forEach(element => {
                item_cach.style[element] = item[option][element];
            });

        });
    }

    insertCss(){
        if(!A_LIST_CSS_INSERTED){
            
                let css = `
                .a_list_main_container{
                    width: 100%;
                    height: 100%;
                    position: relative;
                }

                .a_list_item{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;

                    display: flex;
                    justify-content: center;
                    align-items: center;

                    transition-property: left, transform;
                }

                .a_list_disactivated{
                    cursor: not-allowed;
                    background-color: grey;
                }

                .a_list_selected{
                    z-index: 2;
                }
            `;

            let style = document.createElement("style");
            style.id = "a_list_stylesheet";
            style.innerHTML = css;
            document.head.appendChild(style);

            A_LIST_CSS_INSERTED = true;
            console.log("CSS INJECTED");
        }
    }

    itemClick(event){

        if(this.isOpen){

            if(event.target.index != this.selected_index ){

                this.items_data[this.selected_index].selected = false;
                this.items_list[this.selected_index].classList.toggle("a_list_selected");

                this.selected_index = event.target.index;

                this.items_data[this.selected_index].selected = true;
                this.items_list[this.selected_index].classList.toggle("a_list_selected");

                this.updateItems_data();
                console.log("SELECTED CHANGED");
            }
            this.isOpen = false;
            this.apply_style(this.isOpen);
            return;
        }

        this.isOpen = true;
        this.apply_style(this.isOpen);
    }
    itemClick_ClickFunction(event){
        
        if(this.isOpen && this.selected_index != event.target.index){
            this.itemClick_Function(this.list[event.target.index]);
        }

        this.itemClick(event);
    }
    eventsSetup(){


        if(this.special_clickFunction){
            this.main_container.addEventListener("click", this.itemClick_ClickFunction.bind(this));
        }
        else{
            this.main_container.addEventListener("click", this.itemClick.bind(this));
        }

    }

    binding(){
        this.apply_style.bind(this);
        this.itemClick.bind(this);
        console.log("BINDING DONNE");
    }
}