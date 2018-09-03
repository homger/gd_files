






class gd_Ajax{
    constructor(method, url){
        

        this.xmlhttpObj = new XMLHttpRequest();
        this.xmlhttpObj.open(method, url, async);
        this.callBackFunction = callBackFunction;
        this.setUp(callBackFunction);
        if(autoSend){
            this.xmlhttpObj.send();
        }

    }

    setUp(){
        let callBack = this._reponse.bind(this);
        this.xmlhttpObj.onreadystatechange = function(callBackFunction) {
            if (this.readyState == 4 && this.status == 200) {
                callBackFunction(this.responseText);
            }
          };
    }

    send(sendText){
        if(sendText){
            this.xmlhttpObj.send(sendText);
        }
        else{
            this.xmlhttpObj.send();
        }
        
    }
    _reponse(data){
        this.data = data;
        if( this.callBackFunction ){
            console.log("call bab");
            this.callBackFunction(this.data);
            console.log("callsed bab");
        }
        
    }
}