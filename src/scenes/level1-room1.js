import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from '../utils';

export default function level1Room1(k) {
    k.scene("1-1", async ({ player, gameState }) => {

        player.setOnMission(true);

        const roomData = await (await fetch("./data/level1-room1.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "1-1", { layers, gameState });

        spawnObjects(
            k,
            map,
            {
                layers,
                player,
                firstScene: gameState.firstScene["1-1"],
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

    });
}