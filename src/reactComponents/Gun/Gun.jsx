import styles from './Gun.module.css';
import Popup from '../Popup/Popup';
import { useState } from 'react';

export default function Gun({ name, spritePos, damage, firingInterval, animSpeed, parentPos }) {
    const [showPopup, setShowPopup] = useState(false);
    const [popupPos, setPopupPos] = useState({
        x: 0,
        y: 0
    });

    const fRateCalc = animSpeed - firingInterval;
    const fRate = fRateCalc >= 15 ? "Fast" : fRateCalc >= 5 ? "Mid" : "Slow"

    const showInfo = e => {
        setShowPopup(true);

        const offsetTop = parentPos.y;
        const offsetLeft = parentPos.x;

        // stop popup from going off screen
        const y = (e.clientY - offsetTop) + (
            e.clientY > document.documentElement.getBoundingClientRect().height - 100 ? -100 : 0
        ); 

        setPopupPos(prev => ({ 
            ...prev,
            x: e.clientX - offsetLeft,
            y: y
        }));

    };

    return (
        <>
            <div
                onMouseMove={parentPos ? showInfo : undefined}
                onMouseLeave={parentPos ? () => setShowPopup(false) : undefined} 
                style={{ 
                    "--sprite-pos-x": `${spritePos.x}px`, 
                    "--sprite-pos-y": `${spritePos.y}px` 
                }} 
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