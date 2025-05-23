import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from '../utils/map';

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
                    firstScene: gameState.firstScene["room"], 
                    gameState,
                    tileset: "ship-tileset"
                });
            
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
                            doors: ["main lobby"] 
                        }
                    );
                }
            }
        });
}