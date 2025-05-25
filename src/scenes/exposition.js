import { store, dialogueAtom } from "../store";

export default function exposition(k) {
    k.scene("exposition", ({ player, gameState }) => {
        const text = [
                "Humanity has sent a deep-space research vessel — your ship — to a distant, newly discovered planet believed to be capable of supporting life.",
                "The crew’s mission: terraform and prepare the planet for colonization.",
                "However the planet is not uninhabited. Dangerous alien lifeforms begin to resist.",
                "As part of the Security and Containment Unit, your job is to clear zones for engineers and scientists to safely operate."
            ];

        store.set(dialogueAtom, prev => ({
            ...prev, text
        }));
        store.set(dialogueAtom, prev => ({ ...prev, visible: true }));

        k.onKeyPress("e", () => {
            if (store.get(dialogueAtom).skip) {
                store.set(dialogueAtom, prev => ({ ...prev, skip: false }));
                if (store.get(dialogueAtom).index === text.length - 1) {
                    store.set(dialogueAtom, prev => ({ ...prev, visible: false, index: 0 }));
                    k.go("room", { player, gameState });
                } else {
                    store.set(dialogueAtom, prev => ({ ...prev, index: prev.index + 1 }));
                }
            } else {
                store.set(dialogueAtom, prev => ({ ...prev, skip: true }));
            }
        });

    });
}