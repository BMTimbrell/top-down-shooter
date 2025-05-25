import Popup from './reactComponents/Popup/Popup';
import DialogueBox from './reactComponents/DialogueBox/DialogueBox';
import MainMenu from './reactComponents/MainMenu/MainMenu';
import GameInfo from './reactComponents/GameInfo/GameInfo';
import InfoBox from './reactComponents/InfoBox/InfoBox';
import VictoryScreen from './reactComponents/VictoryScreen/VictoryScreen';
import Prompt from './reactComponents/Prompt/Pompt';
import { 
    dialogueAtom, 
    popupAtom, 
    menuAtom, 
    infoBoxAtom, 
    victoryScreenAtom,
    promptAtom 
} from './store';
import { useAtom } from 'jotai';

export default function ReactUI() {
    const [popup] = useAtom(popupAtom);
    const [dialogue, setDialogue] = useAtom(dialogueAtom);
    const [menu] = useAtom(menuAtom);
    const [infoBox] = useAtom(infoBoxAtom);
    const [victoryScreen] = useAtom(victoryScreenAtom);
    const [prompt] = useAtom(promptAtom);

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

             {infoBox.visible &&
                <InfoBox />
             }

             {victoryScreen.visible &&
                <VictoryScreen />
             }

             {prompt.visible &&
                <Prompt />
             }

             {menu.visible && 
                <MainMenu
                    buttons={menu.buttons}
                />
            }
        </>
    );
}