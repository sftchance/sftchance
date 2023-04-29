import chroma from 'chroma-js';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Color, Colors as ColorsType } from './types';

import { getAlgorithmicRandomColors, getMagicWandColors } from './utils';

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

    const [colors, setColors] = useState<ColorsType>({
        colors: INIT_COLORS,
        changes: [],
        undos: [],
    });

    const [paused, setPaused] = useState<boolean>(false);

    const {
        wandColors,
        perfect,
    }: {
        wandColors: Color[];
        perfect: boolean;
    } = useMemo(() => {
        const _wandColors = getMagicWandColors(colors.colors);

        const empty = _wandColors.length == 0;

        const perfect = empty || _wandColors.every((color, index) => color.hex === colors.colors[index].hex);

        return {
            wandColors: perfect ? colors.colors : _wandColors,
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

    const onUndo = () => {
        if (colors.changes.length === 0) return;

        setColors((colors) => {
            return {
                colors: colors.changes[colors.changes.length - 1],
                changes: colors.changes.slice(0, colors.changes.length - 1),
                undos: [...colors.undos, colors.colors],
            };
        });
    };

    const onRedo = () => {
        if (colors.undos.length === 0) return;

        setColors((colors) => {
            return {
                colors: colors.undos[colors.undos.length - 1],
                changes: [...colors.changes, colors.colors],
                undos: colors.undos.slice(0, colors.undos.length - 1),
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
        <div className="orb">
            <div className="orb-container">
                <IconButtons
                    previewRef={previewRef}
                    paused={paused}
                    colors={colors}
                    perfect={perfect}
                    onReset={() => {
                        setColors((colors) => {
                            return { ...colors, colors: DEFAULT_COLORS };
                        });
                    }}
                    onShuffle={() => {
                        setColors((colors) => {
                            return { ...colors, colors: getAlgorithmicRandomColors(colors.colors) };
                        });
                    }}
                    onUndo={onUndo}
                    onRedo={onRedo}
                    onPause={() => {
                        setPaused((paused) => !paused);
                    }}
                    onWand={() => {
                        setColors((colors) => {
                            return { ...colors, colors: wandColors };
                        });
                    }}
                />

                <Preview previewRef={previewRef} colors={colors.colors} paused={paused} />

                <Colors
                    colors={colors.colors}
                    onChange={(index, e) => {
                        onColorChange(index, colors.colors[index], 'hex', e.target.value);
                    }}
                    onHide={(index) => {
                        onColorChange(index, colors.colors[index], 'hidden', !colors.colors[index].hidden);
                    }}
                    onToggle={(index) => {
                        onColorChange(index, colors.colors[index], 'locked', !colors.colors[index].locked);
                    }}
                />
                {/* <MintButton colors={colors} /> */}
            </div>
        </div>
    );
}

export default App;
