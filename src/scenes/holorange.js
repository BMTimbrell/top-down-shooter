import {
    store,
    holorangeAtom,
    popupAtom,
} from '../store';

import { makeMap } from '../utils/map';

export default function holorange(k) {
    k.scene("holorange", async ({ player, gameState }) => {

        makeMap(k, "holorange", { gameState, spriteName: "holorange", center: true });

        store.set(popupAtom, prev => ({
            ...prev,
            visible: false
        }));


        store.set(holorangeAtom, prev => ({
            ...prev,
            visible: true,
            handleExit: () => {
                store.set(holorangeAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                k.go("main lobby", { gameState, player, prevRoom: "holorange" });
            },
            options: [
                {
                    name: "Target Practice",
                    description: "Improve your combat skills.",
                    button: {
                        onClick: () => {
                            store.set(holorangeAtom, prev => ({
                                ...prev,
                                visible: false
                            }));

                            k.go("timeTransition", {
                                player,
                                gameState,
                                event: {
                                    text: [
                                        "As you shoot at targets, you feel more confident in your combat skills."
                                    ],
                                    exp: {
                                        type: "weapon",
                                        amount: 10
                                    }
                                },
                            });

                        },
                        disabled: false,
                        name: "Shoot Targets",
                        icon: true
                    }
                }
            ]
        }));
    });
}