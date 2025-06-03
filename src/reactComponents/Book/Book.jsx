import PrimaryButton from '../Button/PrimaryButton';
import styles from './Book.module.css';
import Product, { ProductHeader } from '../Product/Product';

export default function Book({ book, button, children }) {

    return (
        <Product button={button}>
            <ProductHeader>
                <h2>{book.title}</h2>
                <div>{book.description}</div>
            </ProductHeader>

            {children}

        </Product>
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