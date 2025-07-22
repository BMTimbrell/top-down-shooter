import { mainMenuAtom } from "../../store";
import { useAtom } from 'jotai';
import PrimaryButton from "../Button/PrimaryButton";
import styles from "./MainMenu.module.css";

export default function MainMenu() {
    const [menu] = useAtom(mainMenuAtom);
    const buttons = menu.buttons;

    return (
        <div className={styles.container}>
            {buttons.map((button, index) => (
                <PrimaryButton key={index} disabled={button.disabled} onClick={button.onClick}>
                    {button.name}
                </PrimaryButton>
            ))}
        </div>
    );
}