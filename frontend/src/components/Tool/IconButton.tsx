import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IconButtonProps } from '../../types';

const IconButton = ({ className, icon, onClick }: IconButtonProps) => {
    return (
        <button className={`icon-button ${className}`} onClick={onClick}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
};

export { IconButton };
