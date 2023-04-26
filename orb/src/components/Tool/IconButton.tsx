import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconButton = ({
    className,
    icon,
    onClick,
}: {
    className?: string;
    icon: IconProp;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
    return (
        <button className={`${className}`} onClick={onClick}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
};

export { IconButton };
