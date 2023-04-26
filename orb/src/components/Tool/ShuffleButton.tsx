import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

const ShuffleButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLButtonElement> }) => {
    return (
        <button className="shuffle" onClick={onClick}>
            <FontAwesomeIcon icon={faShuffle} />
        </button>
    );
};

export { ShuffleButton };
