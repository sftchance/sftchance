import { ColorsProps } from '../../types';

import { Color } from './Color';

const Colors = ({ colors, scaled, onChange, onHide, onToggle, onScaled }: ColorsProps) => {
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
