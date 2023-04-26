import { Color } from '../../types';

import { orbTexture, orbNoise } from '../../assets';

const Preview = ({ colors }: { colors: Color[] }) => {
    const orbStyle = {
        background: `radial-gradient(95.24% 100.5% at 2.04% 40.07%, ${colors
            .map((color) => {
                return `${color.hex} ${color.position}%`;
            })
            .join(', ')})`,
    };

    return (
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
    );
};

export { Preview };
