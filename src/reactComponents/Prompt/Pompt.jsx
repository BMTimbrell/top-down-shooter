import { promptAtom } from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import styles from './Prompt.module.css';
import ButtonContainer from '../Button/ButtonContainer';

export default function Prompt() {
    const [prompt] = useAtom(promptAtom);
    const text = prompt.text;

    return (
        <div className={styles.container}>
            <div>{text}</div>
           <ButtonContainer>
                <PrimaryButton onClick={prompt.handleYes}>
                    Yes <FontAwesomeIcon icon={faClock} />
                </PrimaryButton>
                <PrimaryButton onClick={prompt.handleNo}>
                    No
                </PrimaryButton>
            </ButtonContainer>
        </div>
    );
}