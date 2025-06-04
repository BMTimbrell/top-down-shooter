import Menu, { MenuContainer } from "../Menu/Menu";
import PrimaryButton from "../Button/PrimaryButton";
import MenuItem, { MenuItemHeader } from "../MenuItem/MenuItem";

export default function GameMenu({ games, handleClose }) {

    return (
        <Menu>
            <h1>Games</h1>

            <MenuContainer>
                {games.map((game, index) => (
                    <MenuItem key={index} button={game.button}>
                        <MenuItemHeader>
                            <h2>{game.name}</h2>
                            <div>{game.description}</div>
                        </MenuItemHeader>
                    </MenuItem>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={handleClose}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}