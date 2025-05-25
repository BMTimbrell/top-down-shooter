import {
    store,
    promptAtom
} from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function Prompt() {
    const [prompt, setPrompt] = useAtom(promptAtom);
    const text = prompt.text;

    return (
        <div>
            {text}
            <div>
                <PrimaryButton onClick={prompt.onClick}>
                    Yes <FontAwesomeIcon icon={faClock} />
                </PrimaryButton>
                <PrimaryButton onClick={
                    () => setPrompt(prev => ({
                        ...prev,
                        visible: false
                    }))
                }>
                    No
                </PrimaryButton>
            </div>
        </div>
    );
}