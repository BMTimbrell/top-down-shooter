import Menu, { MenuContainer } from "../Menu/Menu";
import MenuItem, { MenuItemHeader } from "../MenuItem/MenuItem";
import { gymAtom } from "../../store";
import { useAtom } from 'jotai';
import PrimaryButton from "../Button/PrimaryButton";

export default function Garden() {
    const [gym] = useAtom(gymAtom);

    return (
        <Menu>
            <h1>Gym</h1>

            <MenuContainer>
                {gym.options.map((e, index) => (
                    <MenuItem key={index} button={e.button}>
                        <MenuItemHeader>
                            <h2>{e.name}</h2>
                            <div>{e.description}</div>
                        </MenuItemHeader>
                    </MenuItem>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={gym.handleExit}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}