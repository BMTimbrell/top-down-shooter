import { bookMenuAtom } from '../../store';
import { useAtom } from 'jotai';
import PrimaryButton from '../Button/PrimaryButton';
import Book, { BookProgress } from '../Book/Book';
import Menu, { MenuContainer } from '../Menu/Menu';

export default function BookMenu() {
    const [bookMenu] = useAtom(bookMenuAtom);
    const books = bookMenu.books;

    return (
        <Menu>
            <h1>Books</h1>
            <MenuContainer>
                {books.length ? books.map((book, index) => (
                    <Book key={index} book={book} button={book.button}>
                        <BookProgress book={book} />
                    </Book>
                )) : (
                    <div>You have no books to read.</div>
                )}
            </MenuContainer>
            
            <div>
                <PrimaryButton onClick={bookMenu.handleClose}>
                    Close
                </PrimaryButton>
            </div>
        </Menu>
    );
}