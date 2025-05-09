import { infoBoxAtom, store } from '../store';
import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeRooms,
    makeEntrances,
    makeObjectInteractions,
    orderByY
} from '../utils/map';

export default function level1(k) {
    k.scene("level1", async ({ player, gameState }) => {

        player.setOnMission(true);

        const roomData = await (await fetch("../data/level1.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "level1", { layers, gameState });

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
            } else if (layer.name === "rooms") {
                makeRooms(k, map, layer);
            } else if (layer.name === "entrances") {
                makeEntrances(k, map, layer);
            }
        }

        spawnObjects(
            k,
            map,
            {
                layers,
                player,
                firstScene: gameState.firstScene["level1"],
                gameState
            }
        );

        // draw in order of y coordinate
        orderByY(k);

        k.wait(0.1, () => {
            store.set(infoBoxAtom, prev => ({
                ...prev,
                visible: true,
                text: "W, A, S, D to move. Left click to shoot."
            }));

        });

    });
}