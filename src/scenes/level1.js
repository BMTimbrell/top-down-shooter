import { infoBoxAtom, store } from '../store';
import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from '../utils';

export default function level1(k) {
    k.scene("level1", async ({ player, gameState }) => {

        player.setOnMission(true);

        const roomData = await (await fetch("./data/level1.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "level1", { layers, gameState });

        spawnObjects(
            k,
            map,
            {
                layers,
                player,
                firstScene: gameState.firstScene["level1"],
                tileset: {
                    name: "rocky-tileset",
                    width: 9,
                    height: 11
                }
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

        k.wait(0.1, () => {
            store.set(infoBoxAtom, prev => ({
                ...prev,
                visible: true,
                text: "W, A, S, D to move. Left click to shoot."
            }));

        });

    });
}