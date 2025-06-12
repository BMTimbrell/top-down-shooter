import Menu, { MenuContainer } from "../Menu/Menu";
import MenuItem, { MenuItemHeader } from "../MenuItem/MenuItem";
import { holorangeAtom } from "../../store";
import { useAtom } from 'jotai';
import PrimaryButton from "../Button/PrimaryButton";

export default function Holorange() {
    const [holorange] = useAtom(holorangeAtom);

    return (
        <Menu>
            <h1>Holorange</h1>

            <MenuContainer>
                {holorange.options.map((e, index) => (
                    <MenuItem key={index} button={e.button}>
                        <MenuItemHeader>
                            <h2>{e.name}</h2>
                            <div>{e.description}</div>
                        </MenuItemHeader>
                    </MenuItem>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={holorange.handleExit}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}