import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeRooms,
    makeEntrances,
    makeObjectInteractions,
    orderByY
} from '../utils/map';

export default function boss2(k) {
    k.scene("3-boss", async ({ player, gameState }) => {
        player.setOnMission(true);
        const roomData = await (await fetch("data/3-boss.json")).json();
        const layers = roomData.layers;

        const map = makeMap(k, "3-boss", { gameState, spriteName: "level3BossGround" });

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