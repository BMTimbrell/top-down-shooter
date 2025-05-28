import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from '../utils/map';
import { spendTime } from '../utils/daySystem';
import { store, infoBoxAtom, promptAtom, popupAtom, bookMenuAtom } from '../store';

export default function room(k) {
    k.scene("room", async ({ player, gameState }) => {
        const roomData = await (await fetch("./data/room.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "room", { gameState, layers, spriteName: "room" });

        spawnObjects(
            k,
            map,
            {
                layers,
                player,
                gameState,
                tileset: "ship-tileset"
            }
        );

        // draw in order of y coordinate
        orderByY(k);

        for (const layer of layers) {
            if (layer.name === "boundaries") {
                makeBoundaries(k, map, layer);
            } else if (layer.name === "entity interactions") {
                makeObjectInteractions(
                    k,
                    map,
                    {
                        layer,
                        player,
                        gameState
                    }
                );
            }
        }

        const skillExplanations = gameState.events.skillExplanations;

        if (skillExplanations.overview) {
            k.wait(0.1, () => {
                store.set(infoBoxAtom, prev => ({
                    ...prev,
                    visible: true,
                    text: "You can spend time on the ship doing various activities that raise different skills "
                        + "or unlock new abilities and weapons to help on your missions. Use your time wisely to prepare "
                        + "for future missions."
                }));
            });

            skillExplanations.overview = false;
        }

        k.onUpdate(() => {
            if (!skillExplanations["pullup bar"] &&
                !player.inDialogue &&
                player.isColliding(k.get("check pullup bar")[0]) &&
                k.isKeyDown("e")
            ) {
                player.inDialogue = true;
                store.set(popupAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                store.set(promptAtom, prev => ({
                    ...prev,
                    visible: true,
                    text: "Do pullups?",
                    handleYes: () => {
                        store.set(promptAtom, prev => ({
                            ...prev,
                            visible: false
                        }));
                        player.inDialogue = false;
                        k.go("timeTransition", {
                            player,
                            gameState,
                            event: {
                                text: ["As you lift your chin to the bar, you feel your muscles grow stronger."],
                                exp: { type: "body", amount: 5 }
                            }
                        });
                    },
                    handleNo: () => {
                        store.set(promptAtom, prev => ({
                            ...prev,
                            visible: false
                        }));
                        player.inDialogue = false;
                    }
                }));

            } else if (!skillExplanations["bed"] &&
                !player.inDialogue &&
                player.isColliding(k.get("check bed")[0]) &&
                k.isKeyDown("e")
            ) {
                player.inDialogue = true;
                store.set(popupAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                store.set(promptAtom, prev => ({
                    ...prev,
                    visible: true,
                    text: "Sleep?",
                    handleYes: () => {
                        store.set(promptAtom, prev => ({
                            ...prev,
                            visible: false
                        }));
                        player.inDialogue = false;

                        const dreams = [
                            { 
                                text: [
                                    "You are trying to run away from a giant spider, but for some reason you are moving at a snail's pace.", 
                                    "You awaken feeling more athletic."
                                ],
                                exp: { type: "body", amount: 3 }
                            },
                            { 
                                text: [
                                    "You wander a vast, infinite library, absorbing forgotten knowledge just by touching the books.", 
                                    "You awaken with a clearer understanding of the universe."
                                ],
                                exp: { type: "mind", amount: 3 }
                            },
                            { 
                                text: [
                                    "Symbols and shapes fall from the sky like notes in a puzzle.",
                                    "You arrange them into harmonious patterns and awaken with a clearer mind."
                                ],
                                exp: { type: "mind", amount: 3 }
                            },
                            { 
                                text: [
                                    "You stand in a glowing void with infinite targets appearing at random angles and distances. Time slows, focus sharpens. Every shot hits.",
                                    "You wake up remembering how the grip felt in your hand."
                                ],
                                exp: { type: "weapon", amount: 3 }
                            },
                            { 
                                text: [
                                    "You are in a tense standoff against a mysterious, shadowy figure. You draw your gun and fire with perfect timing, winning in a single, clean shot.",
                                    "You wake up remembering how the grip felt in your hand."
                                ],
                                exp: { type: "weapon", amount: 3 }
                            },
                        ];
                        const dream = dreams[k.randi(0, dreams.length)];
                        k.go("timeTransition", {
                            player,
                            gameState,
                            event: {
                                text: dream.text,
                                exp: { type: dream.exp.type, amount: dream.exp.amount },
                                action() { player.heal(1) }
                            }
                        });
                    },
                    handleNo: () => {
                        store.set(promptAtom, prev => ({
                            ...prev,
                            visible: false
                        }));
                        player.inDialogue = false;
                    }
                }));

            } else if (!skillExplanations["desk"] &&
                !player.inDialogue &&
                player.isColliding(k.get("check desk")[0]) &&
                k.isKeyDown("e")
            ) {
                player.inDialogue = true;
                store.set(popupAtom, prev => ({
                    ...prev,
                    visible: false
                }));


                store.set(bookMenuAtom, prev => ({
                    ...prev,
                    visible: true,
                    books: player.books,
                    handleClose: () => {
                        store.set(bookMenuAtom, prev => ({
                            ...prev,
                            visible: false
                        }));
                        player.inDialogue = false;
                    }
                }));


            }
        });
    });
}