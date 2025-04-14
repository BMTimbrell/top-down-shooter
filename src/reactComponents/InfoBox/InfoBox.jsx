import styles from './InfoBox.module.css';
import Modal from '../Modal/Modal';
import { infoBoxAtom } from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';

export default function InfoBox() {
    const [infoBox, setInfoBox] = useAtom(infoBoxAtom);

    return (
        <Modal>
            <div className={styles["info-box"]}>
                {infoBox.text}
            </div>
            
            <PrimaryButton onClick={() => {
                setInfoBox(prev => ({
                    ...prev,
                    visible: false
                }));
            }}>
                Continue
            </PrimaryButton>

        </Modal>
    );
}