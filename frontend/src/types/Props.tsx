import { IconProp } from '@fortawesome/fontawesome-svg-core';

import { Color, Colors } from './Color';

export type ColorProps = {
    index: number;
    color: Color;
    scaled: boolean;
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onHide: (index: number) => void;
    onToggle: (index: number) => void;
    onScaled: (index: number) => void;
};

export type ColorsProps = {
    colors: Color[];
    scaled: boolean[];
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onHide: (index: number) => void;
    onToggle: (index: number) => void;
    onScaled: (index: number) => void;
};

export type DropperProps = {
    importRef: React.RefObject<HTMLInputElement>;
    dragging: boolean;
    onDrag: (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => void;
    onDrop: (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLFormElement | HTMLDivElement>) => void;
};

export type FooterIconButtonsProps = {
    paused: boolean;
    perfect: boolean;
    id: bigint;
    onPause: () => void;
    onReset: () => void;
    onShuffle: () => void;
    onWand: () => void;
};

export type IconButtonProps = {
    icon: IconProp;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
};

export type IconButtonsProps = {
    importRef: React.RefObject<HTMLInputElement>;
    previewRef: React.RefObject<HTMLDivElement>;
    light: boolean;
    colors: Colors;
    onUndo: () => void;
    onRedo: () => void;
    onLight: () => void;
};

export type MintButtonProps = {
    id: bigint;
    onMint: () => void;
};

export type PreviewProps = {
    previewRef: React.RefObject<HTMLDivElement>;
    colors: Color[];
    paused: boolean;
};

export type useDropperProps = {
    onDrop: (colors: string[]) => void;
};

export type useWandProps = {
    colors: Color[];
};
