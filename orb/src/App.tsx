import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

import { Color } from './types';

import { DEFAULT_COLORS } from './constants';

import { getRandomColors } from './utils';

import { Preview } from './components/Preview';
import { Colors } from './components/Colors';

import './App.css';

function App() {
    const [colors, setColors] = useState<Color[]>(DEFAULT_COLORS);

    const onColorChange = (index: number, color: Color, key: keyof Color, value: string | number | boolean) => {
        setColors([
            ...colors.slice(0, index),
            {
                ...color,
                [key]: value,
            },
            ...colors.slice(index + 1),
        ]);
    };

    return (
        <>
            <button
                className="shuffle"
                onClick={() => {
                    setColors((colors) => getRandomColors(colors));
                }}
            >
                <FontAwesomeIcon icon={faShuffle} />
            </button>

            <Preview colors={colors} />

            <Colors
                colors={colors}
                onChange={(index, e) => {
                    onColorChange(index, colors[index], 'hex', e.target.value);
                }}
                onToggle={(index) => {
                    onColorChange(index, colors[index], 'locked', !colors[index].locked);
                }}
            />
        </>
    );
}

export default App;
