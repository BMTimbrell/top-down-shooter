import Popup from './reactComponents/Popup/Popup';
import DialogueBox from './reactComponents/DialogueBox/DialogueBox';
import MainMenu from './reactComponents/MainMenu/MainMenu';
import GameInfo from './reactComponents/GameInfo/GameInfo';
import InfoBox from './reactComponents/InfoBox/InfoBox';
import VictoryScreen from './reactComponents/VictoryScreen/VictoryScreen';
import Prompt from './reactComponents/Prompt/Pompt';
import BookMenu from './reactComponents/BookMenu/BookMenu';
import Shop from './reactComponents/Shop/Shop';
import Garden from './reactComponents/Garden/Garden';
import Gym from './reactComponents/Gym/Gym';
import GameMenu from './reactComponents/GameMenu/GameMenu';
import Holorange from './reactComponents/Holorange/Holorange';
import Engineering from './reactComponents/Engineering/Engineering';
import { 
    dialogueAtom, 
    popupAtom, 
    menuAtom, 
    infoBoxAtom, 
    victoryScreenAtom,
    promptAtom,
    bookMenuAtom,
    gameMenuAtom,
    shopAtom,
    gardenAtom,
    gymAtom,
    holorangeAtom,
    engineeringAtom
} from './store';
import { useAtom } from 'jotai';

export default function ReactUI() {
    const [popup] = useAtom(popupAtom);
    const [dialogue, setDialogue] = useAtom(dialogueAtom);
    const [menu] = useAtom(menuAtom);
    const [infoBox] = useAtom(infoBoxAtom);
    const [victoryScreen] = useAtom(victoryScreenAtom);
    const [prompt] = useAtom(promptAtom);
    const [bookMenu] = useAtom(bookMenuAtom);
    const [gameMenu] = useAtom(gameMenuAtom);
    const [shop] = useAtom(shopAtom);
    const [garden] = useAtom(gardenAtom);
    const [gym] = useAtom(gymAtom);
    const [holorange] = useAtom(holorangeAtom);
    const [engineering] = useAtom(engineeringAtom);

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

             {bookMenu.visible &&
                <BookMenu />
             }

             {gameMenu.visible &&
                <GameMenu
                    games={gameMenu.games}
                    handleClose={gameMenu.handleClose}
                />
             }

             {shop.visible &&
                <Shop />
             }

             {garden.visible &&
                <Garden />
             }

             {gym.visible &&
                <Gym />
             }

             {holorange.visible &&
                <Holorange />
             }

             {engineering.visible &&
                <Engineering />
             }

             {menu.visible && 
                <MainMenu
                    buttons={menu.buttons}
                />
            }
        </>
    );
}