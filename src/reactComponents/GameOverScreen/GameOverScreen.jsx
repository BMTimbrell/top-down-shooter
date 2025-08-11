import { gameOverScreenAtom } from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';
import styles from './GameOverScreen.module.css';
import ButtonContainer from '../Button/ButtonContainer';

export default function GameOverScreen() {
    const [gameOverScreen] = useAtom(gameOverScreenAtom);
    const buttons = gameOverScreen.buttons;

    return (
        <div className={styles.container}>
            <h1>Game Over</h1>
            
            <ButtonContainer>
                {buttons.map((button, index) => (
                    <PrimaryButton key={index} onClick={button.onClick}>
                        {button.text}
                    </PrimaryButton>
                ))}
            </ButtonContainer>

        </div>
    );
}