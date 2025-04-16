import { 
    store, 
    popupAtom,
    dialogueAtom,
} from './store';
import makeGun from "./entities/gun";
import { MAP_SCALE } from './constants';

export function makeMap(k, name, { layers, gameState }) {
    k.add(gameState);

    // reset popup
    store.set(popupAtom, prev => ({ ...prev, visible: false }));

    const mapWidth = layers.find(e => e.name === "ground")?.width || 0;
    const mapHeight = layers.find(e => e.name === "ground")?.height || 0;
    const map = k.add([
        k.pos(k.vec2(k.center())),
        k.scale(MAP_SCALE),
        name
    ]);
    map.width = mapWidth * MAP_SCALE;
    map.height = mapHeight * MAP_SCALE;

    // center offset
    map.pos = map.pos.sub(map.width / 2 * MAP_SCALE, map.height / 2 * MAP_SCALE);

    return map;
}

export function scaleToMap(k, map, entity, { scale = MAP_SCALE, mapChild = false } = {}) {
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

export function spawnObjects(
    k, 
    map, 
    { 
        layers, 
        player, 
        firstScene, 
        doors = [], 
        tileset
    }
) {
    const crosshair = k.make([
        k.sprite("crosshair", { anim: "idle" }),
        k.anchor("center"),
        k.scale(3),
        k.pos(k.toWorld(k.mousePos())),
        "crosshair",
        k.z(999999999999999)
    ]);

    for (const layer of layers) {
        if (layer?.data) {
            layer.data.forEach((e, index) => {
                if (e === 0) return;
                const spriteName = layer.name;
                const pos = { x: index % layer.width * 16, y: Math.floor(index / layer.width) * 16 };

                k.loadSprite(spriteName, `./sprites/${tileset.name}.png`, {
                    sliceX: tileset.width,
                    sliceY: tileset.height,
                    anims: {
                        "idle": e - 1 // first GID is 1
                    }
                });
                k.add([
                    k.sprite(spriteName, { anim: "idle" }),
                    k.scale(MAP_SCALE),
                    k.pos(scaleToMap(k, map, pos)),
                    spriteName
                ]);
            });
        }

        if (layer.name === "spawn points") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    const pos = firstScene || map.tags[1] !== "room" ? entity : k.vec2(entity.x, entity.y - 40);
                    player.pos = scaleToMap(k, map, pos);
                    k.add(player);
                } else {
                    const boundary = entity?.properties?.find(e => e.name === "boundary")?.value;
 
                    k.add([
                        k.sprite(doors.some(e => e === entity.name) ? "door" : entity.name),
                        k.scale(MAP_SCALE),
                        k.pos(scaleToMap(k, map, entity)),
                        k.offscreen({ hide: true }),
                        entity.name,
                        ... boundary ? [
                            k.area({
                                shape: new k.Rect(
                                    k.vec2(0), 
                                    JSON.parse(boundary).width, 
                                    JSON.parse(boundary).height
                                ),
                                
                            }),
                            k.body({ isStatic: true })
                        ] : ""
                    ]);
                }
            }
        }
    }

    if (player.onMission) {
        k.setCursor("none");
        k.add(crosshair);
        makeGun(k, player, player.guns[player.gunIndex]);
        crosshair.onUpdate(() => crosshair.pos = k.toWorld(k.mousePos()));
    }
}

export function makeBoundaries(k, map, layer) {
    for (const boundary of layer.objects) {
        map.add([
            k.area({
                shape: new k.Rect(k.vec2(0), boundary.width, boundary.height)
            }),
            k.body({ isStatic: true }),
            k.pos(scaleToMap(k, map, boundary, { scale: 1, mapChild: true })),
            "boundary"
        ]);
    }
}

export function makeObjectInteractions(k, map, { layer, player, gameState, doors }) {
    for (const entity of layer.objects) {
        if (entity.name) {
            map.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), entity.width, entity.height)
                }),
                k.pos(scaleToMap(k, map, entity, { scale: 1, mapChild: true })),
                entity.name
            ]);

            const name = entity.name.substring(6);
            const sceneName = k.getSceneName();
            
            k.onCollideUpdate("player", entity.name, () => {
                // show popup if not showing dialogue box
                if (!player.inDialogue) {
                    store.set(popupAtom, prev => ({ ...prev, visible: true }));
                    store.set(
                        popupAtom, 
                        prev => ({ 
                            ...prev, 
                            text: {
                                action: doors.some(e => e === name) ? "Go To" : "Check", 
                                name, 
                                key: "E" 
                            }
                        })
                    );
                }
                
                // set position for popup
                store.set(
                    popupAtom, 
                    prev => ({ ...prev, pos: { x: k.get(name)[0].screenPos().x, y: k.get(name)[0].screenPos().y }})
                );

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
                            store.set(popupAtom, prev => ({ ...prev, visible: false }));
                            store.set(dialogueAtom, prev => ({ ...prev, visible: true }));
                    } else if (doors.some(e => e === name)) {
                        const sceneName = k.getSceneName();
                        if (gameState.firstScene[sceneName]) {
                            gameState.firstScene[sceneName] = false;
                        }
                        k.go(name, { player, gameState });
                    }
                }
            });
            
            k.onCollideEnd("player", entity.name, () => {
                store.set(popupAtom, prev => ({ ...prev, visible: false }));
            });
        }
    }
}

export function orderByY(k) {
    const exclude = ["Ground", "crosshair"];

    k.onUpdate(() => {
        k.query([]).filter(e => !exclude.some(e2 => e.is(e2)) && Object.hasOwn(e, "pos")).
            toSorted((a, b) => a.pos.y - b.pos.y).
            forEach((e, index) => e.z = index + 1);
    });
}