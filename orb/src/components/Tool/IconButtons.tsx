import {
    faClipboard,
    faPlay,
    faPause,
    faRefresh,
    faShuffle,
    faSave,
    faDownload,
} from '@fortawesome/free-solid-svg-icons';

import { toPng } from 'html-to-image';

import { Color } from '../../types';

import { IconButton } from './';

const IconButtons = ({
    previewRef,
    paused,
    colors,
    onReset,
    onPause,
    onShuffle,
}: {
    previewRef: React.RefObject<HTMLDivElement>;
    paused: boolean;
    colors: Color[];
    onReset: () => void;
    onPause: () => void;
    onShuffle: () => void;
}) => {
    return (
        <>
            <IconButton className="reset" icon={faRefresh} onClick={onReset} />

            <IconButton className="shuffle" icon={faShuffle} onClick={onShuffle} />

            <IconButton className="pause" icon={paused ? faPlay : faPause} onClick={onPause} />

            <IconButton
                className="copy"
                icon={faClipboard}
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                }}
            />

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
        </>
    );
};

export { IconButtons };
