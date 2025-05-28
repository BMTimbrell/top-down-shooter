import { bookMenuAtom } from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';
import Book from '../Book/Book';
import styles from './BookMenu.module.css';

export default function BookMenu() {
    const [bookMenu] = useAtom(bookMenuAtom);
    const books = bookMenu.books;
    return (
        <div className={styles.menu}>
            <h1>Books</h1>
            <div className={styles.container}>
                {books.length ? books.map((book, index) => (
                    <Book key={index} book={book} />
                )) : (
                    <div>You have no books to read.</div>
                )}
            </div>
            
            <div className={styles.footer}>
                <PrimaryButton onClick={bookMenu.handleClose}>
                    Close
                </PrimaryButton>
            </div>
        </div>
    );
}