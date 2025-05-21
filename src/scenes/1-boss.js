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

export default function boss1(k) {
    k.scene("1-boss", async ({ player, gameState }) => {
        player.setOnMission(true);
        const roomData = await (await fetch("../data/1-boss.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "1-boss", { layers, gameState, spriteName: "level1BossGround" });

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
    });
}