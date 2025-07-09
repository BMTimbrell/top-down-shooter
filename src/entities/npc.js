import {
    store,
    popupAtom,
    dialogueAtom
} from '../store';

export default function makeNpc(k, { sprite, pos, dialogue = [] }) {
    const npc = k.add([
        k.sprite(sprite, { anim: "idle" }),
        k.pos(pos),
        k.anchor("center"),
        k.scale(4),
        k.area()
    ]);

    npc.onCollideUpdate("player", player => {
        const popupPos = {
            x: npc.screenPos().x - 40,
            y: npc.screenPos().y - 60
        };

        // show popup if not showing dialogue box
        if (!player.inDialogue) {
            store.set(
                popupAtom,
                prev => ({
                    ...prev,
                    visible: true,
                    text: {
                        action: "Talk",
                        name: "",
                        key: "E"
                    },
                    pos: popupPos
                })
            );
        }

        if (player.inDialogue && npc.curAnim() !== "talk") {
            npc.play("talk");
        } else if (!player.inDialogue) npc.play("idle");

        if (k.isKeyPressed("e")) {

            if (player.inDialogue) {
                if (store.get(dialogueAtom).skip) {
                    store.set(dialogueAtom, prev => ({ ...prev, skip: false }));
                    if (store.get(dialogueAtom).index === dialogue.length - 1) {
                        store.set(dialogueAtom, prev => ({ ...prev, visible: false, index: 0 }));
                        player.inDialogue = false;
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