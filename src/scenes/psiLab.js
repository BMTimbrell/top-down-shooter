import {
    store,
    psiLabAtom,
    popupAtom,
    playerInfoAtom
} from '../store';

import { makeMap } from '../utils/map';

export default function psiLab(k) {
    k.scene("psi lab", async ({ player, gameState }) => {

        makeMap(k, "psi lab", { gameState, spriteName: "psi-lab", center: true });

        store.set(popupAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(playerInfoAtom, prev => ({
            ...prev,
            data: {
                ...prev.data,
                exp: {
                    mind: player.mind,
                    body: player.body,
                    weapon: player.weapon
                }
            }
        }));

        store.set(psiLabAtom, prev => ({
            ...prev,
            visible: true,
            handleExit: () => {
                store.set(psiLabAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                k.go("main lobby", { gameState, player, prevRoom: "psi lab" });
            },
            options: store.get(psiLabAtom).skills.map(skill => ({
                name: skill.name,
                description: skill.description,
                level: skill.level,
                button: {
                    onClick: () => {
                            store.set(psiLabAtom, prev => ({
                                ...prev,
                                visible: false
                            }));

                            k.go("timeTransition", {
                                player,
                                gameState,
                                event: {
                                    text: [
                                        `You learned ${skill.name}.`
                                    ],
                                    action: () => {
                                        if (skill.name === "Stronger Psi Beam") {
                                            player.passives["Stronger Psi Beam"] = true;
                                        } else {
                                            player.abilities.find(a => a.name === skill.name).active = true;
                                            store.set(psiLabAtom, prev => ({
                                                ...prev,
                                                skills: prev.skills.filter(s => s.name !== skill.name)
                                            }));
                                            store.set(playerInfoAtom, prev => ({
                                                ...prev,
                                                data: {
                                                    ...prev.data,
                                                    abilities: player.abilities.filter(a => a.active)
                                                }
                                            }));
                                        }
                                    }
                                }
                            });

                        },
                        disabled: player.mind.level < skill.level,
                        name: "Learn",
                        icon: true
                    }
            }))
        }));
    });
}