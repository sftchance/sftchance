import { useEffect, useState } from 'react';

import { Color } from './types';

import { DEFAULT_COLORS } from './constants';

import { getRandomColors } from './utils';

import { ClipboardButton, Colors, Preview, ShuffleButton } from './components';

import './App.css';

const URL_COLOR_CODES = new URLSearchParams(window.location.search).getAll('color');

const URL_COLORS = URL_COLOR_CODES.map((hex, index) => ({
    hex,
    position: DEFAULT_COLORS[index].position,
    locked: false,
}));

const INIT_COLORS = URL_COLORS.length ? URL_COLORS : DEFAULT_COLORS;

function App() {
    const [colors, setColors] = useState<Color[]>(INIT_COLORS);

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

    useEffect(() => {
        const params = new URLSearchParams();

        colors.forEach((color) => {
            params.append('color', color.hex);
        });

        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }, [colors]);

    return (
        <>
            <ClipboardButton
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                }}
            />

            <ShuffleButton
                onClick={() => {
                    setColors((colors) => getRandomColors(colors));
                }}
            />

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
