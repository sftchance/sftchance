import chroma from 'chroma-js';

import { Color } from './types';

export const getRandomColor = (): string => {
    return chroma.random().hex();
};

export const getRandomColors = (colors: Color[]): Color[] => {
    const randomColors = chroma
        .scale([getRandomColor(), getRandomColor()])
        .mode('lch')
        .domain(colors.map((color) => color.position));

    return colors.map((color) => {
        if (color.locked) {
            return color;
        }

        return {
            ...color,
            hex: randomColors(color.position).hex(),
        } as Color;
    });
};

export const bitpackColor = (colors: number[][], color = 0) => {
    for (let i = 0; i < colors.length; i++) {
        const rgb = colors[i];
        color += rgb[0] << (i * 32);
        color += rgb[1] << (i * 32 + 8);
        color += rgb[2] << (i * 32 + 16);
    }

    return color;
};

export const recoverColor = (color: number, length: number, colors: number[][] = []) => {
    for (let i = length; i > -1; i--) {
        colors.push([(color >> (i * 32)) & 0xff, (color >> (i * 32 + 8)) & 0xff, (color >> (i * 32 + 16)) & 0xff]);
    }

    return colors;
};
