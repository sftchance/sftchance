import {
    faLink,
    faWandMagic,
    faPlay,
    faPause,
    faRefresh,
    faShuffle,
    faDownload,
} from '@fortawesome/free-solid-svg-icons';

import { toPng } from 'html-to-image';

import { Color } from '../../types';

import { IconButton } from './';

const IconButtons = ({
    previewRef,
    paused,
    colors,
    perfect,
    onReset,
    onPause,
    onShuffle,
    onWand,
}: {
    previewRef: React.RefObject<HTMLDivElement>;
    paused: boolean;
    colors: Color[];
    perfect: boolean;
    onReset: () => void;
    onPause: () => void;
    onShuffle: () => void;
    onWand: () => void;
}) => {
    return (
        <div className="icon-buttons">
            <IconButton className="reset" icon={faRefresh} onClick={onReset} />

            <IconButton className="shuffle" icon={faShuffle} onClick={onShuffle} />

            <IconButton
                className={`wand ${perfect === true ? 'hidden-opacity' : ''}`}
                icon={faWandMagic}
                onClick={onWand}
            />

            <IconButton className="pause" icon={paused ? faPlay : faPause} onClick={onPause} />

            <IconButton
                className="save"
                icon={faDownload}
                onClick={() => {
                    toPng(previewRef.current as HTMLElement)
                        .then((dataUrl) => {
                            const a = document.createElement('a');

                            a.href = dataUrl;
                            a.download = `orb-${colors.map((color) => color.hex).join('-')}.png`;

                            a.click();
                        })
                        .catch((error) => {
                            console.error('oops, something went wrong!', error);
                        });
                }}
            />

            <IconButton
                className="copy"
                icon={faLink}
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                }}
            />
        </div>
    );
};

export { IconButtons };
