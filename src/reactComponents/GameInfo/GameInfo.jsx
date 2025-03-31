import { gameInfoAtom } from "../../store";
import { useAtom } from 'jotai';
import styles from './GameInfo.module.css';

export default function GameInfo() {
    const [gameInfo] = useAtom(gameInfoAtom);
    const hearts = [];
    const time = gameInfo.time === 0 ? "Morning" : 
        gameInfo.time === 1 ? "Afternoon" : 
        gameInfo.time === 2 ? "Evening" : "Night";

    let healthCount = gameInfo.hp.health;
    for (let i = 0; i < gameInfo.hp.maxHealth; i++) {
        if (healthCount > 0) hearts.push(1);
        else hearts.push(0);
        healthCount--;
    }

    return (
        <div className={styles.container}>
            <div className={styles.time}>
                <div>Day {gameInfo.day}</div>
                <div>{time}</div>
            </div>

            <div className={styles.hearts}>
                {hearts.map((e, index) => {
                    if (e === 1) return <img key={index} src="./sprites/heart2.png" />;
                    else return <img key={index} src="./sprites/empty-heart2.png" />;
                })}
            </div>
            
            <div className={styles.money}>
                <img src="./sprites/coin2.png" />
                {gameInfo.gold}
            </div>
        </div>
    );
}