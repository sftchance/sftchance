import chroma from 'chroma-js';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Color } from './types';

import { colorMapToId, getAlgorithmicRandomColors, getMagicWandColors } from './utils';

import { DEFAULT_COLORS } from './constants';

import { Colors, IconButtons, Preview } from './components';

import './App.css';

const URL_COLOR_CODES = new URLSearchParams(window.location.search).getAll('color');

const URL_COLORS = URL_COLOR_CODES.map((hex, index) => ({
    hex,
    position: DEFAULT_COLORS[index].position,
    invalid: !chroma.valid(hex),
    hidden: false,
    locked: false,
}));

const INIT_COLORS = URL_COLORS.length ? URL_COLORS : DEFAULT_COLORS;

function App() {
    const previewRef = useRef<HTMLDivElement>(null);

    const [colors, setColors] = useState<Color[]>(INIT_COLORS);
    const [paused, setPaused] = useState<boolean>(false);

    const { wandColors, perfect } = useMemo(() => {
        const _wandColors = getMagicWandColors(colors);

        const perfect = _wandColors.length == 0 || _wandColors.every((color, index) => color.hex === colors[index].hex);

        return {
            wandColors: _wandColors,
            perfect,
        };
    }, [colors]);

    // const id = useMemo(() => {
    //     return colorMapToId({
    //         x: 0,
    //         y: 0,
    //         speed: 0,
    //         colorCount: colors.length,
    //         bgTransparent: false,
    //         bgScalar: 0,
    //         colors: colors.map((color) => ({
    //             empty: false,
    //             domain: 0,
    //             r: 0,
    //             g: 0,
    //             b: 0,
    //         })),
    //     });
    // }, [colors]);

    // id;

    const onColorChange = (index: number, color: Color, key: keyof Color, value: string | number | boolean) => {
        if (key === 'hex') color.invalid = !chroma.valid(color.hex);

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
        <div className="orb">
            <div className="orb-container">
                <IconButtons
                    previewRef={previewRef}
                    paused={paused}
                    colors={colors}
                    perfect={perfect}
                    onReset={() => {
                        setColors(DEFAULT_COLORS);
                    }}
                    onPause={() => {
                        setPaused((paused) => !paused);
                    }}
                    onShuffle={() => {
                        setColors((colors) => getMagicWandColors(getAlgorithmicRandomColors(colors)));
                    }}
                    onWand={() => {
                        setColors(wandColors);
                    }}
                />

                <Preview previewRef={previewRef} colors={colors} paused={paused} />

                <Colors
                    colors={colors}
                    onChange={(index, e) => {
                        onColorChange(index, colors[index], 'hex', e.target.value);
                    }}
                    onHide={(index) => {
                        onColorChange(index, colors[index], 'hidden', !colors[index].hidden);
                    }}
                    onToggle={(index) => {
                        onColorChange(index, colors[index], 'locked', !colors[index].locked);
                    }}
                />
                {/* <MintButton colors={colors} /> */}
            </div>
        </div>
    );
}

export default App;
