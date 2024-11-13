import React, { useEffect, useState } from 'react'


  export const KEYMAP = {
      49: 0x1, // 1
      50: 0x2, // 2
      51: 0x3, // 3
      52: 0xc, // 4
      81: 0x4, // Q
      87: 0x5, // W
      69: 0x6, // E
      82: 0xD, // R
      65: 0x7, // A
      83: 0x8, // S
      68: 0x9, // D
      70: 0xE, // F
      90: 0xA, // Z
      88: 0x0, // X
      67: 0xB, // C
      86: 0xF  // V
}

export default function Keyboard({ setKeyboardObject }) {

  const [keys, setKeys] = useState({});
  const [pressedKey, setPressedKey] = useState();
  
  /*
    - keysPressed
    - onNextKeyPressed
    - isKeyPressed 
    - onKeyDown
    - onKeyUp
  */

    function onKeyDown(e){
      console.log(e.keyCode);
      const keyCode = e.keyCode;
      setPressedKey(KEYMAP[keyCode]);

      setKeyboardObject(prev => {
        return { pressedKey: KEYMAP[keyCode], onNextKeyPressed: null };
      });
    }

    function onKeyUp(e){
      setPressedKey(null);

      setKeyboardObject(prev => {
        return { pressedKey: null, onNextKeyPressed: null };
      });    }

    useEffect(() => {
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      }
    }, []);

    function isKeyPressed(){

    }

  return (
    <div>Keyboard</div>
  )
}