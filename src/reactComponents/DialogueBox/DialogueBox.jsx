import styles from './DialogueBox.module.css';
import { useState, useEffect } from 'react';

export default function DialogueBox({ text, skipDialogue, index, setDialogue }) {
    const [visibleText, setVisibleText] = useState("");

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (visibleText.length < text[index].length) {
                setVisibleText(prev => prev + text[index].charAt(prev.length));
            } else {
                setDialogue(prev => ({
                    ...prev,
                    skip: true
                }));
                clearInterval(intervalId);
            }
        }, 25);

        return () => {
            clearInterval(intervalId);
        }
    }, [visibleText]);

    useEffect(() => {
        setVisibleText("");
    }, [index]);

    return (
        <div className={styles.container}>
            {skipDialogue ?
                text[index] :
                visibleText
            }
            {index < text.length - 1 && <div className={styles.arrow}>&gt;</div>}
        </div>
    );
}