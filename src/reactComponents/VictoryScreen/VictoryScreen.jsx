
import Modal from '../Modal/Modal';
import { victoryScreenAtom } from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';
import styles from './VictoryScreen.module.css';

export default function VictoryScreen() {
    const [victoryScreen, setVictoryScreen] = useAtom(victoryScreenAtom);
    const rewards = victoryScreen.rewards;

    return (
        <Modal color={"ui-transparent"}>
            <div className={styles.container}>
                <h1>Mission Complete</h1>
                <h2>Rewards</h2>
                {rewards.map((reward, index) => (
                    <div className={styles.rewards} key={index}>
                        {index === 0 ? <img width="27" src="./sprites/coin2.png" /> : ""}
                        {reward}
                    </div>
                ))}
            </div>
            
            <PrimaryButton onClick={victoryScreen.onClick}>
                Continue
            </PrimaryButton>

        </Modal>
    );
}