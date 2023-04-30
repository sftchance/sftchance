import { useMemo } from 'react';

import { Color } from '../types';

import { getMagicWandColors } from '../utils';

const useWand = ({ colors }: { colors: Color[] }) => {
    const {
        wandColors,
        perfect,
    }: {
        wandColors: Color[];
        perfect: boolean;
    } = useMemo(() => {
        const _wandColors = getMagicWandColors(colors);

        const empty = _wandColors.length == 0;

        const __wandColors = _wandColors.map((color, index) => {
            const _color = colors[index];

            return {
                ..._color,
                hex: _color.locked ? _color.hex : color.hex,
            };
        });

        const perfect = empty || __wandColors.every((color, index) => color.hex === colors[index].hex);

        return {
            wandColors: perfect ? colors : __wandColors,
            perfect,
        };
    }, [colors]);

    return {
        colors: wandColors,
        perfect,
    };
};

export { useWand };
