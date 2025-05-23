
import Modal from '../Modal/Modal';
import { victoryScreenAtom } from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';

export default function VictoryScreen() {
    const [victoryScreen, setVictoryScreen] = useAtom(victoryScreenAtom);
    const rewards = victoryScreen.rewards;

    return (
        <Modal color={"ui-transparent"}>
            {rewards.map((reward, index) => (
                <div key={index}>
                    +{reward}
                </div>
            ))}
            
            <PrimaryButton onClick={() => {
                setVictoryScreen(prev => ({
                    ...prev,
                    visible: false
                }));
            }}>
                Continue
            </PrimaryButton>

        </Modal>
    );
}