import { OnchainColor, OnchainColorMap } from '../types';

const getId = (map: OnchainColorMap): bigint => {
    let id = 0n;

    map.colors.forEach((color, i) => {
        const { empty, domain, r, g, b } = color;

        let colorId = 0n;

        colorId |= BigInt(b);
        colorId |= BigInt(g) << 8n;
        colorId |= BigInt(r) << 16n;
        colorId |= BigInt(domain) << 24n;
        colorId |= BigInt(!empty ? 1 : 0) << 31n;

        id |= BigInt(colorId) << BigInt(i * 32);
    });

    if (id === 0n) throw new Error('Invalid color map');

    let top = 0n;

    top |= BigInt(map.y);
    top |= BigInt(map.x) << 9n;
    top |= BigInt(map.speed) << 18n;
    top |= BigInt(map.colorCount) << 20n;
    top |= BigInt(map.bgTransparent ? 1 : 0) << 23n;
    top |= BigInt(map.bgScalar) << 24n;

    id |= BigInt(top) << (32n * 7n);

    return id;
};

const getMap = (id: bigint): OnchainColorMap => {
    const colors: OnchainColor[] = [];

    for (let i = 0n; i < 7n; i++) {
        const color: OnchainColor = {
            empty: ((id >> (i * 32n + 31n)) & 0x1n) === 0n,
            domain: Number((id >> (i * 32n + 24n)) & 0x7fn),
            r: Number((id >> (i * 32n + 16n)) & 0xffn),
            g: Number((id >> (i * 32n + 8n)) & 0xffn),
            b: Number((id >> (i * 32n)) & 0xffn),
        };

        colors.push(color);
    }

    const colorOffset = 224n;

    return {
        x: Number((id >> colorOffset) & 0x1ffn),
        y: Number((id >> (colorOffset + 9n)) & 0x1ffn),
        speed: Number((id >> (colorOffset + 18n)) & 0x3n),
        colorCount: Number((id >> (colorOffset + 20n)) & 0x7n),
        bgTransparent: ((id >> (colorOffset + 23n)) & 0x1n) === 1n,
        bgScalar: Number((id >> (colorOffset + 24n)) & 0xffn),
        colors,
    };
};

export { getId, getMap };
