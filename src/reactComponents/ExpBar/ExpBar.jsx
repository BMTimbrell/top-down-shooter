import styles from './ExpBar.module.css';
import { useState } from 'react';

export default function ExpBar({ stat }) {
    const statPercent = Math.round((stat.exp / stat.maxExp) * 100);
    const [showFraction, setShowFraction] = useState(false);

    return (
        <div 
            className={styles["exp-bar"]} 
            style={{ background: `linear-gradient(to right, var(--green) ${statPercent}%, var(--ui-bg) ${statPercent}%)` }}
            onMouseEnter={() => setShowFraction(true)}
            onMouseLeave={() => setShowFraction(false)}
        >
            {showFraction ? `${stat.exp}/${stat.maxExp}` : `Lvl ${stat.level}`}
        </div>
    );
}