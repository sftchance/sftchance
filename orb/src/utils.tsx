import chroma from 'chroma-js';

import { Color } from './types';

export const isDark = (hex: string, threshold = 0.3): boolean => {
    hex = hex.replace('#', '');

    const int = parseInt(hex, 16);

    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    return luminance < threshold;
};

export const getRandomColor = (): string => {
    return chroma.random().hex();
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

    console.log('colors', colors);

    return colors
        .map((color) => {
            if (color.locked) {
                return color;
            }

            // if (chroma(color.hex).luminance() < 0.1 || chroma(color.hex).luminance() > 0.9) {
            //     return {
            //         ...color,
            //         hex: chroma(color.hex).set('lch.l', '90%').hex(),
            //     } as Color;
            // }

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

export const getScaleColors = (color: string): string[] => {
    if (!chroma.valid(color)) {
        return [];
    }

    const scale = chroma
        .scale(['#000', color, '#fff'])
        .mode('lch')
        .colors(15)
        .map((color) => chroma(color).hex());

    return scale;
};

export const getGradientColors = (data: string, numColors = 7): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = data;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject([]);
            return;
        }

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            if (ctx) {
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                const width = imageData.width;
                const height = imageData.height;
                const centerCol = Math.floor(width / 2);
                const startY = 0;
                const endY = height - 1;

                const step = Math.round((endY - startY) / numColors);

                const colors = [];

                for (let y = startY; y <= endY; y += step) {
                    const offset = (y * width + centerCol) * 4;
                    const r = pixels[offset];
                    const g = pixels[offset + 1];
                    const b = pixels[offset + 2];

                    const hex = chroma(r, g, b).hex();
                    colors.push(hex);
                }

                resolve(colors.slice(0, numColors));
            } else {
                reject([]);
            }
        };

        img.onerror = () => {
            reject([]);
        };
    });
};

export const getMagicWandColors = (colors: Color[]): Color[] => {
    console.log('shuffledColors', colors);

    if (colors.some((color) => color.invalid)) return [];

    const sortedColors = colors.sort((a, b) => {
        const aLuminance = chroma(a.hex).luminance();
        const bLuminance = chroma(b.hex).luminance();

        return aLuminance + bLuminance;
    });

    const firstColor = sortedColors[0];
    const lastColor = sortedColors[sortedColors.length - 1];

    console.log('checking for invalid', sortedColors);

    const colorScale = chroma.scale([firstColor.hex, lastColor.hex]);

    const newColors = colorScale.colors(sortedColors.length);

    return sortedColors.map((color, index) => {
        if (colors[index].locked) return colors[index];

        return {
            ...color,
            hex: newColors[index],
        } as Color;
    });
};
