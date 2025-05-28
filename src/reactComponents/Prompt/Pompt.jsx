import { promptAtom } from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './Prompt.module.css';

export default function Prompt() {
    const [prompt] = useAtom(promptAtom);
    const text = prompt.text;

    return (
        <div className={styles.container}>
            <div>{text}</div>
            <div className={styles["button-container"]}>
                <PrimaryButton onClick={prompt.handleYes}>
                    Yes <FontAwesomeIcon icon={faClock} />
                </PrimaryButton>
                <PrimaryButton onClick={prompt.handleNo}>
                    No
                </PrimaryButton>
            </div>
        </div>
    );
}