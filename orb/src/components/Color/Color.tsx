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
    const isDark = (hex: string) => {
        const [r, g, b] = hex.match(/\w\w/g)?.map((x) => parseInt(x, 16)) || [];

        return r * 0.299 + g * 0.587 + b * 0.114 > 186;
    };

    return (
        <div
            className="color"
            style={{ background: color.hex }}
            onClick={() => {
                navigator.clipboard.writeText(color.hex.toUpperCase());
            }}
        >
            <div className={isDark(color.hex) ? 'dark' : 'light'}>
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
