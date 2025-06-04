import styles from './Book.module.css';
import MenuItem, { MenuItemHeader } from '../MenuItem/MenuItem';

export default function Book({ book, button, children }) {

    return (
        <MenuItem button={button}>
            <MenuItemHeader>
                <h2>{book.title}</h2>
                <div>{book.description}</div>
            </MenuItemHeader>

            {children}

        </MenuItem>
    );
}

export function BookProgress({ book }) {
    const progress = new Array(book.progress.max).
        fill(0, 0, book.progress.max).
        map((_, index) => {
            return index < book.progress.current ? '●' : '○';
        });

    return (
        <div>
            {progress.map((e, index) => (
                <span key={index} className={styles.progress}>
                    {e}
                </span>
            ))}
        </div>
    );
}