import Popup from './reactComponents/Popup/Popup';
import DialogueBox from './reactComponents/DialogueBox/DialogueBox';
import MainMenu from './reactComponents/MainMenu/MainMenu';
import GameInfo from './reactComponents/GameInfo/GameInfo';
import PlayerInfo from './reactComponents/PlayerInfo/PlayerInfo';
import { dialogueAtom, popupAtom, menuAtom } from './store';
import { useAtom } from 'jotai';

export default function ReactUI() {
    const [popup] = useAtom(popupAtom);
    const [dialogue, setDialogue] = useAtom(dialogueAtom);
    const [menu] = useAtom(menuAtom);

    return (
        <>
            <GameInfo />

            {popup.visible && <Popup text={popup.text} pos={popup.pos} />}

            {dialogue.visible && 
                <DialogueBox
                    text={dialogue.text}
                    index={dialogue.index}
                    skipDialogue={dialogue.skip}
                    setDialogue={setDialogue}
                />
             }

             {menu.visible && 
                <MainMenu
                    buttons={menu.buttons}
                />
            }

            <PlayerInfo />
        </>
    );
}