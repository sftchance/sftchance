interface Color {
    hex: string;
    position: number;
    invalid?: boolean | undefined;
    hidden?: boolean | undefined;
    locked?: boolean | undefined;
}

export type { Color };
