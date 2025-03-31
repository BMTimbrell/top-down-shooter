import { gameInfoAtom } from "../../store";
import { useAtom } from 'jotai';
import styles from './PlayerInfo.module.css';

export default function PlayerInfo() {
    const [gameInfo] = useAtom(gameInfoAtom);
    const playerInfo = gameInfo.playerInfo;

    return (
        <div className={styles.container}>
            <div className={styles["ability-container"]}>
                <div style={{ '--cd-percent': `${playerInfo.dashCd * 100}%` }} className={styles.dash}>
                    <img src="./sprites/dash-icon-4.png" className={styles["dash-icon"]} style={{ opacity: playerInfo.dashCd > 0.98 ? 1 : 0.5 }} />
                </div>
            </div>
            <div className={styles["gun-container"]}></div>
        </div>
    );
}