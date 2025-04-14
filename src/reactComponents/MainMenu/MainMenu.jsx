import styles from './MainMenu.module.css';
import PrimaryButton from '../Button/PrimaryButton';
import Gun from '../Gun/Gun';
import GunContainer from '../Gun/GunContainer';
import { playerInfoAtom } from '../../store';
import { useAtom } from 'jotai';
import BackButton from '../Button/BackButton';
import ExpBar from '../ExpBar/ExpBar';
import { useRef } from 'react';
import Modal from '../Modal/Modal';

export default function MainMenu({ buttons }) {
    const [playerInfo, setPlayerInfo] = useAtom(playerInfoAtom);
    const menuRef = useRef(null);
    const mind = playerInfo.data.exp.mind;
    const body = playerInfo.data.exp.body;
    const weaponLvl = playerInfo.data.exp.weaponLvl;

    return (
        <Modal ref={menuRef}>
            {playerInfo.visible ? (
                <div className={styles["player-info"]}>
                    <h1>Player Info</h1>
                    <h2>Stats</h2>
                    <ul>
                        <li key={0}>
                            <div>Mind: </div>
                            <ExpBar stat={mind} />
                        </li>
                        <li key={1}>
                            <div>Body: </div>
                            <ExpBar stat={body} />
                        </li>
                        <li key={2}>
                            <div>Weapons: </div>
                            <ExpBar stat={weaponLvl} />
                        </li>
                    </ul>
                    <h2>Guns</h2>
                    <GunContainer>
                        {playerInfo.data.guns.map((gun, index) => (
                            <Gun 
                                key={index}
                                spritePos={gun.spritePos}
                                name={gun.name}
                                damage={gun.damage}
                                firingInterval={gun.firingInterval}
                                animSpeed={gun.animSpeed} 
                                parentPos={menuRef?.current?.getBoundingClientRect()}
                            />
                        ))}
                    </GunContainer>

                    <BackButton onClick={() => setPlayerInfo(prev => ({ ...prev, visible: false }))}></BackButton>
                </div>
            ) : (
                <div className={styles["button-container"]}>
                    {buttons.map(button => (
                        <PrimaryButton key={button.name} onClick={button.onClick}>
                            {button.name}
                        </PrimaryButton>
                    ))}
                </div>
            )}
        </Modal>
    );
}