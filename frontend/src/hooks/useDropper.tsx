import { useRef, useState } from 'react';

import { useDropperProps } from '../types';

import { getGradientColors } from '../utils';

const useDropper = ({ onDrop }: useDropperProps) => {
    const ref = useRef<HTMLInputElement>(null);

    const [dragging, setDragging] = useState(false);

    const onDrag = (e: React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragging(true);
        } else if (e.type === 'dragleave') {
            setDragging(false);
        }
    };

    const _onDrop = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLFormElement | HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setDragging(false);

        const files =
            (e as React.ChangeEvent<HTMLInputElement>).target?.files || (e as React.DragEvent).dataTransfer?.files;

        if (files && files[0]) {
            const reader = new FileReader();

            reader.onload = async (event) => {
                onDrop(await getGradientColors(event.target?.result as string));
            };

            reader.readAsDataURL(files[0]);
        }
    };

    return { ref, dragging, onDrag, onDrop: _onDrop };
};

export { useDropper };
