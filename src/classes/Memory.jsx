import { useRef } from "react";

export class Memory{

    constructor(){
        /*
            //Load fonts into memory
        */
       this.memory = new Array(4096);
       this.loadSpritesToMemory();
    }

    getMem(){
        return this.memory;
    }

    loadSpritesToMemory(){
        const sprites = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];

        for(let i = 0; i < sprites.length; i++){
            this.memory[i] = sprites[i];
        }
    }

    async loadROMToMemory(rom){
        const url = new URL(`/roms/${rom}.ch8`, "http://localhost:5173/");
        
        const data = await fetch(url)
        .then(data => {
            console.log("data");
            console.log(data);
            return data.arrayBuffer();
        });

        console.log(`data.byteLength: ${data.byteLength}`);
  
        const arrayRom = new Uint8Array(data);

        this.clear();
        
        for(let i = 0; i < arrayRom.length; i++){ //(let i = 0; i < rom.length; i++)
          this.memory[0x200 + i] = arrayRom[i];
        }

        console.log("this.memory");
        console.table(this.memory);

        /*console.log(`arrayRom.length: ${arrayRom.length}`);
        console.log("arrayRom");
        console.table(arrayRom);*/
        
      }
      
    clear(){
      this.memory = this.memory.fill(0);
      
      this.loadSpritesToMemory();
    }
}