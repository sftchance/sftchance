import { Color as ColorType } from '../../types';

import { Color } from './Color';

const Colors = ({
    colors,
    onChange,
    onToggle,
}: {
    colors: ColorType[];
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggle: (index: number) => void;
}) => {
    return (
        <div className="colors">
            {colors.map((color, index) => (
                <Color key={index} index={index} color={color} onChange={onChange} onToggle={() => onToggle(index)} />
            ))}
        </div>
    );
};

export { Colors };
