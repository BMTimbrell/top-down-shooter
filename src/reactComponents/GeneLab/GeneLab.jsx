import Menu, { MenuContainer } from "../Menu/Menu";
import MenuItem, { MenuItemHeader } from "../MenuItem/MenuItem";
import { geneLabAtom } from "../../store";
import { useAtom } from 'jotai';
import PrimaryButton from "../Button/PrimaryButton";
import LevelReq from "../LevelReq/LevelReq";

export default function GeneLab() {
    const [geneLab] = useAtom(geneLabAtom);

    return (
        <Menu>
            <h1>Gene Lab</h1>

            <MenuContainer>
                {geneLab.options.map((e, index) => (
                    <MenuItem key={index} button={e.button}>
                        <MenuItemHeader>
                            <h2>{e.name}</h2>
                            <div>{e.description}</div>
                        </MenuItemHeader>
                        <LevelReq type="body" level={e.level}>
                            Body Lvl {e.level}
                        </LevelReq>
                    </MenuItem>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={geneLab.handleExit}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}