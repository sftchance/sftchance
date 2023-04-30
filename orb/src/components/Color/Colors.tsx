import { Color as ColorType } from '../../types';

import { Color } from './Color';

const Colors = ({
    colors,
    scaled,
    onChange,
    onHide,
    onToggle,
    onScaled,
}: {
    colors: ColorType[];
    scaled: boolean[];
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onHide: (index: number) => void;
    onToggle: (index: number) => void;
    onScaled: (index: number) => void;
}) => {
    return (
        <div className="colors">
            {colors.map((color, index) => (
                <Color
                    key={index}
                    index={index}
                    color={color}
                    scaled={scaled[index]}
                    onChange={onChange}
                    onHide={() => onHide(index)}
                    onToggle={() => onToggle(index)}
                    onScaled={onScaled}
                />
            ))}
        </div>
    );
};

export { Colors };
