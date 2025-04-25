import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from '../utils/map';

export default function mainLobby(k) {
    k.scene("main lobby", async ({ player, gameState }) => {

        const roomData = await (await fetch("./data/main-lobby.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "main lobby", { layers, gameState });

        spawnObjects(
            k,
            map,
            {
                layers,
                player,
                doors: ["room"],
                firstScene: gameState.firstScene["main lobby"],
                tileset: {
                    name: "Tileset",
                    width: 31,
                    height: 16
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
                        gameState,
                        doors: ["room"]
                    }
                );
            }
        }
    });
}