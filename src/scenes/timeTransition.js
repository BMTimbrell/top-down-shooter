import { store, dialogueAtom, popupAtom } from "../store";
import makeFloatingText from "../utils/floatingText";
import { spendTime } from '../utils/daySystem';

export default function timeTransition(k) {
    k.scene("timeTransition", ({ player, gameState, event }) => {
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

        const pressEvent = k.onKeyPress("e", () => {
            if (store.get(dialogueAtom).skip) {
                store.set(dialogueAtom, prev => ({ ...prev, skip: false }));
                if (store.get(dialogueAtom).index === text.length - 1) {
                    pressEvent.cancel();
                    store.set(dialogueAtom, prev => ({ ...prev, visible: false, index: 0 }));

                    if (event.exp) {
                        let bonusExp = 0;
                        if (event.exp.type === "body" && player.improvedWorkouts) bonusExp = 5;

                        makeFloatingText(k, k.center(), `+${event.exp.amount + bonusExp} ${event.exp.type} xp`);
                        player[event.exp.type].exp += event.exp.amount + bonusExp;
                    }

                    event?.action && event.action();

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