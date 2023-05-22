import { ethers } from 'ethers';

import { OnchainColorMap } from '../../orb/src/types';

import { getId } from '../utils';

const ipfsHash = process.env.IPFS_HASH || 'Qm';

const DEFAULT_MAP: OnchainColorMap = {
    x: 1,
    y: 35,
    speed: 2,
    bgTransparent: false,
    bgScalar: 255,
    colors: [
        { empty: false, domain: 10, r: 255, g: 0, b: 255 },
        { empty: false, domain: 20, r: 255, g: 255, b: 255 },
        { empty: false, domain: 30, r: 255, g: 0, b: 255 },
        { empty: true, domain: 40, r: 255, g: 255, b: 255 },
        { empty: false, domain: 50, r: 255, g: 255, b: 255 },
        { empty: false, domain: 60, r: 255, g: 255, b: 255 },
        { empty: false, domain: 70, r: 0, g: 0, b: 0 },
    ],
    colorCount: 6,
};

DEFAULT_MAP.colorCount = DEFAULT_MAP.colors.filter(c => !c.empty).length;

const DEFAULT_ID = getId(DEFAULT_MAP);

const DEFAULT_ATTRIBUTES = [
    { trait_type: 'Coordinates', value: `(${DEFAULT_MAP.x}, ${DEFAULT_MAP.y})` },
    { display_type: 'number', trait_type: 'Speed', value: DEFAULT_MAP.speed },
    { display_type: 'number', trait_type: 'Colors', value: DEFAULT_MAP.colorCount },
    { trait_type: 'Background', value: '#FFFFFF' },
    { trait_type: 'Color #1', value: '#FF00FF:10' },
    { trait_type: 'Color #2', value: '#FFFFFF:20' },
    { trait_type: 'Color #3', value: '#FF00FF:30' },
    { trait_type: 'Color #5', value: '#FFFFFF:50' },
    { trait_type: 'Color #6', value: '#FFFFFF:60' },
    { trait_type: 'Color #7', value: '#000000:70' }
]

const HEAD_STR = 's cubic-bezier(.42,0,.58,1) infinite blur}.o{mix-blend-mode:overlay}.s{mix-blend-mode:screen}@keyframes blur{0%,100%{filter:blur(10px) brightness(1.1) saturate(1.1);-webkit-filter:blur(10px) brightness(1.1) saturate(1.1);-moz-filter:blur(10px) brightness(1.1) saturate(1.1);-o-filter:blur(10px) brightness(1.1) saturate(1.1);-ms-filter:blur(10px) brightness(1.1) saturate(1.1)}50%{filter:blur(40px) brightness(1.5) saturate(1.3);-webkit-filter:blur(40px) brightness(1.5) saturate(1.3);-moz-filter:blur(40px) brightness(1.5) saturate(1.3);-o-filter:blur(40px) brightness(1.5) saturate(1.3);-ms-filter:blur(40px) brightness(1.5) saturate(1.3)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}</style><defs>';

const NOISE_FILTER_STR = '<stop offset="0%" stop-color="#000" stop-opacity="0"/><stop offset="15%" stop-color="#000" stop-opacity=".1"/><stop offset="30%" stop-color="#000" stop-opacity=".2"/><stop offset="70%" stop-color="#000" stop-opacity=".3"/><stop offset="85%" stop-color="#000" stop-opacity=".85"/><stop offset="97%" stop-color="#000" stop-opacity=".95"/><stop offset="100%" stop-color="#000" stop-opacity="1"/></radialGradient><filter id="ogn"><feTurbulence type="turbulence" baseFrequency=".95" numOctaves="5" '

const FILTER_STR = 'stitchTiles="stitch" x="0%" y="0%" result="turbulence"></feTurbulence><feSpecularLighting surfaceScale="9" specularConstant="2.1" specularExponent="10" lightingColor="#fff" in="turbulence" result="specularLighting"><feDistantLight azimuth="3" elevation="50"></feDistantLight></feSpecularLighting></filter><filter id="t"><feTurbulence type="fractalNoise" baseFrequency=".015" result="noise" numOctaves="5" /><feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="5"><feDistantLight azimuth="1000" elevation="10" /></feDiffuseLighting></filter></defs>';

const CIRCLE_STR = '<g class="f"><circle cx="50%" cy="50%" r="215" fill="url(#og)" transform="rotate(100)" transform-origin="center" class="b" /><circle cx="300" cy="300" r="200" fill="url(#og)" transform="rotate(100)" transform-origin="center" /><mask id="ognm"><circle cx="300" cy="300" r="200" fill="#fff" /></mask><circle cx="300" cy="300" r="200" filter="url(#t)" mask="url(#ognm)" transform="rotate(15)" opacity="0.15" transform-origin="center" class="o" />';

const DEFAULT_NOISE_STR = '<rect width="200%" height="200%" filter="url(#ogn)" opacity=".4" mask="url(#ognm)" class="o"></rect><rect width="200%" height="200%" filter="url(#ogn)" transform="rotate(-15) scale(.98)" transform-origin="center" opacity=".4" mask="url(#ognm)" class="o"></rect><rect width="200%" height="200%" filter="url(#ogn)" transform="rotate(-30) scale(.99)" transform-origin="center" opacity=".4" mask="url(#ognm)" class="o"></rect><rect width="200%" height="200%" filter="url(#ogn)" transform="rotate(-45) scale(.97)" transform-origin="center" opacity=".4" mask="url(#ognm)" class="o"></rect><rect width="200%" height="200%" filter="url(#ogn)" transform="rotate(-60) scale(1.0)" transform-origin="center" opacity=".4" mask="url(#ognm)" class="o"></rect>';

const DEFAULT_SHADOW_STR = '<circle cx="300" cy="300" r="200" filter="url(#t)" mask="url(#ognm)" opacity="0.25" transform-origin="center" class="s" /><circle cx="300" cy="300" r="200" fill="url(#ogs)" transform="rotate(100)" transform-origin="center" class="o" /></g>';

const DEFAULT_LAYERS: string[] = [
    HEAD_STR,
    NOISE_FILTER_STR,
    FILTER_STR,
    CIRCLE_STR + DEFAULT_NOISE_STR + DEFAULT_SHADOW_STR,
]

const DEFAULT_IPFS_HASH_BYTES = ethers.utils.toUtf8Bytes(ipfsHash);

export { DEFAULT_ATTRIBUTES, DEFAULT_ID, DEFAULT_IPFS_HASH_BYTES, DEFAULT_LAYERS, DEFAULT_MAP }