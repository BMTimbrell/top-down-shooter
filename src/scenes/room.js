import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from '../utils/map';
import { spendTime } from '../utils/daySystem';
import { store, infoBoxAtom, promptAtom } from '../store';

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
            if (!skillExplanations["pullup bar"]) {
                if (player.isColliding(k.get("check pullup bar")[0]) && k.isKeyPressed("e")) {
                    store.set(promptAtom, prev => ({
                        ...prev,
                        visible: true,
                        text: "Do pullups?",
                        onClick: () => {
                            player.body.exp += 5;
                            spendTime(gameState);
                            store.set(promptAtom, prev => ({
                                ...prev,
                                visible: false
                            }));
                        }
                    }));
                }
            }
        });
    });
}