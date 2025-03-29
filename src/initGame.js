import makeKaplayCtx from './kaplayCtx';
import makePlayer from './entities/player';

import {
    makeMap,
    spawnObjects,
    makeBoundaries,
    makeObjectInteractions,
    orderByY
} from './utils';

import { GUNS } from './constants';

import { menuAtom, playerInfoAtom, store } from "./store";

export default function initGame() {
    // focus back on canvas when clicking on html elements
    window.addEventListener("click", () => document.getElementById('game').focus());

    const k = makeKaplayCtx();
    k.loadSprite("player", "./sprites/player.png", {
        sliceX: 8,
        sliceY: 30,
        anims: {
            "idle": 113,
            "walk": { from: 104, to: 107, loop: true, speed: 6 },
            "walk2": { from: 112, to: 115, loop: true, speed: 6 },
            "dash": { from: 152, to: 157, speed: 10 }
        }
    });

    k.loadSprite("pistol", "./sprites/weapons1.png", {
        sliceX: 8,
        sliceY: 25,
        anims: {
            "idle": 0,
            "firing": { from: 0, to: 2, loop: true, speed: GUNS["pistol"].animSpeed }
        }
    });

    k.loadSprite("smg", "./sprites/weapons1.png", {
        sliceX: 8,
        sliceY: 25,
        anims: {
            "idle": 88,
            "firing": { from: 88, to: 90, loop: true, speed: GUNS["smg"].animSpeed }
        }
    });

    k.loadSprite("bullet", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 4
        }
    });

    k.loadSprite("crosshair", "./sprites/crosshairs.png", {
        sliceX: 12,
        sliceY: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("room", "./sprites/room.png");
    k.loadSprite("main lobby", "./sprites/main-lobby.png");
    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "bed" : {
            x: 240,
            y: 0,
            width: 48,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "chair" : {
            x: 224,
            y: 0,
            width: 16,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "desk" : {
            x: 208,
            y: 0,
            width: 16,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "pullup bar" : {
            x: 320,
            y: 224,
            width: 32,
            height: 16
        }
    });

    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "door" : {
            x: 256,
            y: 96,
            width: 32,
            height: 32
        }
    });

    k.setBackground(k.Color.fromHex("#131313"));

    k.scene("room", async ({ player, gameState }) => {
        const roomData = await (await fetch("./data/room.json")).json();
        const layers = roomData.layers;
        
        const map = makeMap(k, "room", gameState);

        spawnObjects(
            k,
            map, 
            { 
                layers, 
                player, 
                firstScene: gameState.firstScene["room"], 
                doors: ["main lobby"] 
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

    k.scene("main lobby", async ({ player, gameState }) => {

        const roomData = await (await fetch("./data/main-lobby.json")).json();
        const layers = roomData.layers;
        
        const map = makeMap(k, "main lobby", gameState);
        
        spawnObjects(
            k,
            map, 
            { 
                layers, 
                player, 
                doors: ["room"], 
                firstScene: gameState.firstScene["main lobby"]
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

    const player = makePlayer(k, k.vec2(0));

    const gameState = k.make([
        "gameState",
        {
            day: 1,
            firstScene: {
                "room": true,
                "main lobby": true
            }
        }
    ]);

    gameState.onUpdate(() => {
        if (k.isKeyPressed("escape") && !player.inDialogue) {
            // set data to show in menu
            if (!store.get(menuAtom).visible) {
                store.set(
                    menuAtom, 
                    prev => ({
                         ...prev, 
                         buttons: [
                            { name: "Resume", onClick: () => {
                                store.set(menuAtom, prev => ({ ...prev, visible: false}));
                                k.query({
                                    include: "*",
                                    exclude: "gameState"
                                }).forEach(e => e.paused = false);
                            }}, 
                            { 
                                name: "Player Info", 
                                onClick: () => store.set(playerInfoAtom, {
                                    visible: true,
                                    data: {
                                        guns: player.guns, 
                                        exp: { 
                                            mind: player.mind, 
                                            body: player.body, 
                                            weaponLvl: player.weaponLvl 
                                        }
                                    } 
                                }) 
                            }, 
                            { name: "Exit to Main Menu" }
                        ] 
                    })
                );
            } else {
                // reset menu after closing
                store.set(playerInfoAtom, prev => ({
                    ...prev,
                    visible: false
                }));
            }

            // toggle game pause and menu visibility

            store.set(menuAtom, prev => ({ ...prev, visible: !store.get(menuAtom).visible }));

            k.query({
                include: "*",
                exclude: "gameState"
            }).forEach(e => e.paused = store.get(menuAtom).visible);
        }

    });
    
    k.go("room", { player, gameState });
}