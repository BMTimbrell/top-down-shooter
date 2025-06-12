import Menu, { MenuContainer } from "../Menu/Menu";
import PrimaryButton from "../Button/PrimaryButton";
import { shopAtom, gameInfoAtom } from '../../store';
import { useAtom } from 'jotai';
import Book from '../Book/Book';
import MenuItem, { MenuItemHeader } from "../MenuItem/MenuItem";
import styles from './Shop.module.css';

export default function Shop() {
    const [shop] = useAtom(shopAtom);
    const books = shop.products.books;
    const electronics = shop.products.electronics;

    return (
        <Menu>
            <h1>Shop</h1>

            <MenuContainer>
                {electronics.map((e, index) => (
                    <MenuItem key={index} button={e.button}>
                        <MenuItemHeader>
                            <h2>{e.name}</h2>
                            <div>{e.description}</div>
                        </MenuItemHeader>

                        <div className={styles["price-container"]}>
                            <img width="27" src="./sprites/coin2.png" />
                            <span className={e.button.disabled ? styles.unaffordable : ""}>{e.price}</span>
                        </div>
                    </MenuItem>
                ))}

                {books.map((book, index) => (
                    <Book key={index} book={book} button={book.button}>
                        <Price price={book.price} />
                    </Book>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={shop.handleExit}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}

export function Price({ price }) {
    const [gameInfo] = useAtom(gameInfoAtom);
    const disabled = gameInfo.gold < price;

    return (
        <div className={styles["price-container"]}>
            <img width="27" src="./sprites/coin2.png" />
            <span className={disabled ? styles.unaffordable : ""}>{price}</span>
        </div>
    );
}