import PrimaryButton from '../Button/PrimaryButton';
import styles from './Book.module.css';

export default function Book({ book, button, children }) {

    return (
        <div className={styles.container}>
            <div className={styles.description}>
                <h2>{book.title}</h2>
                <div>{book.description}</div>
            </div>

            {children}

            <PrimaryButton onClick={button.onClick} disabled={button.disabled}>
                {button.name}
            </PrimaryButton>
        </div>
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