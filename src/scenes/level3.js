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

export default function level3(k) {
    k.scene("level3", async ({ player, gameState }) => {

        player.setOnMission(true);

        const roomData = await (await fetch("data/level3.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "level3", { gameState, spriteName: "level3Ground" });

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
                tileset: null
            }
        );

        // draw in order of y coordinate
        orderByY(k);

    });
}