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
    colorCount?: number;
    bgTransparent: boolean;
    bgScalar: number;
    colors: Color[];
};
