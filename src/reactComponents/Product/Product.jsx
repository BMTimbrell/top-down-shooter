import PrimaryButton from '../Button/PrimaryButton';
import styles from './Product.module.css';

export default function Product({ button, children }) {

    return (
        <div className={styles.container}>

            {children}

            <PrimaryButton onClick={button.onClick} disabled={button.disabled}>
                {button.name}
            </PrimaryButton>
        </div>
    );
}

export function ProductHeader({ children }) {
    return (
        <div className={styles.header}>
            {children}
        </div>
    );
}
