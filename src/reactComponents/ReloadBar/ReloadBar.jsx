import styles from './ReloadBar.module.css';

export default function ReloadBar({ percent, clip }) {
    return (
        <div className={styles["reload-bar"]} style={{ '--percent': `${percent}%` }}>
            {clip}
        </div>
    );
}