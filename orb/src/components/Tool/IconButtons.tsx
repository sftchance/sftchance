import {
    faLink,
    faBezierCurve,
    faPlay,
    faPause,
    faRefresh,
    faShuffle,
    faDownload,
    faRedo,
    faUndo,
} from '@fortawesome/free-solid-svg-icons';

import { toPng } from 'html-to-image';

import { Colors } from '../../types';

import { IconButton } from './';

const IconButtons = ({
    previewRef,
    paused,
    colors,
    perfect,
    onReset,
    onShuffle,
    onUndo,
    onRedo,
    onPause,
    onWand,
}: {
    previewRef: React.RefObject<HTMLDivElement>;
    paused: boolean;
    colors: Colors;
    perfect: boolean;
    onReset: () => void;
    onShuffle: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onPause: () => void;
    onWand: () => void;
}) => {
    return (
        <div className="icon-buttons">
            <IconButton className="reset" icon={faRefresh} onClick={onReset} />

            <IconButton className="shuffle" icon={faShuffle} onClick={onShuffle} />

            <div className="timespace">
                <IconButton
                    className={`undo ${colors.changes.length === 0 ? 'hidden-display' : ''}`}
                    icon={faUndo}
                    onClick={onUndo}
                />

                <IconButton
                    className={`redo ${colors.undos.length === 0 ? 'hidden-display' : ''}`}
                    icon={faRedo}
                    onClick={onRedo}
                />
            </div>

            <IconButton
                className={`wand ${perfect === true ? 'hidden-display' : ''}`}
                icon={faBezierCurve}
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
                            a.download = `orb-${colors.colors.map((color) => color.hex).join('-')}.png`;

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
