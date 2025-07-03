import styles from './ExpBar.module.css';
import { useState } from 'react';

export default function ExpBar({ stat }) {
    const statPercent = Math.round((stat.exp / stat.maxExp) * 100);
    const [showFraction, setShowFraction] = useState(false);
    const hoverText = stat.level < 3 ? `${stat.exp}/${stat.maxExp}` : "Max";

    return (
        <div 
            className={styles["exp-bar"]} 
            style={{ '--stat-percent': `${statPercent}%` }}
            onMouseEnter={() => setShowFraction(true)}
            onMouseLeave={() => setShowFraction(false)}
        >
            {showFraction ? hoverText : `Lvl ${stat.level}`}
        </div>
    );
}