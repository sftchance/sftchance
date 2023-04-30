import { faLink, faPlay, faPause, faDownload, faRedo, faUndo, faScissors } from '@fortawesome/free-solid-svg-icons';

import { toPng } from 'html-to-image';

import { Colors } from '../../types';

import { IconButton } from './';

const IconButtons = ({
    previewRef,
    paused,
    colors,
    onUndo,
    onRedo,
    onPause,
}: {
    previewRef: React.RefObject<HTMLDivElement>;
    paused: boolean;
    colors: Colors;
    onUndo: () => void;
    onRedo: () => void;
    onPause: () => void;
}) => {
    const onSave = ({ transparent }: { transparent: boolean }) => {
        if (transparent === false) previewRef.current?.style.setProperty('background-color', 'black');
        previewRef.current?.style.setProperty('animation', 'none');

        toPng(previewRef.current as HTMLElement)
            .then((dataUrl) => {
                const a = document.createElement('a');

                a.href = dataUrl;
                a.download = `orb-${colors.colors.map((color) => color.hex).join('-')}.png`;

                a.click();

                previewRef.current?.style.setProperty('background-color', 'transparent');
                previewRef.current?.style.setProperty('animation', 'float 5s ease-in-out infinite');
            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    };

    return (
        <div className="icon-buttons">
            <div className="timespace">
                <IconButton className="pause" icon={paused ? faPlay : faPause} onClick={onPause} />

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
                className="cut"
                icon={faScissors}
                onClick={() => {
                    onSave({ transparent: true });
                }}
            />

            <IconButton
                className="save"
                icon={faDownload}
                onClick={() => {
                    onSave({ transparent: false });
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
