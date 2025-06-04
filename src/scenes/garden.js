import {
    store,
    gardenAtom,
    popupAtom,
    gameInfoAtom,
    dialogueAtom
} from '../store';
import makeFloatingText from '../utils/floatingText';

import { makeMap } from '../utils/map';

export default function shop(k) {
    k.scene("garden", async ({ player, gameState }) => {

        makeMap(k, "garden", { gameState, spriteName: "garden", center: true });

        store.set(popupAtom, prev => ({
            ...prev,
            visible: false
        }));


        store.set(gardenAtom, prev => ({
            ...prev,
            visible: true,
            handleExit: () => {
                store.set(gardenAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                k.go("main lobby", { gameState, player, prevRoom: "garden" });
            },
            options: [
                {
                    name: "Harvest",
                    description: "After tending to crops, you can harvest them for extra money.",
                    button: {
                        onClick: () => {
                            store.set(gardenAtom, prev => ({
                                ...prev,
                                visible: false
                            }));

                            const text = ["You harvest the crops, feeling a sense of accomplishment as you gather the fruits of your labor."];
                            const healChance = k.randi(0, 2);
                            if (healChance === 0) text.push("There is an abundance of healing herbs. You decide to use some on yourself.");

                            store.set(dialogueAtom, prev => ({
                                ...prev,
                                text,
                                visible: true,
                                skip: false
                            }));

                            const pressEvent = k.onKeyPress("e", () => {
                                if (store.get(dialogueAtom).skip) {
                                    store.set(dialogueAtom, prev => ({ ...prev, skip: false }));
                                    if (store.get(dialogueAtom).index === text.length - 1) {
                                        pressEvent.cancel();
                                        store.set(dialogueAtom, prev => ({ ...prev, visible: false, index: 0 }));

                                        store.set(gameInfoAtom, prev => ({
                                            ...prev,
                                            gold: prev.gold + 50
                                        }));
                                        const fText = makeFloatingText(k, k.vec2(0, 0), '+50');
                                        fText.screenPos(k.vec2(220, 180));

                                        if (text.length > 1) player.heal(1);

                                        k.wait(0.75, () => {
                                            store.set(gardenAtom, prev => ({
                                                ...prev,
                                                visible: true,
                                                harvestReady: false,
                                                options: prev.options.map(option => {
                                                    if (option.name === "Harvest") {
                                                        return {
                                                            ...option,
                                                            button: {
                                                                ...option.button,
                                                                disabled: true
                                                            }
                                                        };
                                                    }
                                                    return option;
                                                })
                                            }));

                                        });
                                    } else {
                                        store.set(dialogueAtom, prev => ({ ...prev, index: prev.index + 1 }));
                                    }
                                } else {
                                    store.set(dialogueAtom, prev => ({ ...prev, skip: true }));
                                }
                            });
                        },
                        disabled: !store.get(gardenAtom).harvestReady,
                        name: "Harvest Crops"
                    }
                },
                {
                    name: "Tend to Crops",
                    description: "Earn money by tending to the garden. The calming vibes and knowledge of different plants will cultivate your mind.",
                    button: {
                        onClick: () => {
                            store.set(gardenAtom, prev => ({
                                ...prev,
                                visible: false
                            }));

                            k.go("timeTransition", {
                                player,
                                gameState,
                                event: {
                                    text: [
                                        "As you tend to the garden, you feel a sense of calm wash over you.", "The plants respond to your care, and you find yourself lost in the rhythm of nurturing life.",
                                    ],
                                    exp: {
                                        type: "mind",
                                        amount: 5
                                    },
                                    action() {
                                        store.set(gameInfoAtom, prev => ({
                                            ...prev,
                                            gold: prev.gold + 200
                                        }));
                                        store.set(gardenAtom, prev => ({
                                            ...prev,
                                            harvestReady: true
                                        }));
                                        makeFloatingText(k, k.vec2(220, 245), '+200');
                                    }
                                },
                            });

                        },
                        disabled: false,
                        name: "Tend to Crops"
                    }
                }
            ]
        }));
    });
}