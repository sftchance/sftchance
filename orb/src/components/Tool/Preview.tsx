import chroma from 'chroma-js';

import { Color } from '../../types';

import { orbTexture, orbNoise } from '../../assets';

const Preview = ({
    previewRef,
    colors,
    paused,
}: {
    previewRef: React.RefObject<HTMLDivElement>;
    colors: Color[];
    paused: boolean;
}) => {
    const orbStyle = {
        background: `radial-gradient(95.24% 100.5% at 2.04% 40.07%, ${colors
            .filter((color) => !color.hidden && !color.invalid)
            .map((color) => {
                return `${color.hex} ${color.position}%`;
            })
            .join(', ')})`,
    };

    return (
        <div className={`preview ${paused ? 'paused' : ''}`}>
            <div className="image" ref={previewRef}>
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
    );
};

export { Preview };
