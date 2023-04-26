import { faClipboard, faRefresh, faShuffle, faSave } from '@fortawesome/free-solid-svg-icons';

import { IconButton } from './';

const IconButtons = ({ onReset, onShuffle }: { onReset: () => void; onShuffle: () => void }) => {
    return (
        <>
            <IconButton className="reset" icon={faRefresh} onClick={onReset} />

            <IconButton className="shuffle" icon={faShuffle} onClick={onShuffle} />

            <IconButton
                className="copy"
                icon={faClipboard}
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                }}
            />

            <IconButton
                className="save"
                icon={faSave}
                onClick={() => {
                    console.log('save image');
                }}
            />
        </>
    );
};

export { IconButtons };
