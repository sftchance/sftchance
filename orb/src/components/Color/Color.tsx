import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

import { Color as ColorType } from '../../types';

const Color = ({
    index,
    color,
    onChange,
    onToggle,
}: {
    index: number;
    color: ColorType;
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggle: (index: number) => void;
}) => {
    const isDark = (hex: string, threshold = 0.3): boolean => {
        hex = hex.replace('#', '');

        const int = parseInt(hex, 16);

        const r = (int >> 16) & 255;
        const g = (int >> 8) & 255;
        const b = int & 255;

        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        return luminance < threshold;
    };

    return (
        <div
            className="color"
            style={{ background: color.hex }}
            onClick={() => {
                navigator.clipboard.writeText(color.hex.toUpperCase());
            }}
        >
            <div className={isDark(color.hex) ? 'light' : 'dark'}>
                <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => {
                        onChange(index, e);
                    }}
                />

                <button className="toggle" onClick={() => onToggle(index)}>
                    {color.locked ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faLockOpen} />}
                </button>
            </div>
        </div>
    );
};

export { Color };
