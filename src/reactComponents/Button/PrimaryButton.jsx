import styles from './PrimaryButton.module.css';

export default function PrimaryButton({ children, onClick, disabled }) {
    return (
        <button className={styles.button} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}