import { faBezierCurve, faPlay, faPause, faRefresh, faShuffle } from '@fortawesome/free-solid-svg-icons';

import { FooterIconButtonsProps } from '../../types';

import { IconButton } from './';

const FooterIconButtons = ({ paused, perfect, onPause, onReset, onShuffle, onWand }: FooterIconButtonsProps) => {
    return (
        <div className="icon-buttons">
            <IconButton className="pause" icon={paused ? faPlay : faPause} onClick={onPause} />

            <IconButton className="reset" icon={faRefresh} onClick={onReset} />

            <IconButton className="shuffle" icon={faShuffle} onClick={onShuffle} />

            <IconButton
                className={`wand ${perfect === true ? 'hidden-display' : ''}`}
                icon={faBezierCurve}
                onClick={onWand}
            />
        </div>
    );
};

export { FooterIconButtons };
