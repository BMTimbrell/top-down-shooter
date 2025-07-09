import styles from './Popup.module.css';

export default function Popup({ text, pos, children }) {
    return (
        <div style={{ top: pos.y, left: pos.x }} className={styles.popup}>
            {text && 
                <div className={styles.header}>
                    <div className={styles.key}>{text.key}</div>
                    <div className={styles.action}>{text.action}</div>
                </div>
            }
            {text?.name && <div className={styles.content}>{text?.name}{children}</div>}
        </div>
    );
}