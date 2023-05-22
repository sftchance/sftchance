interface Color {
    hex: string;
    position: number;
    invalid?: boolean | undefined;
    hidden?: boolean | undefined;
    hiddenOnScale?: boolean | undefined;
    locked?: boolean | undefined;
}

interface Colors {
    colors: Color[];
    changes: Color[][];
    undos: Color[][];
}

export type { Color, Colors };
