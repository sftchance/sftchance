import { faBezierCurve, faMoon, faRefresh, faShuffle, faSun } from '@fortawesome/free-solid-svg-icons';

import { IconButton } from './';

const FooterIconButtons = ({
    perfect,
    light,
    onReset,
    onShuffle,
    onWand,
    onLight,
}: {
    perfect: boolean;
    light: boolean;
    onReset: () => void;
    onShuffle: () => void;
    onWand: () => void;
    onLight: () => void;
}) => {
    return (
        <div className="icon-buttons">
            <IconButton className="reset" icon={faRefresh} onClick={onReset} />

            <IconButton className="shuffle" icon={faShuffle} onClick={onShuffle} />

            <IconButton
                className={`wand ${perfect === true ? 'hidden-display' : ''}`}
                icon={faBezierCurve}
                onClick={onWand}
            />

            <IconButton className="light" icon={light ? faMoon : faSun} onClick={onLight} />
        </div>
    );
};

export { FooterIconButtons };
