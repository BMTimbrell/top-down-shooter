import Menu, { MenuContainer } from "../Menu/Menu";
import MenuItem, { MenuItemHeader } from "../MenuItem/MenuItem";
import { psiLabAtom } from "../../store";
import { useAtom } from 'jotai';
import PrimaryButton from "../Button/PrimaryButton";
import LevelReq from "../LevelReq/LevelReq";

export default function PsiLab() {
    const [psiLab] = useAtom(psiLabAtom);

    return (
        <Menu>
            <h1>Psionics</h1>

            <MenuContainer>
                {psiLab.options.map((e, index) => (
                    <MenuItem key={index} button={e.button}>
                        <MenuItemHeader>
                            <h2>{e.name}</h2>
                            <div>{e.description}</div>
                        </MenuItemHeader>
                        <LevelReq type="mind" level={e.level}>
                            Mind Lvl {e.level}
                        </LevelReq>
                    </MenuItem>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={psiLab.handleExit}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}