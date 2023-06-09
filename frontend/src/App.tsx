import chroma from 'chroma-js';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Color, Colors as ColorsType } from './types';

import { DEFAULT_COLORS } from './constants';

import { getAlgorithmicRandomColors, getId, getMagicWandColors } from './utils';

import { useDropper, useWand } from './hooks';

import { Colors, Dropper, FooterIconButtons, IconButtons, Preview } from './components';

import './App.css';

const URL_COLORS = new URLSearchParams(window.location.search)
    .getAll('color')
    .slice(0, 7)
    .map((hex, index) => {
        return {
            hex,
            position: DEFAULT_COLORS[index].position,
            invalid: !chroma.valid(hex),
        };
    });

const INIT_COLORS = (URL_COLORS.length ? URL_COLORS : DEFAULT_COLORS).slice(0, 7).map((color, index) => {
    return {
        ...color,
        hidden: false,
        hiddenOnScale: ![0, 3, 6].includes(index),
        locked: false,
    };
});

function App() {
    const previewRef = useRef<HTMLDivElement>(null);

    const { ref, dragging, onDrag, onDrop } = useDropper({
        onDrop: (colors) => {
            const imageColors = colors.map((color, index) => ({
                hex: color,
                position: DEFAULT_COLORS[index].position,
                invalid: !chroma.valid(color),
                hidden: false,
                hiddenOnScale: ![0, 3, 6].includes(index),
                locked: false,
            }));

            onColorsChange(imageColors);
        },
    });

    const [colors, setColors] = useState<ColorsType>({
        colors: INIT_COLORS,
        changes: [],
        undos: [],
    });

    const [scaled, setScaled] = useState<boolean[]>(colors.colors.map(() => false));

    const [paused, setPaused] = useState<boolean>(false);
    const [light, setLight] = useState<boolean>(false);

    const { colors: wandColors, perfect } = useWand({ colors: colors.colors });

    const id = useMemo(() => {
        return getId({
            x: 0,
            y: 0,
            speed: 0,
            colorCount: colors.colors.length,
            bgTransparent: false,
            bgScalar: 0,
            colors: colors.colors.map((color) => {
                const rgb = chroma(color.hex).rgb();

                return {
                    empty: false,
                    domain: color.position,
                    r: rgb[0],
                    g: rgb[1],
                    b: rgb[2],
                };
            }),
        });
    }, [colors]);

    console.log(id);

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
                colors: getMagicWandColors(newColors, true),
                changes: [...prevColors.changes, prevColors.colors],
                undos: [],
            };
        });
    };

    const onColorsChange = (colors: Color[]) => {
        setColors((prevColors) => {
            return {
                colors: colors,
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
        <div className={`orb-section ${light ? 'light' : 'dark'} ${dragging ? 'dragging' : ''}`} onDragEnter={onDrag}>
            {scaled.some((s) => s) && (
                <div className="scale-overlay" onClick={() => setScaled((scaled) => scaled.map(() => false))} />
            )}

            <Dropper importRef={ref} dragging={dragging} onDrag={onDrag} onDrop={onDrop} />

            <div className="orb-container">
                <div className="top">
                    <IconButtons
                        importRef={ref}
                        previewRef={previewRef}
                        light={light}
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
                        onLight={() => {
                            setLight((light) => !light);
                        }}
                    />

                    <Preview previewRef={previewRef} colors={colors.colors} paused={paused} />
                </div>

                <div className="bottom">
                    <FooterIconButtons
                        perfect={perfect}
                        paused={paused}
                        id={id}
                        onReset={() => {
                            onColorsChange(DEFAULT_COLORS);
                        }}
                        onShuffle={() => {
                            onColorsChange(getMagicWandColors(getAlgorithmicRandomColors(colors.colors)));
                        }}
                        onWand={() => {
                            onColorsChange(wandColors);
                        }}
                        onPause={() => {
                            setPaused((paused) => !paused);
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
                </div>

            </div>
        </div>
    );
}

export { App };
