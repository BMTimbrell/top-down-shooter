import Popup from './reactComponents/Popup/Popup';
import DialogueBox from './reactComponents/DialogueBox/DialogueBox';
import { dialogueAtom, isPopupVisibleAtom, popupTextAtom } from './store';
import { useAtom } from 'jotai';

export default function ReactUI() {
    const [isPopupVisible] = useAtom(isPopupVisibleAtom);
    const [popupText] = useAtom(popupTextAtom);
    const [dialogue, setDialogue] = useAtom(dialogueAtom);

    return (
        <>
            {isPopupVisible && <Popup text={popupText} />}
            {dialogue.visible && <DialogueBox
                dialogue={dialogue}
                text={dialogue.text}
                index={dialogue.index}
                skipDialogue={dialogue.skip}
                setDialogue={setDialogue}
             />}
        </>
    );
}