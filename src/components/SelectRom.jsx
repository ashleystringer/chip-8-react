import React, { useEffect } from 'react'

export default function SelectRom({file, setFile}) {

    function handleChange(e){

        //const selectedFile = e.target.value;
        setFile(e.target.value);
        /*const selectedFile = 'TEST';

        const url = new URL(`/public/roms/${selectedFile}.ch8`, "http://localhost:5173/");

        load(url);*/

    }

    /*async function load(url){
        const data = await fetch(url)
        .then(data => {
            return data.arrayBuffer();
        })

        const array = new Uint8Array(data);
    
        setFile(array);
    }*/

    return (
        <div>
            <select onChange={handleChange}>
                <option value="1-ibm-logo">IBM Logo Test</option>
                <option value="ultimatetictactoe">Ultimate Tic Tac Toe</option>
                <option value='TEST'>Test</option>
                <option value='PONG'>Pong</option>
                <option value='PONG2'>Pong2</option>
                <option value='TETRIS'>Tetris</option>
                <option value="TICTAC">TicTac</option>
                <option value="MAZE">Maze</option>
            </select>
        </div>
    )
}