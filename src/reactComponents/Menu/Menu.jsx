import styles from './Menu.module.css';

export default function Menu({ children }) {
    return (
        <div className={styles.menu}>
            { children }
        </div>
    );
}

export function MenuContainer({ children }) {
    return (
        <div className={styles.container}>
            { children }
        </div>
    );
}
