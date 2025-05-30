import Menu, { MenuContainer } from "../Menu/Menu";
import PrimaryButton from "../Button/PrimaryButton";
import { shopAtom } from '../../store';
import { useAtom } from 'jotai';
import Book from '../Book/Book';
import styles from './Shop.module.css';

export default function Shop() {
    const [shop] = useAtom(shopAtom);
    const books = shop.products.books;

    return (
        <Menu>
            <h1>Shop</h1>

            <MenuContainer>
                {books.map((book, index) => (
                    <Book key={index} book={book} button={book.button}>
                        <div className={styles["price-container"]}>
                            <img width="27" src="./sprites/coin2.png" />
                            <span className={book.button.disabled ? styles.unaffordable : ""}>{book.price}</span>
                        </div>
                    </Book>
                ))}
            </MenuContainer>

            <div>
                <PrimaryButton onClick={shop.handleExit}>Exit</PrimaryButton>
            </div>
        </Menu>
    );
}