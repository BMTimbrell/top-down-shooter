import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from '../utils';

export default function room(k) {
    k.scene("room", async ({ player, gameState }) => {
            const roomData = await (await fetch("./data/room.json")).json();
            const layers = roomData.layers;
            
            const map = makeMap(k, "room", { gameState, layers });
    
            spawnObjects(
                k,
                map, 
                { 
                    layers, 
                    player, 
                    firstScene: gameState.firstScene["room"], 
                    doors: ["main lobby"] ,
                    tileset: {
                        name: "Tileset",
                        width: 31,
                        height: 16
                    }
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