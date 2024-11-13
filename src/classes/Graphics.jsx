import { useRef } from "react";

export class Graphics{
    /*
    - Renders screen by scale
    - Clears screen
    - Turns display pixels on and off
    */
    constructor(scale){

        this.canvas = 0;
        this.scale = 10;
        //64 x 32 screen
        this.rows = 32;
        this.columns = 64;

        this.screen = new Array(this.columns * this.rows);
    }

    setCanvas(canvas){

        this.canvas = canvas;

        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = this.columns * this.scale;
        this.canvas.height = this.rows * this.scale;
    }

    setPixel(x, y){
        console.log("setPixel");

        if(x > this.columns){
            x -= this.columns;
        }else if(x < 0){
            x += this.columns;
        }

        if(y > this.rows){
            y -= this.rows;
        }else if(y < 0){
            y += this.rows;
        }
        let pixelLoc = x + (y * this.columns);

        this.screen[pixelLoc] ^= 1;

        return !this.screen[pixelLoc];
    }
    render(){
        
        console.log("render");

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.columns * this.rows; i++){
            let x = (i % this.columns) * this.scale;

            let y = Math.floor(i / this.columns) * this.scale;

            if (this.screen[i]){
                this.ctx.fillStyle = 'blue';

                this.ctx.fillRect(x, y, this.scale, this.scale);
            }else{

                this.ctx.fillStyle = '#000';

                this.ctx.fillRect(x, y, this.scale, this.scale);
            }
        }
    
    }
    clear(){
        this.screen = new Array(this.columns * this.rows);
    }
}