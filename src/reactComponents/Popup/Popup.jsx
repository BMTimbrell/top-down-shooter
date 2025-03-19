import styles from './Popup.module.css';
import { useEffect, useState } from 'react';

export default function Popup({ text }) {
    const rootStyles = getComputedStyle(document.documentElement);
    const [pos, setPos] = useState({
        x: parseInt(rootStyles.getPropertyValue("--popup-x")),
        y: parseInt(rootStyles.getPropertyValue("--popup-y"))
    });

    const observer = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.type === "attributes") {
                setPos(prev => ({
                    ...prev,
                    x: parseInt(rootStyles.getPropertyValue("--popup-x")),
                    y: parseInt(rootStyles.getPropertyValue("--popup-y"))
                }));
            }
        }
    });
    
    useEffect(() => {        
        observer.observe(document.documentElement, { attributes: true })

        return () => {
            observer.disconnect();
        }
    }, [pos]);

    return (
        <div style={{ top: pos.y, left: pos.x }} className={styles.popup}>
            <div className={styles.header}>
                <div className={styles.key}>{text.key}</div>
                <div className={styles.action}>{text.action}</div>
            </div>
            <div className={styles.content}>{text.name}</div>
        </div>
    );
}