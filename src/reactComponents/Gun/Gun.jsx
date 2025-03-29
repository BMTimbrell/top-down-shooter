import styles from './Gun.module.css';
import Popup from '../Popup/Popup';
import { useState } from 'react';

export default function Gun({ name, spritePos, damage, firingInterval, animSpeed }) {
    const [showPopup, setShowPopup] = useState(false);
    const [popupPos, setPopupPos] = useState({
        x: 0,
        y: 0
    });

    const fRateCalc = animSpeed - firingInterval;
    const fRate = fRateCalc >= 15 ? "Fast" : fRateCalc >= 5 ? "Mid" : "Slow"

    const showInfo = e => {
        setShowPopup(true);
        const parent = e.target.parentElement;
        const offsetTop = parent.getBoundingClientRect().y - 250;
        const offsetLeft = parent.getBoundingClientRect().x;

        setPopupPos(prev => ({ 
            ...prev,
            x: e.clientX - offsetLeft,
            y: e.clientY - offsetTop
        }));
    };

    return (
        <>
            <div
                onMouseMove={showInfo}
                onMouseLeave={() => setShowPopup(false)} 
                style={{ backgroundPosition: `${spritePos.x}px ${spritePos.y}px` }} 
                className={styles.gun}
            >
            </div>
            {showPopup && 
                <Popup pos={popupPos}>
                    <div className={styles["stat-container"]}>
                        <h3>
                            {name}
                        </h3>
                        <div className={styles["gun-stats"]}>
                            <div>damage: <span>{damage}</span></div>
                            <div>fire rate: <span>{fRate}</span></div>
                        </div>
                    </div>
                </Popup>
            }
        </>
    );
}