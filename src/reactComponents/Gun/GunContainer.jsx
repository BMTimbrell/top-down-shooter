import styles from './GunContainer.module.css';

export default function GunContainer({ children }) {
    return (
        <div className={styles["gun-container"]}>
            {children}
        </div>
    );
}