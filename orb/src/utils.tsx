import chroma from 'chroma-js';

import { Color, OnchainColor, OnchainColorMap } from './types';

export const getRandomColor = (): string => {
    return chroma.random().hex();
};

export const getMagicWandColors = (colors: Color[]): Color[] => {
    const sortedColors = colors.sort((a, b) => a.position - b.position);

    const firstColor = sortedColors[0];
    const lastColor = sortedColors[sortedColors.length - 1];

    if (!sortedColors.every((color) => !chroma.valid(color.hex))) return [];

    const colorScale = chroma.scale([firstColor.hex, lastColor.hex]);

    const newColors = colorScale.colors(sortedColors.length);

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

export const colorMapToId = (colorMap: OnchainColorMap): number => {
    const dna = bitpackColor(colorMap.colors);

    return dna;
};

export const colorMapFromId = (id: string): OnchainColorMap => {
    id;

    const map: OnchainColorMap = {
        x: 0,
        y: 0,
        speed: 0,
        colorCount: 0,
        bgTransparent: false,
        bgScalar: 0,
        colors: [],
    };

    return map;
};

export const bitpackColor = (colors: OnchainColor[], color = 0) => {
    for (let i = 0; i < colors.length; i++) {
        const c = colors[i];

        color |= !c.empty ? 1 : 0 << 31;
        color |= c.domain << 30;
        color |= c.r << 20;
        color |= c.g << 10;
        color |= c.b << 0;

        if (i < colors.length - 1) {
            color <<= 32;
        }

        console.log('color', color);
    }

    console.log(recoverColor(color, colors.length));

    return color;
};

export const recoverColor = (color: number, length: number, colors: OnchainColor[] = []) => {
    for (let i = length; i > -1; i--) {
        const c: OnchainColor = {
            empty: false,
            domain: 0,
            r: 0,
            g: 0,
            b: 0,
        };

        c.empty = (color & (1 << 31)) !== 0;
        c.domain = (color & (1 << 30)) !== 0 ? 1 : 0;
        c.r = (color & (0x3ff << 20)) >> 20;
        c.g = (color & (0x3ff << 10)) >> 10;
        c.b = (color & (0xff << 0)) >> 0;

        colors.push(c);

        color >>= 32;
    }

    return colors;
};
