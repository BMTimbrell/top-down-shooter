import styles from './Modal.module.css';

export default function Modal({ children, ref }) {
    return (
        <div ref={ref} className={styles.modal}>
            {children}
        </div>
    );
}