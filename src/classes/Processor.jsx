import { useRef } from "react";
import { Memory } from "./Memory";


export class Processor{
    constructor(graphics, keyboard){
        this.stack = new Array(16).fill(0);
        this.registers = new Array(16).fill(0);
        this.index = 0;
        this.pc = 0x200;
        this.delayTimer = 60;
        this.soundTimer = 60;
        this.speed = (600/1000);
        this.graphics = graphics;
        this.keyboardObject = null;
        this.memory = new Memory();
        this.isFileLoaded = false;
    }

    /*
    - Create a cycle function
    - Fetch, decode, and execute instructions with in the cycle function
    - Create the following requirements -
        - Memory - 4KB
        - Display - 64 x 32
        - Stack - 16 levels
        - Registers - 16 (with VF as a flag register)
        - Index register
        - Timers - Delay and Sound (both 60 Hz)
        - Program Counter - 16-bit
    - Create the following instructions -
        - 00E0 - Clear the display
        - 1NNN - Jump to address NNN
        - 6XNN - Set VX to NN
        - 7XNN - Add NN to VX
        - ANNN - Set I to NNN
        - DXYN - Draw a sprite at (VX, VY) with width 8 and height N
    */

    async loadNewGame(rom){
      console.log("loadNewGame");

      await this.memory.loadROMToMemory(rom);
      this.isFileLoaded = true;

      this.pc = 0x200;
      this.stack = new Array(16).fill(0);
      this.registers = new Array(16).fill(0);
      this.graphics.clear();
      this.graphics.render();
    }
    
    changeKeyboardObject(keyboardObject){
      this.keyboardObject = keyboardObject;
    }

    pauseGame(pauseValue){
      this.isPaused = pauseValue;
    }

    cycle(){
          this.graphics.render();
          this.updateTimers();

          for(let i = 0; i < 10; i++){
              const instruction = this.fetchInstruction();

              console.log(`this.pc: ${this.pc}, instruction: ${instruction.toString(16)}`);

              this.execute(instruction);

              //this.pc += 2;
          }        
    }

    updateTimers(){
      if(this.delayTimer > 0){
        this.delayTimer--;
      }
      if(this.soundTimer > 0){
        this.soundTimer--;
      }
    }

    fetchInstruction(){
        return this.memory.memory[this.pc] << 8 | this.memory.memory[this.pc + 1];
    }

    execute(instruction){

      const opcode = this.firstNibble(instruction);
      const x = this.secondNibble(instruction);
      const y = this.thirdNibble(instruction);
      const nn = this.secondByte(instruction);
      const nnn = this.memAddress(instruction);

      //console.log(`instruction: ${instruction.toString(16)}`);
      console.log(`instruction: ${instruction.toString(16)}, x: ${x}, y: ${y}`)
      //console.log(`this.registers[x]: ${this.registers[x]}, this.registers[y]: ${this.registers[y]}`);

      this.pc += 2;

      switch(opcode){
        case 0x0:
            console.log("0x0");
            this.x0(instruction);
          break;
        case 0x1:
            this.pc = nnn;
            //this.pc -= 2;
            //console.log("0x1");
          break;
        case 0x2:
            this.stack.push(this.pc); //Where does this.stack lead to?
            this.pc = nnn;
            //this.pc -= 2;
            //console.log("0x2");
          break;
        case 0x3:
            if(this.registers[x] === nn){
              this.pc += 2;
            }
          break;
        case 0x4:
            if(this.registers[x] !== nn){
              this.pc += 2;
            }
          break;
        case 0x5:
            if(this.registers[x] === this.registers[y]){
              this.pc += 2;
            }
          break;
        case 0x6:
            this.registers[x] = nn;
            console.log("0x6");
          break;
        case 0x7: 
            this.registers[x] += nn;
            console.log("0x7");
          break;
        case 0x8:
            this.x8(instruction);
          break;
        case 0x9:
          if(this.registers[x] !== this.registers[y]){
            this.pc += 2;
          }
          break;
        case 0xA:
            this.index = nnn;
            //console.log("0xA");
          break;
        case 0xC: 
          this.registers[x] = Math.floor(Math.random() * 256) & nn;
          break;
        case 0xD:
            let width = 8;
            let height = (opcode & 0xF);

            this.registers[0xF] = 0;

            for(let row = 0; row < height; row++){
              let sprite = this.memory.memory[this.index + row];
              for (let col = 0; col < width; col++){
                if((sprite & 0x80) > 0){
                  //console.log(`instruction: ${instruction.toString(16)}, x: ${x}, y: ${y}`)
                  //console.log(`x: ${x}, y: ${y}, (registers[x] + col): ${this.registers[x] + col}, (registers[y] + row): ${this.registers[y] + row}`);
                  //console.log(`this.registers[x]: ${this.registers[x]}, this.registers[y]: ${this.registers[y]}`);
                  if(this.graphics.setPixel(this.registers[x] + col, this.registers[y] + row)){
                    this.registers[0xF] = 1;
                  }
                }
                sprite <<= 1;
              }
            }

            console.log("0xD");
          break;
          case 0xE:
              console.log("0xE");
              this.xE(instruction);
            break;
          case 0xF:
              this.xF(instruction);
            break;
          default:
            console.log("Not a valid opcode");
      }

      //this.pc += 2; 

    }

  x0(opcode){
    const nn = this.secondByte(opcode);

    //console.log(`opcode: ${opcode}, x0 function, nn: ${nn}`);

    switch (nn) {
      case 0xE0:
        this.graphics.clear();
        break;
      case 0xEE:
        //return subroutine
        console.log('0xEE');
        const address = this.stack.pop();
        console.log(`address: ${address}`);
        this.pc = address;
        break;
    }

  }

