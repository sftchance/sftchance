import { useState } from 'react';

import { Color } from './types';

import './App.css';

function App() {
    const [colors, setColors] = useState<Color[]>([]);

    return (
        <>
            <h1>Test</h1>

            <input></input>

            {colors.map((color) => {
                return <p key={color.hex}>{color.hex}</p>;
            })}
        </>
    );
}

export default App;
