'use strict';

class gd_Timer{
    constructor(monitor = false, monitorTicks = 100, monitorCallBackFunction = null){
        this.timeOver = false;
        this.monitor = monitor;
        if(this.monitor){
            this.monitorTimeout;
            this.startMonitor = this.startMonitor.bind(this, monitorTicks);
            if(monitorCallBackFunction){
                this.monitorCallBackFunction = monitorCallBackFunction;
                this.monitorCallBack = true;
            }
        }
    }
    get now(){
        return Date.now();
    }
    startTimer( duration ){
        if(this.timerPaused){
            this.timerEnd = this._timerRemainingTime + this.now;
            this.timerPaused = false;
        }
        else{
            this.timerEnd = this.now + (duration * 1000);
            this.timeOver = false;
        }

        if(this.monitor){
            this.startMonitor(this.monitorTicks);
        }
    }
    get time(){
            this.timerRemainingTimeRegulate();
            return this._timerRemainingTime;
    }
    timerRemainingTimeRegulate(){
        this._timerRemainingTime = this.timerEnd - this.now;
    }
    timerPause(){
        this.timerRemainingTimeRegulate();
        this.timerPaused = true;
        if(this.monitorTimeout){
            clearTimeout(this.monitorTimeout);
        }
    }
    get timeString(){
        let cach = new Date(this.time);
        let str = `${cach.getMinutes()} : ${cach.getSeconds()}`;
        return str;
    }
    startMonitor(monitorTicks){
        if( this.time <= 0){
            clearTimeout(this.monitorTimeout);
            this.timeOver = true;
        }
        if(this.monitor && this.timeOver == false){
            this.monitorTimeout = setTimeout(this.startMonitor, monitorTicks);
        }
        else if(this.monitorCallBack){
            this.monitorCallBackFunction();
            console.log("CALLED BACK FUNCTION ");
        }
    }


}
