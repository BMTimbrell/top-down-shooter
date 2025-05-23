import styles from './Modal.module.css';

export default function Modal({ children, ref, color }) {
    return (
        <div ref={ref} className={`${styles.modal} ${styles[color]}`}>
            {children}
        </div>
    );
}