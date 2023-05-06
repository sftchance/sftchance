import {
    faLink,
    faMoon,
    faDownload,
    faSun,
    faRedo,
    faUndo,
    faScissors,
    faFileImport,
} from '@fortawesome/free-solid-svg-icons';

import { toPng } from 'html-to-image';

import { IconButtonsProps } from '../../types';

import { IconButton } from './';

const IconButtons = ({ importRef, previewRef, light, colors, onUndo, onRedo, onLight }: IconButtonsProps) => {
    const onSave = ({ transparent }: { transparent: boolean }) => {
        previewRef.current?.style.setProperty('animation', 'none');
        previewRef.current?.style.setProperty('transition', 'none');
        previewRef.current?.style.setProperty('background', transparent ? 'transparent' : light ? '#fff' : '#000');

        previewRef.current?.parentElement?.classList.add('paused');

        toPng(previewRef.current as HTMLElement)
            .then((dataUrl) => {
                const a = document.createElement('a');

                a.href = dataUrl;
                a.download = `orb-${transparent ? 'transparent' : light ? 'light' : 'dark'}-${colors.colors
                    .map((color) => color.hex)
                    .join('-')}.png`;

                a.click();

                previewRef.current?.parentElement?.classList.remove('paused');

                previewRef.current?.style.setProperty('animation', 'float 5s ease-in-out infinite');
                previewRef.current?.style.setProperty('transition', 'all 0.3s ease-in-out');
                previewRef.current?.style.setProperty('background', 'transparent');
            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    };

    return (
        <div className="icon-buttons">
            <div className="timespace">
                <IconButton className="light" icon={light ? faMoon : faSun} onClick={onLight} />

                <IconButton
                    className="import"
                    icon={faFileImport}
                    onClick={() => {
                        importRef.current?.click();
                    }}
                />

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
                className="copy"
                icon={faLink}
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                }}
            />

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
        </div>
    );
};

export { IconButtons };
