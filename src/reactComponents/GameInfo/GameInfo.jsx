import { gameInfoAtom, playerInfoAtom } from "../../store";
import { useAtom } from 'jotai';
import styles from './GameInfo.module.css';
import Gun from "../Gun/Gun";
import GunContainer from "../Gun/GunContainer";
import ReloadBar from "../ReloadBar/ReloadBar";
import Ability from "../Ability/Ability";

export default function GameInfo() {
    const [gameInfo] = useAtom(gameInfoAtom);
    const [playerInfo] = useAtom(playerInfoAtom);
    const guns = playerInfo.data.guns;
    const emptySlots = new Array(gameInfo.maxGuns - guns.length).fill(0);
    const cooldwns = gameInfo.cooldwns;
    const abilities = playerInfo.data.abilities;
    const hearts = [];
    const time = gameInfo.time === 0 ? "Morning" :
        gameInfo.time === 1 ? "Afternoon" :
        gameInfo.time === 2 ? "Evening" : "Night";
    const timeImgSrc = time === "Afternoon" ? "sunny.png" :
        time === "Evening" ? "sunset.png" :
        time === "Night" ? "moon.png" : "sunrise.png"

    let healthCount = gameInfo.health;
    for (let i = 0; i < gameInfo.maxHealth; i++) {
        if (healthCount > 0) hearts.push(1);
        else hearts.push(0);
        healthCount--;
    }

    return (
        <>
            {gameInfo.reloading && <ReloadBar percent={cooldwns.reload * 100} pos={gameInfo.rBarPos} />}

            <div className={styles["top-container"]}>
                <div className={styles.time}>
                    <div>Day {gameInfo.day}</div>
                    <div className={styles.time2}>
                        <img width="50px" src={`./sprites/${timeImgSrc}`}/>
                        {time}
                    </div>
                    {!gameInfo.onMission && 
                        <div>
                            {gameInfo.daysUntilMission > 0 && 
                                `Days until mission: ${gameInfo.daysUntilMission}`
                            }
                        </div>
                    }
                </div>

                <div className={styles.hearts}>
                    {hearts.map((e, index) => {
                        if (e === 1) return <img key={index} src="./sprites/heart.png" />;
                        else return <img key={index} src="./sprites/empty-heart.png" />;
                    })}
                </div>

                <div className={styles.money}>
                    <img src="./sprites/coin2.png" />
                    {gameInfo.gold}
                </div>
            </div>

            {gameInfo.onMission && (
                <div className={styles["bottom-container"]}>
                    <div className={styles["ability-container"]}>
                        <Ability aKey={"RMB"} cooldown={cooldwns.dash} imgSrc={"./sprites/dash-icon-4.png"} />
                        {abilities?.map((ability, index) => (
                            ability.active && <Ability 
                                key={index}
                                aKey={ability.key} 
                                cooldown={ability.cooldown} 
                                imgSrc={ability.imgSrc} 
                            />
                        ))}
                    </div>
                    
                    <GunContainer>
                        {guns.map((gun, index) => (
                            <div 
                                key={index}
                                className={`${styles["gun-card"]} ${(index === gameInfo.gunIndex ? styles["active-gun"] : "")}`}
                            >
                                {/* Equipped gun */}
                                {index === gameInfo.gunIndex && (
                                    <>
                                        <div className={styles.ammo}>
                                            {`${guns[index].ammo}/${guns[index].maxAmmo}`}
                                        </div>

                                        <ReloadBar percent={cooldwns.reload * 100} clip={`${gun.clip}/${gun.clipSize}`} />
                                    </>
                                )}

                                <Gun
                                    spritePos={gun.spritePos}
                                />
                            </div>
                        ))}

                        {emptySlots.length > 0 && emptySlots.map((_, index) => ( 
                            <div key={index} className={styles["gun-card"]}>
                            </div>
                        ))}
                    </GunContainer>
                </div>
            )}
        </>
    );
}