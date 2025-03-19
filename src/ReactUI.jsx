import Popup from './reactComponents/Popup/Popup';
import { isPopupVisibleAtom, popupTextAtom } from './store';
import { useAtom } from 'jotai';

export default function ReactUI() {
    const [isPopupVisible] = useAtom(isPopupVisibleAtom);
    const [popupText] = useAtom(popupTextAtom);

    return (
        <>
            {isPopupVisible && <Popup text={popupText} />}
        </>
    );
}