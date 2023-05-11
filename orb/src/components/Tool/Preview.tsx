import { PreviewProps } from '../../types';

const Preview = ({ previewRef, colors, paused }: PreviewProps) => {
    return (
        <div className={`preview ${paused ? 'paused' : ''}`}>
            <div className="image" ref={previewRef}>
                <svg viewBox="0 0 600 600">
                    <style>
                        {`
                                .f { animation: float 5s cubic-bezier(0.42, 0, 0.58, 1) infinite; }
                                .b { animation: blur 5s cubic-bezier(.42, 0, .58, 1) infinite; }
                                .o { mix-blend-mode: overlay; }
                                .s { mix-blend-mode: screen; }

                                @keyframes blur{ 
                                    0% { 
                                        filter: blur(10px) brightness(1.1) saturate(1.1);
                                        -webkit-filter: blur(10px) brightness(1.1) saturate(1.1);
                                        -moz-filter: blur(10px) brightness(1.1) saturate(1.1);
                                        -o-filter: blur(10px) brightness(1.1) saturate(1.1);
                                        -ms-filter: blur(10px) brightness(1.1) saturate(1.1);
                                    }
                                    50% { 
                                        filter: blur(40px) brightness(1.5) saturate(1.3);
                                        -webkit-filter: blur(40px) brightness(1.5) saturate(1.3);
                                        -moz-filter: blur(40px) brightness(1.5) saturate(1.3);
                                        -o-filter: blur(40px) brightness(1.5) saturate(1.3);
                                        -ms-filter: blur(40px) brightness(1.5) saturate(1.3);
                                    }
                                    100% { 
                                        filter: blur(10px) brightness(1.1) saturate(1.1);
                                        -webkit-filter: blur(10px) brightness(1.1) saturate(1.1);
                                        -moz-filter: blur(10px) brightness(1.1) saturate(1.1);
                                        -o-filter: blur(10px) brightness(1.1) saturate(1.1);
                                        -ms-filter: blur(10px) brightness(1.1) saturate(1.1);
                                    }
                                }

                                @keyframes float {
                                    0% { transform: translateY(0); }
                                    50% { transform: translateY(-10px); }
                                    100% { transform: translateY(0); }
                                }
                            `}
                    </style>

                    <defs>
                        <radialGradient id="og" cx="50%" cy="50%" r="65%" fx="1%" fy="35%">
                            {colors
                                .filter((color) => !color.hidden && !color.invalid)
                                .map((color, index) => {
                                    return (
                                        <stop
                                            key={index}
                                            offset={`${color.position}%`}
                                            stopColor={color.hex}
                                            stopOpacity="1"
                                        ></stop>
                                    );
                                })}
                        </radialGradient>

                        <radialGradient id="ogs" cx="50%" cy="50%" r="65%" fx="1%" fy="35%">
                            <stop offset="0%" stopColor="#000" stopOpacity="0"></stop>
                            <stop offset="15%" stopColor="#000" stopOpacity=".1"></stop>
                            <stop offset="30%" stopColor="#000" stopOpacity=".2"></stop>
                            <stop offset="70%" stopColor="#000" stopOpacity=".3"></stop>
                            <stop offset="85%" stopColor="#000" stopOpacity=".85"></stop>
                            <stop offset="97%" stopColor="#000" stopOpacity=".95"></stop>
                            <stop offset="100%" stopColor="#000" stopOpacity="1"></stop>
                        </radialGradient>

                        <filter id="ogn">
                            <feTurbulence
                                type="turbulence"
                                baseFrequency=".95"
                                numOctaves="5"
                                seed={15}
                                stitchTiles="stitch"
                                x="0%"
                                y="0%"
                                result="turbulence"
                            ></feTurbulence>
                            <feSpecularLighting
                                surfaceScale="9"
                                specularConstant="2.1"
                                specularExponent="10"
                                lightingColor="#fff"
                                in="turbulence"
                                result="specularLighting"
                            >
                                <feDistantLight azimuth="3" elevation="50"></feDistantLight>
                            </feSpecularLighting>
                        </filter>

                        <filter id="t">
                            <feTurbulence type="fractalNoise" baseFrequency=".015" result="noise" numOctaves="5" />

                            <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="5">
                                <feDistantLight azimuth="1000" elevation="10" />
                            </feDiffuseLighting>
                        </filter>
                    </defs>

                    <g className="f">
                        <g className="b" width="100%" height="100%">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="215"
                                fill="url(#og)"
                                transform="rotate(100)"
                                transform-origin="center"
                            />
                        </g>

                        <circle
                            cx="300"
                            cy="300"
                            r="200"
                            fill="url(#og)"
                            transform="rotate(100)"
                            transform-origin="center"
                        />

                        <mask id="ognm">
                            <circle cx="300" cy="300" r="200" fill="#fff" />
                        </mask>

                        <circle
                            cx="300"
                            cy="300"
                            r="200"
                            filter="url(#t)"
                            mask="url(#ognm)"
                            transform="rotate(15)"
                            opacity={0.15}
                            transform-origin="center"
                            className="o"
                        />

                        <rect
                            width="200%"
                            height="200%"
                            filter="url(#ogn)"
                            opacity=".4"
                            mask="url(#ognm)"
                            className="o"
                        ></rect>

                        <rect
                            width="200%"
                            height="200%"
                            filter="url(#ogn)"
                            transform="rotate(-15) scale(.98)"
                            transform-origin="center"
                            opacity=".4"
                            mask="url(#ognm)"
                            className="o"
                        ></rect>

                        <rect
                            width="200%"
                            height="200%"
                            filter="url(#ogn)"
                            transform="rotate(-30) scale(.99)"
                            transform-origin="center"
                            opacity=".4"
                            mask="url(#ognm)"
                            className="o"
                        ></rect>

                        <rect
                            width="200%"
                            height="200%"
                            filter="url(#ogn)"
                            transform="rotate(-45) scale(1.01)"
                            transform-origin="center"
                            opacity=".4"
                            mask="url(#ognm)"
                            className="o"
                        ></rect>

                        <rect
                            width="200%"
                            height="200%"
                            filter="url(#ogn)"
                            transform="rotate(-60) scale(1)"
                            transform-origin="center"
                            opacity=".4"
                            mask="url(#ognm)"
                            className="o"
                        ></rect>

                        <circle
                            cx="300"
                            cy="300"
                            r="200"
                            filter="url(#t)"
                            mask="url(#ognm)"
                            opacity="0.25"
                            transform-origin="center"
                            className="s"
                        />

                        <circle
                            cx="300"
                            cy="300"
                            r="200"
                            fill="url(#ogs)"
                            transform="rotate(100)"
                            transform-origin="center"
                            className="o"
                        />
                    </g>
                </svg>
            </div>
        </div>
    );
};

export { Preview };
