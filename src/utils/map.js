import {
    store,
    popupAtom,
    dialogueAtom,
} from '../store';
import makeGun from "../entities/gun";
import { MAP_SCALE, TILE_SIZE, CELL_SIZE, ENEMY_FACTORIES } from '../constants';

export function makeMap(k, name, { layers, gameState, spriteName }) {
    k.add(gameState);

    // reset popup
    store.set(popupAtom, prev => ({ ...prev, visible: false }));

    const mapWidth = layers.find(e => e.name === "Ground")?.width || 0;
    const mapHeight = layers.find(e => e.name === "Ground")?.height || 0;

    const map = k.add([
        k.sprite(spriteName),
        k.pos(k.vec2(0, 0)),
        // k.pos(k.vec2(k.center())),
        k.scale(MAP_SCALE),
        name
    ]);

    // map.width = mapWidth * CELL_SIZE;
    // map.height = mapHeight * CELL_SIZE;

    // center offsets
    // map.pos = map.pos.sub(map.width / 2, map.height / 2);

    return map;
}

export function scaleToMap(k, map, entity, { center = false } = {}) {

    return k.vec2(
        map.pos.x + (entity.x * MAP_SCALE),
        map.pos.y + (entity.y * MAP_SCALE)
    );
}

export function spawnObjects(
    k,
    map,
    {
        layers,
        player,
        tileset,
        gameState = null
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
        // draw all tiles
        if (layer.name !== "Ground" && layer?.data) {
            layer.data.forEach((e, index) => {
                if (e === 0) return;
                const spriteName = tileset + layer.name + e;
                const pos = { x: index % layer.width * 16, y: Math.floor(index / layer.width) * 16 };

                const tile = k.add([
                    k.sprite(spriteName.toLowerCase(), { anim: "idle" }),
                    k.scale(MAP_SCALE),
                    k.anchor("center"),
                    k.pos(scaleToMap(k, map, pos)),
                    k.offscreen({ hide: true }),
                    layer.name
                ]);

                tile.pos = tile.pos.add(k.vec2((tile.width / 2) * MAP_SCALE, (tile.height / 2) * MAP_SCALE));

            });
        }

        if (layer.name === "spawn points") {
            for (const entity of layer.objects) {
                if (entity.name === "player") {
                    player.pos = scaleToMap(k, map, entity);
                    k.add(player);
                } else if (entity.name.includes("enemy")) {
                    const spawned = entity?.properties?.find(e => e.name === "spawned")?.value;
                    const reinforcement = entity.name.includes("reinforcement");
                    const name = entity.name.replace("enemy", "").replace(" reinforcement", "").toLowerCase();
                    const roomId = entity?.properties?.find(e => e.name === "room")?.value;

                    if (reinforcement) {
                        gameState.reinforcements.push({
                            name,
                            roomId,
                            pos: scaleToMap(k, map, entity)
                        });
                    } else if (!spawned) {
                        gameState.pendingSpawns.push({
                            name,
                            roomId,
                            pos: scaleToMap(k, map, entity)
                        });
                    } else {
                        const factory = ENEMY_FACTORIES[name] || ENEMY_FACTORIES["default"];
                        factory(k, name, { pos: scaleToMap(k, map, entity), roomId });
                    }

                } else {
                    const boundary = entity?.properties?.find(e => e.name === "boundary")?.value;
                    const roomIds = entity?.properties?.find(e => e.name === "rooms")?.value;
                    const animation = entity.name === "portal" ? "idle" : ""

                    k.add([
                        k.sprite(entity.name, { anim: animation }),
                        k.anchor("center"),
                        k.scale(MAP_SCALE),
                        k.pos(scaleToMap(k, map, entity)),
                        k.offscreen({ hide: true }),
                        entity.name,
                        ...boundary ? [
                            k.area({
                                shape: new k.Rect(
                                    k.vec2(0),
                                    JSON.parse(boundary).width,
                                    JSON.parse(boundary).height
                                ),

                            }),
                            k.body({ isStatic: true })
                        ] : "",
                        roomIds ? { roomIds } : ""
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
        k.add([
            k.area({
                shape: new k.Rect(k.vec2(0), boundary.width * MAP_SCALE, boundary.height * MAP_SCALE)
            }),
            k.body({ isStatic: true }),
            k.pos(scaleToMap(k, map, boundary, { center: false })),
            k.offscreen({ hide: true }),
            "boundary"
        ]);
    }
}

export function makeRooms(k, map, layer) {
    for (const room of layer.objects) {
        k.add([
            k.area({
                shape: new k.Rect(k.vec2(0), room.width * MAP_SCALE, room.height * MAP_SCALE)
            }),
            k.pos(scaleToMap(k, map, room, { center: false })),
            k.offscreen({ hide: true }),
            "room",
            {
                rId: room.name
            }
        ]);
    }
}

export function makeEntrances(k, map, layer) {
    for (const entrance of layer.objects) {
        k.add([
            k.area({
                shape: new k.Rect(k.vec2(0), entrance.width * MAP_SCALE, entrance.height * MAP_SCALE)
            }),
            k.pos(scaleToMap(k, map, entrance, { center: false })),
            "entrance",
            {
                rId: entrance.name
            }
        ]);
    }
}

export function makeObjectInteractions(k, map, { layer, player, gameState, doors }) {
    for (const entity of layer.objects) {
        if (entity.name) {
            k.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), entity.width * MAP_SCALE, entity.height * MAP_SCALE)
                }),
                k.pos(scaleToMap(k, map, entity, { center: false })),
                entity.name
            ]);

            const name = entity.properties.find(e => e.name === "name").value;
            const destination = entity.properties?.find(e => e.name === "destination")?.value || null;
            const action = entity.type === "door" ? "Go To" : "Check";

            k.onCollideUpdate("player", entity.name, () => {
                // show popup if not showing dialogue box
                if (!player.inDialogue) {
                    store.set(
                        popupAtom,
                        prev => ({
                            ...prev,
                            visible: true,
                            text: {
                                action,
                                name: destination ? destination: name,
                                key: "E"
                            },
                            pos: {
                                x: k.get(name)[0].screenPos().x,
                                y: k.get(name)[0].screenPos().y
                            }
                        })
                    );
                }

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
                                store.set(dialogueAtom, prev => ({ ...prev, index: prev.index + 1 }));
                            }
                        } else {
                            store.set(dialogueAtom, prev => ({ ...prev, skip: true }));
                        }
                    } else if (description) {
                        player.inDialogue = true;

                        store.set(dialogueAtom, prev => ({ ...prev, text: description }));
                        store.set(popupAtom, prev => ({ ...prev, visible: false }));
                        store.set(dialogueAtom, prev => ({ ...prev, visible: true }));
                    } else if (action === "Go To") {
                        const sceneName = k.getSceneName();
                        const scene = entity.properties.find(e => e.name === "scene").value;

                        if (gameState.firstScene[sceneName]) {
                            gameState.firstScene[sceneName] = false;
                        }

                        gameState.reinforcements = [];
                        gameState.pendingSpawns = [];
                        k.go(scene, { player, gameState });
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
    const exclude = ["Ground", "crosshair", "text", "explosion"];

    k.onUpdate(() => {
        k.get('*').filter(e => !exclude.some(e2 => e.is(e2)) && Object.hasOwn(e, "pos")).
            toSorted((a, b) => a.pos.y - b.pos.y).
            forEach((e, index) => e.z = index + 1);
    });
}