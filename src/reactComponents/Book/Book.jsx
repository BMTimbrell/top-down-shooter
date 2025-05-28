import PrimaryButton from '../Button/PrimaryButton';
import styles from './Book.module.css';

export default function Book({ book }) {
    const progress = new Array(book.progress.max).
        fill(0, 0, book.progress.max).
        map((_, index) => {
            return index < book.progress.current ? '●' : '○';
        });

    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <h2>{book.title}</h2>
                <div>{book.description}</div>
            </div>
            <div>
                {progress.map((e, index) => (
                    <span key={index} className={styles.progress}>
                        {e}
                    </span>
                ))}
            </div>
            <PrimaryButton onClick={book.handleRead}>
                Read
            </PrimaryButton>
        </div>
    );
}