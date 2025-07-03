import {
    store,
    engineeringAtom,
    gameInfoAtom,
    popupAtom,
    playerInfoAtom
} from '../store';

import { DISCOUNT, GUNS } from '../constants';

import { makeMap } from '../utils/map';

function disableButtons(products) {
    products.forEach(product => {
        product.button.disabled = product.price > store.get(gameInfoAtom).gold ||
            store.get(playerInfoAtom).data.exp.weapon.level < product.level;
    });
    return products;
}

export default function engineering(k) {
    k.scene("engineering", async ({ player, gameState }) => {

        makeMap(k, "engineering", { gameState, spriteName: "engineering", center: true });

        store.set(popupAtom, prev => ({
            ...prev,
            visible: false
        }));


        store.set(engineeringAtom, prev => ({
            ...prev,
            visible: true,
            handleExit: () => {
                store.set(engineeringAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                k.go("main lobby", { gameState, player, prevRoom: "engineering" });
            },
            options: [
                {
                    button: {
                        onClick: () => {
                            store.set(engineeringAtom, prev => ({
                                ...prev,
                                screen: "weapons"
                            }));

                        },
                        disabled: false,
                        name: "Weapons and Ammo",
                        icon: false
                    }
                },

                {
                    button: {
                        onClick: () => {
                            store.set(engineeringAtom, prev => ({
                                ...prev,
                                screen: "armour"
                            }));

                        },
                        disabled: false,
                        name: "Armour",
                        icon: false
                    }
                }
            ],
            guns: Object.keys(GUNS).map(gun => {
                const price = player.discount ? GUNS[gun].price * DISCOUNT : GUNS[gun].price;
                return {
                name: gun,
                price,
                level: GUNS[gun].level,
                spritePos: GUNS[gun].spritePos,
                button: {
                    onClick: () => {
                        const gunFound = player.guns.find(g => g.name === gun);
                        if (gunFound) {
                            gunFound.ammo = GUNS[gun].maxAmmo;

                            store.set(gameInfoAtom, prev => ({
                                ...prev,
                                gold: prev.gold - price
                            }));

                            store.set(engineeringAtom, prev => ({
                                ...prev,
                                guns: disableButtons(store.get(engineeringAtom).guns),
                                armour: disableButtons(store.get(engineeringAtom).armour)
                            }));
                        } else if (player.guns.length < player.maxGuns) {
                            player.guns.push({
                                name: gun,
                                ammo: GUNS[gun].maxAmmo,
                                ...GUNS[gun],
                                clip: GUNS[gun].clipSize
                            });

                            store.set(gameInfoAtom, prev => ({
                                ...prev,
                                gold: prev.gold - price
                            }));

                            store.set(engineeringAtom, prev => ({
                                ...prev,
                                guns: disableButtons(store.get(engineeringAtom).guns),
                                armour: disableButtons(store.get(engineeringAtom).armour)
                            }));
                        } else {
                            store.set(engineeringAtom, prev => ({
                                ...prev,
                                gunModal: true,
                                replaceGun: index => {
                                    player.guns[index] = {
                                        name: gun,
                                        ammo: GUNS[gun].maxAmmo,
                                        ...GUNS[gun],
                                        clip: GUNS[gun].clipSize
                                    };

                                    store.set(gameInfoAtom, prev => ({
                                        ...prev,
                                        gold: prev.gold - price
                                    }));

                                    store.set(engineeringAtom, prev => ({
                                        ...prev,
                                        gunModal: false,
                                        guns: disableButtons(store.get(engineeringAtom).guns),
                                        armour: disableButtons(store.get(engineeringAtom).armour)
                                    }));
                                }
                            }));

                            store.set(playerInfoAtom, prev => ({
                                ...prev,
                                data: {
                                    ...prev.data,
                                    guns: player.guns
                                }
                            }));
                        }

                    },
                    disabled: store.get(gameInfoAtom).gold < price ||
                        store.get(playerInfoAtom).data.exp.weapon.level < GUNS[gun].level,
                    name: "Buy",
                    icon: false
                }
            }}),
            armour: [
                {
                    name: "Predator Armour",
                    description: "+1 max health and an additional weapon slot",
                    price: player.discount ? 1000 * DISCOUNT : 1000,
                    button: {
                        onClick: () => {
                            const price = player.discount ? 1000 * DISCOUNT : 1000;

                            store.set(gameInfoAtom, prev => ({
                                ...prev,
                                gold: prev.gold - price,
                                maxHealth: prev.maxHealth + 1,
                                maxGuns: prev.maxGuns + 1
                            }));

                            store.set(playerInfoAtom, prev => ({
                                ...prev,
                                data: {
                                    ...prev.data,
                                    armour: {
                                        ...prev.data.armour,
                                        predator: true
                                    }
                                }
                            }));

                            player.setMaxHP(player.maxHP() + 1);
                            player.heal(1);
                            player.maxGuns += 1;

                            store.set(engineeringAtom, prev => ({
                                ...prev,
                                showArmour: {
                                    "Predator Armour": false,
                                    "Titan Armour": true
                                },
                                guns: disableButtons(store.get(engineeringAtom).guns),
                                armour: disableButtons(store.get(engineeringAtom).armour)
                            }));

                        },
                        name: "Buy",
                        disabled: store.get(gameInfoAtom).gold < (player.discount ? 1000 * DISCOUNT : 1000)
                    }
                },
                {
                    name: "Titan Armour",
                    description: "+2 max health and 2 additional weapon slots",
                    price: player.discount ? 3000 * DISCOUNT : 3000,
                    button: {
                        onClick: () => {
                            const price = player.discount ? 3000 * DISCOUNT : 3000;

                            store.set(gameInfoAtom, prev => ({
                                ...prev,
                                gold: prev.gold - price,
                                maxHealth: prev.maxHealth + 1,
                                maxGuns: prev.maxGuns + 1
                            }));

                            store.set(playerInfoAtom, prev => ({
                                ...prev,
                                data: {
                                    ...prev.data,
                                    armour: {
                                        ...prev.data.armour,
                                        titan: true
                                    }
                                }
                            }));

                            player.setMaxHP(player.maxHP() + 1);
                            player.heal(1);
                            player.maxGuns += 1;

                            store.set(engineeringAtom, prev => ({
                                ...prev,
                                guns: disableButtons(store.get(engineeringAtom).guns),
                                armour: disableButtons(store.get(engineeringAtom).armour),
                                showArmour: {
                                    "Predator Armour": false,
                                    "Titan Armour": false
                                }
                            }));

                        },
                        name: "Buy",
                        disabled: store.get(gameInfoAtom).gold < (player.discount ? 3000 * DISCOUNT : 3000)
                    }
                }
            ]
        }));
    });
}