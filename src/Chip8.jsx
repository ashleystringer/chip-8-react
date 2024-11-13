import React, { useState, useEffect, useRef } from 'react';
import SelectRom from './components/SelectRom.jsx';
import Renderer from "./components/Renderer.jsx";
import Keyboard from "./components/Keyboard.jsx";
import { Processor } from "./classes/Processor.jsx";
import { Memory } from "./classes/Memory";
import { Graphics } from "./classes/Graphics";

export default function Chip8() {

    const [file, setFile] = useState("1-ibm-logo");
    const [isPaused, setIsPaused] = useState(true);
    const speedRef = useRef(60 / 1000);

    const [graphics, setGraphics] = useState(new Graphics(10));
    const [keyboardObject, setKeyboardObject] = useState({ pressedKey: null, onNextKeyPressed: null });
    const [processor, setProcessor] = useState(new Processor(graphics, keyboardObject));
    const canvasRef = useRef(null);

    //const processorRef = useRef(new Processor());


    useEffect(() => {
      console.log("file changed");
      console.log(`file: ${file}`);

      
      if(file){  
        processor.loadNewGame(file);
      }
    }, [file]);
  

    useEffect(() => {
      let interval = 0;
      
      if(!isPaused){
        interval = setInterval(() => { processor.cycle() }, speedRef.value); //60 times per second
      }

      return () => clearInterval(interval);

      //processor.pauseGame(isPaused);

      /*if(!isPaused){
        processor.cycle();
      }*/

    }, [isPaused]);

  return (
    <>
      <div>Chip8</div>

      <button onClick={() => setIsPaused(prev => !prev)}>{isPaused === true ? "Play" : "Pause"}</button>

      <SelectRom file={file} setFile={setFile}/>

      <Renderer graphics={graphics}/>

      <Keyboard setKeyboardObject={setKeyboardObject}/>
    </>
  )
}
