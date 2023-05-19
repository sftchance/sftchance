export type Color = {
    empty: boolean;
    domain: number;
    r: number;
    g: number;
    b: number;
};

export type ColorMap = {
    x: number;
    y: number;
    speed: number;
    colorCount: number;
    bgTransparent: boolean;
    bgScalar: number;
    colors: Color[];
};

export type MaxSupply = {
    supply: bigint;
    power: bigint;
}

export type Price = {
    base: bigint;
    decimals: bigint;
}