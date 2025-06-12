import {
    store,
    gymAtom,
    popupAtom,
} from '../store';

import { makeMap } from '../utils/map';

export default function gym(k) {
    k.scene("gym", async ({ player, gameState }) => {
        player.inDialogue = true;

        makeMap(k, "gym", { gameState, spriteName: "gym", center: true });

        store.set(popupAtom, prev => ({
            ...prev,
            visible: false
        }));


        store.set(gymAtom, prev => ({
            ...prev,
            visible: true,
            handleExit: () => {
                store.set(gymAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                k.go("main lobby", { gameState, player, prevRoom: "gym" });
            },
            options: [
                {
                    name: "Workout",
                    description: "Strengthen your body.",
                    button: {
                        onClick: () => {
                            store.set(gymAtom, prev => ({
                                ...prev,
                                visible: false
                            }));

                            k.go("timeTransition", {
                                player,
                                gameState,
                                event: {
                                    text: [
                                        "You complete your workout and feel much stronger."
                                    ],
                                    exp: {
                                        type: "body",
                                        amount: 10
                                    }
                                },
                            });

                        },
                        disabled: false,
                        name: "Start Workout",
                        icon: true
                    }
                }
            ]
        }));
    });
}