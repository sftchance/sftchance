import chroma from 'chroma-js';

import { Color } from './types';

export const getRandomColor = (): string => {
    return chroma.random().hex();
};

export const getMagicWandColors = (colors: Color[]) => {
    // Sometimes when a user changes the input the color scale will be all over the place.

    // Take the colors provided and make them all fit together.
    const sortedColors = colors.sort((a, b) => a.position - b.position);

    // Get the first and last color.
    const firstColor = sortedColors[0];
    const lastColor = sortedColors[sortedColors.length - 1];

    // Get the color scale between the first and last color.
    const colorScale = chroma.scale([firstColor.hex, lastColor.hex]);

    // Get the colors between the first and last color.
    const newColors = colorScale.colors(sortedColors.length);

    // Return the new colors.
    return sortedColors.map((color, index) => {
        return {
            ...color,
            hex: newColors[index],
        } as Color;
    });
};

export const getComplementaryColors = (colors: Color[], first: string = getRandomColor()) => {
    return getRandomColors(colors, first, chroma(first).set('hsl.h', '+180').hex());
};

export const getSplitComplementaryColors = (colors: Color[], first: string = getRandomColor()) => {
    return getRandomColors(colors, first, chroma(first).set('hsl.h', '+150').hex());
};

export const getTriadicColors = (colors: Color[], first: string = getRandomColor()) => {
    return getRandomColors(colors, first, chroma(first).set('hsl.h', '+120').hex());
};

export const getTetradicColors = (colors: Color[], first: string = getRandomColor()) => {
    return getRandomColors(colors, first, chroma(first).set('hsl.h', '+90').hex());
};

export const getAlgorithmicRandomColors = (colors: Color[], first: string = getRandomColor()) => {
    const random = Math.floor(Math.random() * 4);

    switch (random) {
        case 0:
            return getComplementaryColors(colors, first);
        case 1:
            return getSplitComplementaryColors(colors, first);
        case 2:
            return getTriadicColors(colors, first);
        case 3:
            return getTetradicColors(colors, first);
        default:
            return getComplementaryColors(colors, first);
    }
};

export const getRandomColors = (
    colors: Color[],
    first: string = getRandomColor(),
    second: string = getRandomColor(),
) => {
    const randomColors = chroma
        .scale([first, second])
        .mode('lch')
        .domain(colors.map((color) => color.position));

    return colors
        .map((color) => {
            if (chroma(color.hex).luminance() < 0.1 || chroma(color.hex).luminance() > 0.9) {
                return {
                    ...color,
                    hex: chroma(color.hex).set('lch.l', '70%').hex(),
                } as Color;
            }

            return color;
        })
        .map((color) => {
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
