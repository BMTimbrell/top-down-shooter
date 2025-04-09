import styles from './ReloadBar.module.css';

export default function ReloadBar({ percent, clip, pos }) {
    const posStyle = pos ? {
        left: pos.x,
        top: pos.y,
        bottom: 'unset',
        width: '50px'
    } : undefined;

    return (
        <div 
            className={styles["reload-bar"]} 
            style={{
                '--percent': `${percent}%`, 
                ...posStyle
            }}
        >
            {clip}
        </div>
    );
}