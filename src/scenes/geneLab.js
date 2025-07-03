import {
    store,
    geneLabAtom,
    popupAtom,
    playerInfoAtom
} from '../store';

import { makeMap } from '../utils/map';

export default function geneLab(k) {
    k.scene("gene lab", async ({ player, gameState }) => {

        makeMap(k, "gene lab", { gameState, spriteName: "gene-lab", center: true });

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

        store.set(geneLabAtom, prev => ({
            ...prev,
            visible: true,
            handleExit: () => {
                store.set(geneLabAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                k.go("main lobby", { gameState, player, prevRoom: "gene lab" });
            },
            options: store.get(geneLabAtom).skills.map(skill => ({
                name: skill.name,
                description: skill.description,
                level: skill.level,
                button: {
                    onClick: () => {
                        store.set(geneLabAtom, prev => ({
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
                                action() {
                                    if (skill.name === "Faster Movement") {
                                        player.speed = 250;
                                    } else if (skill.name === "Increased Slide Damage") {
                                        player.slideDamage = 5;
                                    }
                                    
                                    player.passives[skill.name] = true;
                                    store.set(geneLabAtom, prev => ({
                                        ...prev,
                                        skills: prev.skills.filter(s => s.name !== skill.name)
                                    }));
                                }
                            }
                        });

                    },
                    disabled: player.body.level < skill.level,
                    name: "Learn",
                    icon: true
                }
            }))
        }));
    });
}