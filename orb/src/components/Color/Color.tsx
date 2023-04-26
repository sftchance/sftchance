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
    return (
        <div
            className="color"
            style={{ background: color.hex }}
            onClick={() => {
                navigator.clipboard.writeText(color.hex.toUpperCase());
            }}
        >
            <div>
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
