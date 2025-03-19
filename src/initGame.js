import makeKaplayCtx from './kaplayCtx';
import makePlayer from './entities/player';
import { MAP_SCALE } from './constants';
import { 
    store, 
    isPopupVisibleAtom, 
    popupTextAtom, 
    dialogueAtom,
} from './store';

export default function initGame() {
    const k = makeKaplayCtx();
    k.loadSprite("player", "./sprites/player2.png", {
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
            "firing": { from: 0, to: 2, loop: true }
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
        "main lobby" : {
            x: 256,
            y: 96,
            width: 32,
            height: 32
        }
    });

    k.setBackground(k.Color.fromHex("#131313"));

    function scaleToMap(map, entity, { scale = MAP_SCALE, mapChild = false } = {}) {
        // child of map object has positioning based on map pos
        const startPos = {
            x: !mapChild ? map.pos.x : 0,
            y: !mapChild ? map.pos.y : 0
        }
        return k.vec2(
            startPos.x + (entity.x * scale), 
            startPos.y + (entity.y * scale)
        );
    }

    k.scene("room", async (opt) => {
        
        const roomData = await (await fetch("./data/room.json")).json();
        const layers = roomData.layers;
        
        const map = k.add([
            k.sprite("room"),
            k.pos(k.vec2(k.center())),
            k.scale(MAP_SCALE)
        ]);

        // center offset
        map.pos = map.pos.sub(map.width / 2 * MAP_SCALE, map.height / 2 * MAP_SCALE);

        const player = makePlayer(k, k.vec2(0));
        for (const layer of layers) {
            if (layer.name === "spawn points") {
                for (const entity of layer.objects) {
                    if (entity.name === "player") {
                        player.pos = scaleToMap(map, entity);
                        k.add(player);
                    } else {
                        k.add([
                            k.sprite(entity.name),
                            k.scale(MAP_SCALE),
                            k.pos(scaleToMap(map, entity)),
                            entity.name
                        ]);
                    }     
                }
            }
        }
        
        // draw in order of y coordinate
        k.onUpdate(() => {
            k.get("*").filter(e => Object.hasOwn(e, "pos")).toSorted((a, b) => a.pos.y - b.pos.y).forEach((e, index) => e.z = index + 1);
        });

        for (const layer of layers) {
            if (layer.name === "boundaries") {
                for (const boundary of layer.objects) {
                    map.add([
                        k.area({
                            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
                        }),
                        k.body({ isStatic: true }),
                        k.pos(scaleToMap(map, boundary, { scale: 1, mapChild: true })),
                        boundary.name
                    ]);
                }
            } else if (layer.name === "entity interactions") {
                for (const entity of layer.objects) {
                    if (entity.name) {
                        map.add([
                            k.area({
                                shape: new k.Rect(k.vec2(0), entity.width, entity.height)
                            }),
                            k.pos(scaleToMap(map, entity, { scale: 1, mapChild: true })),
                            entity.name
                        ]);

                        const name = entity.name.substring(6);
                        
                        player.onCollideUpdate(entity.name, () => {
                            // show popup if not showing dialogue box
                            if (!player.inDialogue) {
                                store.set(isPopupVisibleAtom, true);
                                store.set(
                                    popupTextAtom, 
                                    { action: name === "main lobby" ? "Go To" : "Check", name, key: "E" }
                                );
                            }
                            
                            // set position for popup
                            const root = document.documentElement;
                            root.style.setProperty("--popup-x", k.get(name)[0].pos.x);
                            root.style.setProperty("--popup-y", k.get(name)[0].pos.y);

                            // dialogue
                            if (k.isKeyPressed("e")) {
                                let description = entity?.properties?.find(e => e.name === "description")?.value?.split("\n");

                                if (player.inDialogue) {
                                    if (store.get(dialogueAtom).skip) {
                                        store.set(dialogueAtom, prev => ({ ...prev, skip: false }));
                                        if (store.get(dialogueAtom).index === description.length - 1) {
                                            store.set(dialogueAtom, prev => ({ ...prev, visible: false, index: 0 }));
                                            player.inDialogue = false;
                                        } else {
                                            store.set(dialogueAtom, prev => ({ ...prev, index: prev.index + 1}));
                                        }
                                    } else {
                                        store.set(dialogueAtom, prev => ({ ...prev, skip: true }));
                                    }
                                } else if (description) {
                                        player.inDialogue = true;

                                        store.set(dialogueAtom, prev => ({ ...prev, text: description }));
                                        const dialogue = roomData.layers.find(e => e.name === "dialogue").objects[0];
                                        const dialoguePos = scaleToMap(map, dialogue);
        
                                        root.style.setProperty("--dialogue-x", dialoguePos.x);
                                        root.style.setProperty("--dialogue-y", dialoguePos.y);
                                        root.style.setProperty("--dialogue-width", (dialogue.width) * MAP_SCALE);
        
                                        store.set(isPopupVisibleAtom, false);
                                        store.set(dialogueAtom, prev => ({ ...prev, visible: true }));
                                }
                            }
                        });
                        
                        player.onCollideEnd((entity.name, () => {
                            store.set(isPopupVisibleAtom, false);
                        }));
                    }
                }
            }
        }
    });

    k.go("room");

    makePlayer(k, k.vec2(k.center()));
}