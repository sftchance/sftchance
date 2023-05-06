import { PreviewProps } from '../../types';

import { orbTexture } from '../../assets';

const Preview = ({ previewRef, colors, paused }: PreviewProps) => {
    console.log(paused);

    const orbStyle = {
        background: `radial-gradient(100% 100% at 5% 35%, ${colors
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
                <div className="orb" style={orbStyle}></div>
                <img className="texture" src={orbTexture} alt="texture" />
                <div className="noise">
                    <svg viewBox="0 0 200 200" opacity="0.4">
                        <defs>
                            <filter
                                id="nnnoise-filter"
                                x="-20%"
                                y="-20%"
                                width="140%"
                                height="140%"
                                filterUnits="objectBoundingBox"
                                primitiveUnits="userSpaceOnUse"
                                color-interpolation-filters="linearRGB"
                            >
                                <feTurbulence
                                    type="turbulence"
                                    baseFrequency="0.95"
                                    numOctaves="5"
                                    seed="15"
                                    stitchTiles="stitch"
                                    x="0%"
                                    y="0%"
                                    width="100%"
                                    height="100%"
                                    result="turbulence"
                                ></feTurbulence>
                                <feSpecularLighting
                                    surfaceScale="9"
                                    specularConstant="2.1"
                                    specularExponent="10"
                                    lighting-color="#ffffff"
                                    x="0%"
                                    y="0%"
                                    width="100%"
                                    height="100%"
                                    in="turbulence"
                                    result="specularLighting"
                                >
                                    <feDistantLight azimuth="3" elevation="50"></feDistantLight>
                                </feSpecularLighting>
                            </filter>
                        </defs>

                        <rect width="200" height="200" fill="transparent"></rect>
                        <rect width="200" height="200" fill="#ffffff" filter="url(#nnnoise-filter)"></rect>
                        <rect
                            width="300"
                            height="300"
                            fill="#ffffff"
                            filter="url(#nnnoise-filter)"
                            transform="rotate(-30)"
                            transform-origin="center"
                        ></rect>
                        <rect
                            width="300"
                            height="300"
                            fill="#ffffff"
                            filter="url(#nnnoise-filter)"
                            transform="translate(-100, 0) rotate(-60) "
                            transform-origin="center"
                        ></rect>
                        <rect
                            width="300"
                            height="300"
                            fill="#ffffff"
                            filter="url(#nnnoise-filter)"
                            transform="translate(0, -100) rotate(-90) "
                            transform-origin="center"
                        ></rect>
                    </svg>
                </div>

                <div className="shadow"></div>
            </div>
        </div>
    );
};

export { Preview };
