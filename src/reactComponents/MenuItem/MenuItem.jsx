import PrimaryButton from '../Button/PrimaryButton';
import styles from './MenuItem.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function MenuItem({ button, children }) {

    return (
        <div className={styles.container}>

            {children}

            <PrimaryButton onClick={button.onClick} disabled={button.disabled}>
                {button.name} {button.icon && <FontAwesomeIcon icon={faClock} />}
            </PrimaryButton>
        </div>
    );
}

export function MenuItemHeader({ children }) {
    return (
        <div className={styles.header}>
            {children}
        </div>
    );
}
