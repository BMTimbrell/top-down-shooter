import {
    store,
    engineeringAtom,
    gameInfoAtom,
    popupAtom,
    playerInfoAtom
} from '../store';

import { GUNS } from '../constants';

import { makeMap } from '../utils/map';

function disableButtons(products) {
    products.forEach(product => {
        product.button.disabled = product.price > store.get(gameInfoAtom).gold;
    });
    return products;
}

export default function engineering(k) {
    k.scene("engineering", async ({ player, gameState }) => {
        player.inDialogue = true;

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
            guns: Object.keys(GUNS).map(gun => ({
                name: gun,
                price: GUNS[gun].price,
                button: {
                    onClick: () => {

                        const gunFound = player.guns.find(g => g.name === gun);
                        if (gunFound) {
                            gunFound.ammo = GUNS[gun].maxAmmo;

                            store.set(gameInfoAtom, prev => ({
                                ...prev,
                                gold: prev.gold - GUNS[gun].price
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
                                gold: prev.gold - GUNS[gun].price
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
                                        gold: prev.gold - GUNS[gun].price
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
                    disabled: store.get(gameInfoAtom).gold < GUNS[gun].price,
                    name: "Buy",
                    icon: false
                }
            }))
        }));
    });
}