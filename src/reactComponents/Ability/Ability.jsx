import styles from "./Ability.module.css";

export default function Ability({ aKey, imgSrc, cooldown}) {
    return (
        <div style={{ '--cd-percent': `${cooldown * 100}%` }} className={styles.ability}>
            {aKey && <div className={styles.key}>{aKey}</div>}
            <img
                src={imgSrc}
                className={styles["ability-icon"]}
                style={{ opacity: cooldown === 1 ? 1 : 0.5 }}
            />
        </div>
    );
}