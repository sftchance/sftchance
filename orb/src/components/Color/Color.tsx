import chroma from 'chroma-js';

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

import { Color as ColorType } from '../../types';

const isDark = (hex: string, threshold = 0.3): boolean => {
    hex = hex.replace('#', '');

    const int = parseInt(hex, 16);

    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    return luminance < threshold;
};

const getScale = (color: string): string[] => {
    if (!chroma.valid(color)) {
        return [];
    }

    const scale = chroma
        .scale(['#000', color, '#fff'])
        .mode('lch')
        .padding([0.1, 0.1])
        .colors(15)
        .map((color) => chroma(color).hex());

    return scale;
};

const Color = ({
    index,
    color,
    scaled,
    onChange,
    onHide,
    onToggle,
    onScaled,
}: {
    index: number;
    color: ColorType;
    scaled: boolean;
    onChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
    onHide: (index: number) => void;
    onToggle: (index: number) => void;
    onScaled: (index: number) => void;
}) => {
    const scale = getScale(color.hex);

    return (
        <div
            className={`color ${color.hidden ? 'hidden' : ''}`}
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
