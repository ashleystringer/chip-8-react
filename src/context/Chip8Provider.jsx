import { createContext, useContext } from 'react';

const Chip8Context = createContext(null);

function Chip8Provider({children}){
    return (
        <Chip8Context.Provider>
            {children}
        </Chip8Context.Provider>
    );
}