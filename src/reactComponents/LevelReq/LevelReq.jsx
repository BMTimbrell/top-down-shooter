import { playerInfoAtom } from "../../store";
import { useAtom } from 'jotai';
import styles from "./LevelReq.module.css";

export default function LevelReq({ type, level, children }) {
    const [playerInfo] = useAtom(playerInfoAtom);
    const playerLevel = playerInfo.data.exp[type].level;

    return (
        <div className={playerLevel < level ? styles.red : ""}>
            { children }
        </div>
    );
}