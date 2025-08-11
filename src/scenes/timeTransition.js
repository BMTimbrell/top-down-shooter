import { store, dialogueAtom, popupAtom, gameInfoAtom } from "../store";
import makeFloatingText from "../utils/floatingText";
import { spendTime } from '../utils/daySystem';

export default function timeTransition(k) {
    k.scene("timeTransition", async ({ player, gameState, event }) => {
        const text = [...event.text || "Time passes..."];
        store.set(popupAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(dialogueAtom, prev => ({
            ...prev,
            text,
            visible: true,
            skip: false
        }));

        const pressEvent = k.onKeyPress("e", async () => {
            if (store.get(dialogueAtom).skip) {
                store.set(dialogueAtom, prev => ({ ...prev, skip: false }));
                if (store.get(dialogueAtom).index === text.length - 1) {
                    pressEvent.cancel();
                    store.set(dialogueAtom, prev => ({ ...prev, visible: false, index: 0 }));

                    if (event.exp) {
                        let bonusExp = 0;
                        if (event.exp.type === "body" && player.improvedWorkouts) bonusExp = 5;

                        makeFloatingText(k, k.center(), `+${event.exp.amount + bonusExp} ${event.exp.type} xp`);

                        const maxExp = player[event.exp.type].maxExp;
                        const exp = event.exp.amount + bonusExp;
                        const type = event.exp.type;

                        player[type].exp += exp;
                        const playerExp = player[type].exp;

                        if (playerExp >= maxExp) {

                            if (player[type].level < 3) {
                                player[type].exp = playerExp - maxExp;
                                player[type].level += 1;

                                await k.wait(0.5, () => {
                                    makeFloatingText(k, k.center(), 'Level Up!');

                                    if (type === "body") {
                                        player.setMaxHP(player.maxHP() + 1);
                                        player.heal(1);

                                        store.set(gameInfoAtom, prev => ({
                                            ...prev,
                                            maxHealth: player.maxHP()
                                        }));
                                    } else if (type === "weapon") {
                                        player.reloadCd -= 0.25;
                                    }
                                });
                            }

                            if (player[type].level === 3) {
                                player[type].exp = maxExp;
                            } else {
                                player[type].maxExp = 100;
                            }

                        }
                    }

                    event?.action && event.action(player);

                    k.wait(0.75, () => {
                        spendTime(gameState, player);
                        k.go("room", { player, gameState });
                    });
                } else {
                    store.set(dialogueAtom, prev => ({ ...prev, index: prev.index + 1 }));
                }
            } else {
                store.set(dialogueAtom, prev => ({ ...prev, skip: true }));
            }
        });

    });
}