import PrimaryButton from '../Button/PrimaryButton';
import styles from './MenuItem.module.css';

export default function MenuItem({ button, children }) {

    return (
        <div className={styles.container}>

            {children}

            <PrimaryButton onClick={button.onClick} disabled={button.disabled}>
                {button.name}
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
