import styles from './DialogueBox.module.css';
import { useState, useEffect } from 'react';

export default function DialogueBox({ text, dialogue, skipDialogue, index, setDialogue }) {
    const [visibleText, setVisibleText] = useState("");
    const rootStyles = getComputedStyle(document.documentElement);
    const pos = {
        x: parseInt(rootStyles.getPropertyValue("--dialogue-x")),
        y: parseInt(rootStyles.getPropertyValue("--dialogue-y"))
    };
    const width = parseInt(rootStyles.getPropertyValue("--dialogue-width"));

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
        <div className={styles.container} style={{ top: pos.y, left: pos.x, width }}>
            {skipDialogue ?
                text[index] :
                visibleText
            }
        </div>
    );
}