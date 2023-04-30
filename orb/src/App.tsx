import chroma from 'chroma-js';

import { useEffect, useRef, useState } from 'react';

import { Color, Colors as ColorsType } from './types';

import { DEFAULT_COLORS } from './constants';

import { getAlgorithmicRandomColors, getMagicWandColors } from './utils';

import { useWand } from './hooks';

import { Colors, FooterIconButtons, IconButtons, Preview } from './components';

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

    const [colors, setColors] = useState<ColorsType>({
        colors: INIT_COLORS,
        changes: [],
        undos: [],
    });

    const [scaled, setScaled] = useState<boolean[]>(colors.colors.map(() => false));

    const [paused, setPaused] = useState<boolean>(false);
    const [light, setLight] = useState<boolean>(false);

    const { colors: wandColors, perfect } = useWand({ colors: colors.colors });

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
        setColors((prevColors) => {
            const newColors = [
                ...prevColors.colors.slice(0, index),
                {
                    ...color,
                    [key]: value,
                },
                ...prevColors.colors.slice(index + 1),
            ];

            newColors[index].invalid = !chroma.valid(newColors[index].hex);

            return {
                colors: newColors,
                changes: [...prevColors.changes, prevColors.colors],
                undos: [],
            };
        });
    };

    const onColorsChange = (colors: Color[]) => {
        setColors((prevColors) => {
            return {
                colors,
                changes: [...prevColors.changes, prevColors.colors],
                undos: [],
            };
        });
    };

    useEffect(() => {
        const params = new URLSearchParams();

        colors.colors.forEach((color) => {
            params.append('color', color.hex);
        });

        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }, [colors]);

    return (
        <div className={`orb ${light ? 'light' : 'dark'}`}>
            {scaled.some((s) => s) && (
                <div className="scale-overlay" onClick={() => setScaled((scaled) => scaled.map(() => false))} />
            )}

            <div className="orb-container">
                <IconButtons
                    previewRef={previewRef}
                    light={light}
                    paused={paused}
                    colors={colors}
                    onUndo={() => {
                        if (colors.changes.length === 0) return;

                        setColors((colors) => {
                            return {
                                colors: colors.changes[colors.changes.length - 1],
                                changes: colors.changes.slice(0, colors.changes.length - 1),
                                undos: [...colors.undos, colors.colors],
                            };
                        });
                    }}
                    onRedo={() => {
                        if (colors.undos.length === 0) return;

                        setColors((colors) => {
                            return {
                                colors: colors.undos[colors.undos.length - 1],
                                changes: [...colors.changes, colors.colors],
                                undos: colors.undos.slice(0, colors.undos.length - 1),
                            };
                        });
                    }}
                    onPause={() => {
                        setPaused((paused) => !paused);
                    }}
                />

                <Preview previewRef={previewRef} colors={colors.colors} paused={paused} />

                <FooterIconButtons
                    perfect={perfect}
                    light={light}
                    onReset={() => {
                        onColorsChange(DEFAULT_COLORS);
                    }}
                    onShuffle={() => {
                        onColorsChange(getMagicWandColors(getAlgorithmicRandomColors(colors.colors)));
                    }}
                    onWand={() => {
                        onColorsChange(wandColors);
                    }}
                    onLight={() => {
                        setLight((light) => !light);
                    }}
                />

                <Colors
                    colors={colors.colors}
                    scaled={scaled}
                    onChange={(index, e) => {
                        onColorChange(index, colors.colors[index], 'hex', e.target.value);
                    }}
                    onHide={(index) => {
                        onColorChange(index, colors.colors[index], 'hidden', !colors.colors[index].hidden);
                    }}
                    onToggle={(index) => {
                        onColorChange(index, colors.colors[index], 'locked', !colors.colors[index].locked);
                    }}
                    onScaled={(index) => {
                        setScaled((scaled) => {
                            const _scaled = [...scaled];

                            _scaled[index] = !_scaled[index];

                            return _scaled;
                        });
                    }}
                />

                {/* <MintButton colors={colors} /> */}
            </div>
        </div>
    );
}

export default App;
