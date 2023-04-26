import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle, faLock, faLockOpen, faRandom } from '@fortawesome/free-solid-svg-icons';

import { Color } from './types';

import orbNoise from './assets/orb-noise.png';
import orbTexture from './assets/orb-texture.png';

import './App.css';

const DEFAULT_COLORS: Color[] = [
    {
        hex: '#7d67bf',
        position: 0,
    },
    {
        hex: '#9c81ee',
        position: 10,
    },
    {
        hex: '#8c6fde',
        position: 20.95,
    },
    {
        hex: '#52308a',
        position: 70.96,
    },
    {
        hex: '#52308a',
        position: 83.61,
    },
    {
        hex: '#31054c',
        position: 93.72,
    },
    {
        hex: '#1a0139',
        position: 100,
    },
];

const getRandomColors = (colors: Color[]): Color[] => {
    return colors.map((color) => {
        if (color.locked) {
            return color;
        }

        return {
            ...color,
            hex: `#${Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0')}`,
        };
    });
};

function App() {
    const [colors, setColors] = useState<Color[]>(DEFAULT_COLORS);

    const orbStyle = {
        background: `radial-gradient(95.24% 100.5% at 2.04% 40.07%, ${colors
            .map((color) => {
                return `${color.hex} ${color.position}%`;
            })
            .join(', ')})`,
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

            <div className="preview">
                <div className="image">
                    <div className="orb blurred" style={orbStyle}></div>
                    <img className="texture blurred" src={orbTexture} alt="texture" />
                    <img className="noise blurred" src={orbNoise} alt="noise" />
                    <div className="blur"></div>
                    <div className="orb" style={orbStyle}></div>
                    <img className="texture" src={orbTexture} alt="texture" />
                    <img className="noise" src={orbNoise} alt="noise" />
                    <div className="shadow"></div>
                </div>
            </div>

            <div className="colors">
                {colors.map((color, index) => {
                    return (
                        <div key={index} className="color" style={{ background: color.hex }}>
                            <div>
                                <input
                                    type="text"
                                    value={color.hex}
                                    onChange={(e) => {
                                        const newColors = [...colors];
                                        newColors[index].hex = e.target.value as `#${string}`;
                                        setColors(newColors);
                                    }}
                                />

                                <button
                                    onClick={() => {
                                        const newColors = [...colors];
                                        newColors[index].locked = !newColors[index].locked;
                                        setColors(newColors);
                                    }}
                                >
                                    {color.locked ? (
                                        <FontAwesomeIcon icon={faLock} />
                                    ) : (
                                        <FontAwesomeIcon icon={faLockOpen} />
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default App;
