import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

import { Color } from '../types';

const Colors = ({
    colors,
    onChange,
    onToggle,
}: {
    colors: Color[];
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggle: (index: number) => void;
}) => {
    return (
        <div className="colors">
            {colors.map((color, index) => {
                return (
                    <div key={index} className="color" style={{ background: color.hex }}>
                        <div>
                            <input
                                type="text"
                                value={color.hex}
                                onChange={(e) => {
                                    onChange(index, e);
                                }}
                            />

                            <button onClick={() => onToggle(index)}>
                                {color.locked ? (
                                    <FontAwesomeIcon icon={faLock} />
                                ) : (
                                    <FontAwesomeIcon icon={faLockOpen} />
                                )}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export { Colors };
