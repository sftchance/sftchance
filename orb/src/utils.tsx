import chroma from 'chroma-js';

import { Color } from './types';

const getRandomColor = (): string => {
    return chroma.random().hex();
};

const getRandomColors = (colors: Color[]): Color[] => {
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

export { getRandomColor, getRandomColors };
