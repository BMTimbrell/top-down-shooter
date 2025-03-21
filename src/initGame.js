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

    function makeMap(name) {
        const map = k.add([
            k.sprite(name),
            k.pos(k.vec2(k.center())),
            k.scale(MAP_SCALE)
        ]);

        setCamScale();

        // center offset
        map.pos = map.pos.sub(map.width / 2 * MAP_SCALE, map.height / 2 * MAP_SCALE);

        return map;
    }

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

    function spawnObjects(map, { layers, player, doors }) {
        for (const layer of layers) {
            if (layer.name === "spawn points") {
                for (const entity of layer.objects) {
                    if (entity.name === "player") {
                        player.pos = scaleToMap(map, entity);
                        k.add(player);
                    } else {
                        k.add([
                            k.sprite(doors.some(e => e === entity.name) ? "door" : entity.name),
                            k.scale(MAP_SCALE),
                            k.pos(scaleToMap(map, entity)),
                            entity.name
                        ]);
                    }     
                }
            }
        }

        k.onResize(() => {
            setCamScale();
            const oldMapPos = map.pos;
            map.pos = k.vec2(k.center());
            // center offset
            map.pos = map.pos.sub(map.width / 2 * MAP_SCALE, map.height / 2 * MAP_SCALE);

            for (const layer of layers) {
                if (layer.name === "spawn points") {
                    for (const entity of layer.objects) {
                        if (entity.name === "player") {
                            player.pos = scaleToMap(map, player.pos.sub(oldMapPos).scale(1 / MAP_SCALE));
                        } else {
                            k.get(entity.name)[0].pos = scaleToMap(map, entity);
                        }
                    }
                }
            }
        });
    }

    function makeBoundaries(map, layer) {
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
    }

    function makeObjectInteractions(map, { layer, player, doors}) {
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
                            { action: doors.some(e => e === name) ? "Go To" : "Check", name, key: "E" }
                        );
                    }
                    
                    // set position for popup
                    const root = document.documentElement;
                    root.style.setProperty("--popup-x", k.get(name)[0].screenPos().x);
                    root.style.setProperty("--popup-y", k.get(name)[0].screenPos().y);
    
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
                                store.set(isPopupVisibleAtom, false);
                                store.set(dialogueAtom, prev => ({ ...prev, visible: true }));
                        } else if (doors.some(e => e === name)) {
                            k.shake();
                            k.wait(1, () => {
                                k.go(name, player);
                            });
                        }
                    }
                });
                
                player.onCollideEnd((entity.name, () => {
                    store.set(isPopupVisibleAtom, false);
                }));
            }
        }
    }

    function orderByY() {
        k.onUpdate(() => {
            k.get("*").filter(e => Object.hasOwn(e, "pos")).toSorted((a, b) => a.pos.y - b.pos.y).forEach((e, index) => e.z = index + 1);
        });
    }

    function setCamScale() {
        if (k.width() < 1000) {
            k.setCamScale(k.vec2(0.8));
            return;
        }

        k.setCamScale(k.vec2(1));
    }

    k.scene("room", async (opt) => {
        
        const roomData = await (await fetch("./data/room.json")).json();
        const layers = roomData.layers;
        
        const map = makeMap("room");

        const player = makePlayer(k, k.vec2(0));

        spawnObjects(map, { layers, player, doors: ["main lobby"] });
        
        // draw in order of y coordinate
        orderByY();

        for (const layer of layers) {
            if (layer.name === "boundaries") {
                makeBoundaries(map, layer);
            } else if (layer.name === "entity interactions") {
                makeObjectInteractions(map, { layer, player, doors: ["main lobby"] });
            }
        }
    });

    k.scene("main lobby", async player => {
        setCamScale();
        k.onResize(() => {
            setCamScale();
        });
        store.set(isPopupVisibleAtom, false);

        const roomData = await (await fetch("./data/main-lobby.json")).json();
        const layers = roomData.layers;
        
        const map = makeMap("main lobby");

        player.pos = k.vec2(0);

        k.add(player);

    });

    k.go("room");

    // makePlayer(k, k.vec2(k.center()));
}