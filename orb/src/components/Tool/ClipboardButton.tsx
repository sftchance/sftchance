import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

const ClipboardButton = ({
    onClick,
}: {
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
    return (
        <button className="copy" onClick={onClick}>
            <FontAwesomeIcon icon={faClipboard} />
        </button>
    );
};

export { ClipboardButton };
