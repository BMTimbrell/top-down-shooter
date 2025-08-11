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

export default function level2(k) {
    k.scene("level2", async ({ player, gameState }) => {

        player.setOnMission(true);

        const roomData = await (await fetch("data/level2.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "level2", { gameState, spriteName: "level2Ground" });

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
                gameState,
                tileset: "cave-tileset"
            }
        );

        // draw in order of y coordinate
        orderByY(k);

    });
}