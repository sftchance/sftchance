import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClose,
    faEyeSlash,
    faTableCells,
    faLock,
    faLockOpen,
    faPlus,
    faWarning,
} from '@fortawesome/free-solid-svg-icons';

import { ColorProps } from '../../types';

import { getScaleColors, isDark } from '../../utils';

const Color = ({ index, color, scaled, onChange, onHide, onToggle, onScaled }: ColorProps) => {
    const scale = getScaleColors(color.hex);

    return (
        <div
            className={`color ${color.hidden ? 'hidden' : ''} ${scaled ? 'scaled' : ''}`}
            style={
                !color.invalid
                    ? {
                          backgroundColor: color.hex,
                          zIndex: scaled ? 6 : 0,
                      }
                    : {}
            }
            onClick={() => {
                navigator.clipboard.writeText(color.hex.toUpperCase());
            }}
        >
            <div className={`scale-container ${scaled ? 'visible' : ''}`}>
                {scale.map((color) => (
                    <div
                        key={`${index}-${color}`}
                        className="segment"
                        style={{
                            backgroundColor: color,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();

                            onChange(index, {
                                target: {
                                    value: color,
                                },
                            } as React.ChangeEvent<HTMLInputElement>);

                            onScaled(index);
                        }}
                    />
                ))}
            </div>

            <div className={isDark(color.hex) ? 'light' : 'dark'}>
                <button className={`invalid ${!color.invalid ? 'hidden-opacity' : ''}`} disabled></button>

                <button
                    className={`invalid ${color.invalid ? 'visible' : !color.invalid ? 'hidden-opacity' : ''}`}
                    disabled
                >
                    <FontAwesomeIcon icon={faWarning} />
                </button>

                <button className={`hiding ${color.hidden ? 'visible' : ''}`} disabled>
                    <FontAwesomeIcon icon={faEyeSlash} />
                </button>

                <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();

                        onChange(index, e);
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />

                <button
                    className={`scale ${scale.length === 0 ? 'hidden-opacity' : ''}`}
                    onClick={() => {
                        onScaled(index);
                    }}
                    disabled={scale.length === 0}
                >
                    <FontAwesomeIcon icon={faTableCells} />
                </button>

                <button className={`toggle ${color.locked ? 'visible' : ''}`} onClick={() => onToggle(index)}>
                    {color.locked ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faLockOpen} />}
                </button>

                <button className="hide" onClick={() => onHide(index)}>
                    <FontAwesomeIcon icon={color.hidden ? faPlus : faClose} />
                </button>
            </div>
        </div>
    );
};

export { Color };
