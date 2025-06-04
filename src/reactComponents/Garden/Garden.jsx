import Menu, { MenuContainer } from "../Menu/Menu";
import MenuItem, { MenuItemHeader } from "../MenuItem/MenuItem";
import { gardenAtom } from "../../store";
import { useAtom } from 'jotai';
import PrimaryButton from "../Button/PrimaryButton";

export default function Garden() {
    const [garden] = useAtom(gardenAtom);

    return (
        <Menu>
            <h1>Synth-Garden</h1>

            <MenuContainer>
                {garden.options.map((e, index) => (
                    <MenuItem key={index} button={e.button}>
                        <MenuItemHeader>
                            <h2>{e.name}</h2>
                            <div>{e.description}</div>
                        </MenuItemHeader>
                    </MenuItem>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={garden.handleExit}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}