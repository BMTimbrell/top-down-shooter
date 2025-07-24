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
import LevelReq from "../LevelReq/LevelReq";
import ButtonContainer from '../Button/ButtonContainer';

export default function Engineering() {
    const [engineering, setEngineering] = useAtom(engineeringAtom);
    const [playerInfo] = useAtom(playerInfoAtom);
    const screen = engineering.screen || "main";
    const selectedGun = engineering.ammoModal.selectedGun;

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

                                <LevelReq type="weapon" level={gun.level}>Weapon Lvl {gun.level}</LevelReq>

                                <Price price={gun.price} />

                                <PrimaryButton onClick={gun.button.onClick} disabled={gun.button.disabled}>
                                    Buy
                                </PrimaryButton>
                            </div>

                        ))}
                    </MenuContainer> :
                    <MenuContainer>
                        {engineering.armour.map((e, index) => (
                            engineering.showArmour[e.name] &&
                            <MenuItem key={index} button={e.button}>
                                <MenuItemHeader>
                                    <h2>{e.name}</h2>
                                    <div>{e.description}</div>
                                </MenuItemHeader>

                                <Price price={e.price} />
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

            {engineering.ammoModal.visible &&
                <Modal>
                    <div
                        onClick={() => engineering.ammoModal.purchaseAmmo}
                        className={styles["ammo-modal"]}
                    >
                        <h3>Buy Ammo</h3>
                        
                        <Gun
                            spritePos={selectedGun.spritePos}
                        />

                        <div className={styles.ammo}>
                            {`${selectedGun.ammo}/${selectedGun.maxAmmo}`}
                        </div>
                        <div className={styles["ammo-gained"]}>
                            +{selectedGun.maxAmmo - selectedGun.ammo}
                        </div>

                        <ButtonContainer>
                            <PrimaryButton onClick={engineering.ammoModal.purchaseAmmo}>
                                Yes
                            </PrimaryButton>

                            <PrimaryButton 
                                onClick={() => setEngineering(prev => ({ ...prev, ammoModal: { visible: false, selectedGun: null } }))} 
                            >
                                No
                            </PrimaryButton>
                        </ButtonContainer>
                    </div>

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