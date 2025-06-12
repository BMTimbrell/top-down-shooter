import { engineeringAtom, playerInfoAtom } from "../../store";
import { useAtom } from 'jotai';
import Menu, { MenuContainer } from "../Menu/Menu";
import MenuItem, { MenuItemHeader } from "../MenuItem/MenuItem";
import PrimaryButton from "../Button/PrimaryButton";
import { Price } from "../Shop/Shop";
import Gun from "../Gun/Gun";
import GunContainer from "../Gun/GunContainer";
import Modal from "../Modal/Modal";
import BackButton from "../Button/BackButton";
import styles from "./Engineering.module.css";

export default function Engineering() {
    const [engineering, setEngineering] = useAtom(engineeringAtom);
    const [playerInfo] = useAtom(playerInfoAtom);
    const screen = engineering.screen || "main";

    return (
        <Menu>
            <h1>
                {
                    screen === "main" ? "Engineering" :
                        screen === "weapons" ? "Weapons" : "Armour"
                }
            </h1>

            {screen === "main" ?
                <>
                    {engineering.options.map((e, index) => (
                        <PrimaryButton key={index} onClick={e.button.onClick}>
                            {e.button.name}
                        </PrimaryButton>
                    ))}
                    <PrimaryButton onClick={engineering.handleExit}>Exit</PrimaryButton>
                </> : screen === "weapons" ?
                    <MenuContainer>
                        {engineering.guns.map((gun, index) => (
                            <div key={index} className={styles["weapon-menu-item"]}>
                                <MenuItemHeader>
                                    <h2>{gun.name}</h2>
                                    <Gun
                                        spritePos={gun.spritePos}
                                    />
                                </MenuItemHeader>

                                <div>Weapon Lvl 1</div>

                                <Price price={gun.price} />

                                <PrimaryButton onClick={gun.button.onClick} disabled={gun.button.disabled}>
                                    Buy
                                </PrimaryButton>
                            </div>

                        ))}
                    </MenuContainer> :
                    <MenuContainer>
                        {engineering.armour.map((e, index) => (
                            <MenuItem key={index} button={e.button}>
                                <MenuItemHeader>
                                    <h2>{e.name}</h2>
                                    <div>{e.description}</div>
                                </MenuItemHeader>
                            </MenuItem>
                        ))}
                    </MenuContainer>
            }

            {engineering.gunModal &&
                <Modal>
                    <h3>Replace a Gun</h3>
                    <GunContainer>
                        {playerInfo.data.guns.map((gun, index) => (
                            <div
                                onClick={() => engineering.replaceGun(index)}
                                className={styles["gun-card"]}
                                key={index}
                            >
                                <Gun
                                    spritePos={gun.spritePos}
                                />
                                <div className={styles.ammo}>
                                    {`${gun.ammo}/${gun.maxAmmo}`}
                                </div>
                            </div>
                        ))}
                    </GunContainer>

                    <BackButton onClick={() => setEngineering(prev => ({ ...prev, gunModal: false }))} />
                </Modal>
            }


            {screen !== "main" &&
                <div>
                    <BackButton onClick={() => setEngineering(prev => ({ ...prev, screen: "main" }))} />
                </div>
            }

        </Menu>
    );
}