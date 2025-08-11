import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from '../utils/map';

export default function mainLobby(k) {
    k.scene("main lobby", async ({ player, gameState, prevRoom = null }) => {

        const roomData = await (await fetch("data/main-lobby.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "main lobby", { gameState, spriteName: "mainLobby" }); 

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

        spawnObjects(
            k,
            map,
            {
                layers,
                player,
                gameState,
                tileset: "ship-tileset",
                prevRoom
            }
        );

        // draw in order of y coordinate
        orderByY(k);
    });
}