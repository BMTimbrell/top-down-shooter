import styles from './Gun.module.css';

export default function Gun({ spritePos }) {

    return (
        <>
            <div
                style={{ 
                    "--sprite-pos-x": `${spritePos.x}px`, 
                    "--sprite-pos-y": `${spritePos.y}px` 
                }} 
                className={styles.gun}
            >
            </div>
        </>
    );
}