  x8(instruction){
    const n = this.fourthNibble(instruction);

    const x = this.secondNibble(instruction);
    const y = this.thirdNibble(instruction);

    switch (n) {
      case 0x0:
        this.registers[x] = this.registers[y];
        break;
      case 0x1:
        this.registers[x] |= this.registers[y];
        break;
      case 0x2:
        this.registers[x] &= this.registers[y];
        break;
      case 0x3:
        this.registers[x] ^= this.registers[y];
        break;
      case 0x4:
        if ((this.registers[x] + this.registers[y]) > 0xFF){
          this.registers[0xF] = 1;
        }else{
          this.registers[0xF] = 0;
        }
        this.registers[x] += this.registers[y];
        break;
      case 0x5:
        if(this.register[x] > this.registers[y]){
          this.registers[0xF] = 1;
        }else{
          this.registers[0xF] = 0;
        }
        this.registers[x] -= this.registers[y];
        break;
      case 0x6:
        this.registers[0xF] = (this.registers[x] & 0x1); 

        this.registers[x] >>= 1;
        break;
      case 0x7:
        if (this.registers[y] > this.registers[x]){
          this.registers[0xF] = 1;
        }else{
          this.registers[0xF] = 0;
        }
        this.registers[x] = this.registers[y] - this.registers[x];
        break;
      case 0xe:
        this.registers[0xF] = (this.registers[x] & 0x80);
        this.registers[x] <<= 1;
        break;
    }
  }

  xE(instruction){
    const x = this.secondNibble(instruction);
    const n = this.fourthNibble(instruction);

    switch (n) {
      case 0xE:
        //skips next instruction if key is pressed
        
        if(this.registers[x] === this.keyboard.pressedKey){
          this.pc += 2;
        }        
        break;
      case 0x1:
        //skips next instruction if key isn't pressed

        console.log('EXA1');
        console.log(`this.keyBoardObject`);
        console.log(this.keyboardObject);
        //console.log(`this.keyboard.pressedKey: ${this.keyboard.pressedKey}`);

        if(this.registers[x] !== this.keyboardObject.pressedKey){
          this.pc += 2;
        }        
        break;
    }
  }

  xF(instruction){
    const nn = this.secondByte(instruction);
    const x = this.secondNibble(instruction);

    switch (nn) {
      case 0x07:
        this.registers[x] = this.delayTimer;
        break;
      case 0x0A:
        //press key is awaited, and then stored in VX
        //this.registers[x] = ;
        this.waitForKeyPress(x);
        break;
      case 0x15:
        this.soundTimer = this.registers[x];
        break;
      case 0x18:
        this.soundTimer = this.registers[x];
        break;
      case 0x1E:
        this.index += this.registers[x];
        break;
      case 0x29:
        this.index = (this.registers[x] * 5)
        break;
      case 0x33:
        this.memory.memory[this.index] = this.registers[x] / 100;
        this.memory.memory[this.index + 1] = (this.registers[x] % 10) / 10;
        this.memory.memory[this.index + 2] = this.registers[x] % 10;
        break;
      case 0x55:
        for (let i = 0; i < x; i++) {
          this.memory.memory[this.index + 1] = this.registers[i];
        }
        break;
      case 0x65:
        for (let i = 0; i < x; i++) {
          this.registers[i] = this.memory.memory[this.index + 1];
        }
        break;
    }
  }

  firstNibble(opcode){
    return (opcode & 0xf000) >> 12;
  }
  secondNibble(opcode) {
    return (opcode & 0x0f00) >> 8;
  }
  thirdNibble(opcode) {
    return (opcode & 0x00f0) >> 4;
  }
  fourthNibble(opcode) {
    return opcode & 0x000f;
  }
  secondByte(opcode) {
    return opcode & 0x00ff;
  }
  memAddress(opcode) {
    return opcode & 0x0fff;
  }

  waitForKeyPress(x){
    switch(this.keyboard.pressedKey){
      case 0:
          this.registers[x] = 0;
          //this.pc += 2;
        break;
      case 1:
          this.registers[x] = 1;
          //this.pc += 2;
        break;
      case 2: 
          this.registers[x] = 2;
          //this.pc += 2;
        break;
      case 3:
          this.registers[x] = 3;
          //this.pc += 2;
        break;
      case 4: 
          this.registers[x] = 4;
          //this.pc += 2;
        break;
      case 5:
          this.registers[x] = 5;
          //this.pc += 2;
        break;
      case 6:
          this.registers[x] = 6;
          //this.pc += 2;
        break;
      case 7:
          this.registers[x] = 7;
          //this.pc += 2;
        break;
      case 8:
          this.registers[x] = 8;
          //this.pc += 2;
        break;
      case 9: 
          this.registers[x] = 9;
          //this.pc += 2;
        break;
      case 10:
          this.registers[x] = 10;
          //this.pc += 2;
        break;
      case 11:
          this.registers[x] = 11;
          //this.pc += 2;
        break;
      case 12:
          this.registers[x] = 12;
          //this.pc += 2;
        break;
      case 13:
          this.registers[x] = 13;
          //this.pc += 2;
        break;
      case 14:
          this.registers[x] = 14;
          //this.pc += 2;
        break;
      case 15:
          this.registers[x] = 15;
          //this.pc += 2;
        break;
      default:
          this.pc -= 2;
        break;
    }
  }

}

