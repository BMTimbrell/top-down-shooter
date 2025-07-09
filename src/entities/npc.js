import {
    store,
    popupAtom,
    dialogueAtom,
    promptAtom,
    gameInfoAtom
} from '../store';

import makeFloatingText from '../utils/floatingText';

export default function makeNpc(k, { sprite, pos, dialogue = [] }) {
    const npc = k.add([
        k.sprite(
            sprite,
            { anim: sprite.includes("robot") && k.get("gameState")[0].robot.broken ? "broken" : "idle" }
        ),
        k.pos(pos),
        k.anchor("center"),
        k.scale(4),
        k.area(),
        sprite.includes("robot") ? "robot" : ""
    ]);

    npc.onCollideUpdate("player", player => {
        const popupPos = {
            x: npc.screenPos().x - 40,
            y: npc.screenPos().y - 60
        };

        const isBrokenRobot = npc.is("robot") && k.get("gameState")[0].robot.broken;

        // show popup if not showing dialogue box
        if (!player.inDialogue) {
            const action = isBrokenRobot ? "Fix" : "Talk";

            store.set(
                popupAtom,
                prev => ({
                    ...prev,
                    visible: true,
                    text: {
                        action,
                        name: npc.is("robot") ? "Robot" : "",
                        key: "E"
                    },
                    pos: popupPos
                })
            );
        }

        if (player.inDialogue && npc.curAnim() !== "talk" && !isBrokenRobot) {
            npc.play("talk");
        } else if (!player.inDialogue && !isBrokenRobot) npc.play("idle");

        if (k.isKeyPressed("e")) {

            if (isBrokenRobot) {
                if (player.mind.level < 2) {
                    dialogue = ["I don't think I'm clever enough to fix this right now."];
                } else {
                    player.inDialogue = true;
                    store.set(popupAtom, prev => ({
                        ...prev,
                        visible: false
                    }));

                    const gameState = k.get("gameState")[0];
                    const fixProgress = gameState.robot.fixProgress;

                    const text = fixProgress < 1 ?
                        ["You work on fixing the robot.", "However it's still a work in progress."] :
                        ["You finish fixing the robot and feel like you learned a lot in the process."];

                    store.set(promptAtom, prev => ({
                        ...prev,
                        visible: true,
                        text: "Fix Robot",
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
                                    text,
                                    exp: fixProgress >= 1 ? { type: "mind", amount: 30 } : null,
                                    action() {
                                        if (fixProgress >= 1) {
                                            gameState.robot.broken = false
                                        } else {
                                            gameState.robot.fixProgress++;
                                        }
                                    }
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
                    return;
                }
            }

            if (player.inDialogue) {
                if (store.get(dialogueAtom).skip) {
                    store.set(dialogueAtom, prev => ({ ...prev, skip: false }));
                    if (store.get(dialogueAtom).index === dialogue.length - 1) {
                        store.set(dialogueAtom, prev => ({ ...prev, visible: false, index: 0 }));

                        if (npc.is("robot") && !isBrokenRobot) {
                            const gameState = k.get("gameState")[0];

                            store.set(promptAtom, prev => ({
                                ...prev,
                                visible: true,
                                text: "Clean the ship",
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
                                            text: ["You work meticulously to clean every nook and cranny of the ship."],
                                            exp: null,
                                            action() {
                                                store.set(gameInfoAtom, prev => ({
                                                    ...prev,
                                                    gold: prev.gold + 500
                                                }));

                                                makeFloatingText(k, k.vec2(220, 290), '+500');
                                            }
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
                        } else {
                            player.inDialogue = false;
                        }

                    } else {
                        store.set(dialogueAtom, prev => ({ ...prev, index: prev.index + 1 }));
                    }
                } else if (store.get(dialogueAtom).visible) {
                    store.set(dialogueAtom, prev => ({ ...prev, skip: true }));
                }
            } else if (dialogue) {
                player.inDialogue = true;

                store.set(dialogueAtom, prev => ({ ...prev, visible: true, text: dialogue }));
                store.set(popupAtom, prev => ({ ...prev, visible: false }));
            }
        }
    });


    npc.onCollideEnd("player", () => {
        store.set(popupAtom, prev => ({ ...prev, visible: false }));
    });
}