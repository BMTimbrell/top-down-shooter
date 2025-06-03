import Menu, { MenuContainer } from "../Menu/Menu";
import PrimaryButton from "../Button/PrimaryButton";
import Product, { ProductHeader } from "../Product/Product";

export default function GameMenu({ games, handleClose }) {

    return (
        <Menu>
            <h1>Games</h1>

            <MenuContainer>
                {games.map((game, index) => (
                    <Product key={index} button={game.button}>
                        <ProductHeader>
                            <h2>{game.name}</h2>
                            <div>{game.description}</div>
                        </ProductHeader>
                    </Product>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={handleClose}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}