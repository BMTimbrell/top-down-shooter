import { DROP_OFFSET, GUNS, ENEMY_FACTORIES } from '../constants';
import { popupAtom, gameInfoAtom, menuAtom, playerInfoAtom, infoBoxAtom, store } from "../store";
import { hasOverlap, castRay } from "../utils/collision";
import makeGun from "./gun";
import makeGunDrop from './gunDrop';
import makeFloatingText from '../utils/floatingText';

export default function makePlayer(k, posVec2) {

    const player = k.make([
        k.sprite("player", { anim: "idle" }),
        k.scale(4),
        k.anchor(k.vec2(0, 0.6)),
        k.area({
            shape: new k.Rect(k.vec2(0, 5), 15, 19)
        }),
        k.body(),
        k.pos(posVec2),
        k.timer(),
        "player",
        "pausable",
        k.health(4, 4),
        {
            speed: 200,
            direction: k.vec2(0),
            directionVector: k.vec2(0),
            dashJustStarted: false,
            dashing: false,
            dashCd: 2.5,
            dashHitEnemies: new Set(),
            reloadCd: 1.5,
            dashDamage: 2.5,
            dashOnCd: false,
            dashSpeed: 500,
            dashTimer: 0,
            dashDuration: 0.75,
            onMission: false,
            inDialogue: false,
            reloading: false,
            invincible: false,
            guns: [
                { name: "pistol", ammo: GUNS.pistol.maxAmmo, ...GUNS.pistol, clip: GUNS.pistol.clipSize },
                // { name: "assault rifle", ammo: GUNS["assault rifle"].maxAmmo, ...GUNS["assault rifle"], clip: GUNS["assault rifle"].clipSize },
                // { name: "minigun", ammo: GUNS.minigun.maxAmmo, ...GUNS.minigun, clip: GUNS.minigun.clipSize }
            ],
            gunIndex: 0,
            maxGuns: 3,
            mind: { level: 1, exp: 0, maxExp: 50 },
            body: { level: 1, exp: 0, maxExp: 50 },
            weapon: { level: 1, exp: 0, maxExp: 50 },
            books: [],
            electronics: [],
            passives: {
                "Increased Slide Damage": false,
                "Faster Movement": false,
                "Improved Sleep": false,
                "Improved Slide": false,
                "Rapid Recovery": false
            },
            abilities: [
                {
                    name: "Psi Beam",
                    active: false,
                    cooldown: 1,
                    baseCooldown: 1,
                    rechargeRate: 0.01,
                    key: "space",
                    imgSrc: "sprites/psi-beam-icon.png"
                },
                {
                    name: "Force Field",
                    active: false,
                    cooldown: 1,
                    baseCooldown: 1,
                    rechargeRate: 0.005,
                    key: "q",
                    imgSrc: "sprites/force-field-icon.png"
                },
                {
                    name: "Freeze Time",
                    active: false,
                    cooldown: 1,
                    baseCooldown: 1,
                    rechargeRate: 0.001,
                    key: "control",
                    imgSrc: "sprites/clock-icon.png"
                }
            ]
        }
    ]);

    player.abilities.find(a => a.name === "Psi Beam").action = () => {
        const dir = k.toWorld(k.mousePos()).sub(player.pos).unit();
        const start = player.pos;
        const end = castRay(k, start, dir);

        const beamLength = end.dist(start);
        const angle = dir.angle();

        k.add([
            k.sprite("psi-beam", { width: beamLength, height: 64 }),
            k.pos(start),
            k.rotate(angle),
            k.anchor("left"),
            k.area(),
            k.opacity(1),
            k.lifespan(0.5),
            {
                damage: 10,
                beamHitEnemies: new Set()
            },
            "beam"
        ]);

        k.onCollide("beam", "enemy", (b, e) => {
            if (b.beamHitEnemies.has(e) || e.dead) return;
            e.hurt(b.damage);
            b.beamHitEnemies.add(e);
        });
    };

    player.abilities.find(a => a.name === "Force Field").action = () => {

        const shield = k.add([
            k.sprite("force-field", { anim: "idle" }),
            k.pos(player.pos),
            k.anchor("center"),
            k.scale(5),
            k.area(),
            {
                lifespan: 2.5
            },
            "force field"
        ]);

        shield.onAnimEnd(anim => {
            if (anim === "fade") k.destroy(shield);
        });

        shield.onUpdate(() => {
            shield.pos = player.pos;
            shield.lifespan -= k.dt();
            if (shield.lifespan <= 0) {
                shield.play("fade");
                shield.lifespan = 100;
            }
        });
    };

    player.abilities.find(a => a.name === "Freeze Time").action = () => {

        const freeze = k.add([
            "freeze",
            k.timer()
        ]);

        freeze.wait(2.5, () => {
            k.get("enemy").forEach(e => {
                e.play(e.currentAnim);
            });
            k.destroy(freeze);
        });

    };

    player.baseDashCd = player.dashCd;

    store.set(playerInfoAtom, prev => ({
        ...prev,
        data: {
            ...prev.data,
            guns: player.guns,
            gunIndex: player.gunIndex
        }
    }));

    // on mission
    function setOnMission(onMission = false) {
        player.onMission = onMission;
        store.set(gameInfoAtom, prev => ({ ...prev, onMission: onMission }));
        k.setCursor(onMission ? "none" : "default")
    }

    // dash
    function setPlayerDashing(dashing) {
        player.dashing = dashing;
        if (!dashing) return;
        player.dashHitEnemies.clear();
        player.use(k.area({
            shape: new k.Rect(k.vec2(0, 5), 15, 19),
            collisionIgnore: ["enemy"]
        }
        ));
        player.dashCd = player.baseDashCd;
        player.dashTimer = player.dashDuration;
        player.dashElapsed = 0;
        player.play("dash");
        player.dashOnCd = true;
        player.invincible = true;
        store.set(gameInfoAtom, prev => ({ ...prev, cooldwns: { ...prev.cooldwns, dash: 0 } }));
    }

    function equipGun(index = 0) {
        if (!player.onMission || player.guns.length === 1) return;

        // reset reload when changing guns
        if (player.reloading) {
            player.reloading = false;
            store.set(gameInfoAtom, prev => ({
                ...prev,
                reloading: false,
            }));

            reloadWait.cancel();
            reloadLoop.cancel();
        }

        if (index >= player.guns.length) index = 0;
        if (index < 0) index = player.guns.length - 1;

        player.gunIndex = index;
        const gunData = player.guns[index];
        store.set(
            gameInfoAtom,
            prev => ({
                ...prev,
                cooldwns: { ...prev.cooldwns, reload: gunData.clip / gunData.clipSize }
            })
        );

        const gun = makeGun(k, player, player.guns[index]);

        gun.pulseTimer = gun.pulseDuration;

        store.set(gameInfoAtom, prev => ({
            ...prev,
            gunIndex: player.gunIndex
        }));
    }

    function loseAmmo() {
        const gun = player.guns[player.gunIndex];
        gun.ammo--;
        gun.clip--;
        store.set(playerInfoAtom, prev => ({
            ...prev,
            data: {
                ...prev.data,
                guns: player.guns
            }
        }));

        store.set(
            gameInfoAtom,
            prev => ({
                ...prev,
                cooldwns: { ...prev.cooldwns, reload: gun.clip / gun.clipSize }
            })
        );
    }

    let reloadLoop = null;
    let reloadWait = null;

    function reload() {
        if (!player.onMission) return;
        const gun = player.guns[player.gunIndex];
        if (gun.ammo <= gun.clip || gun.clip === gun.clipSize) return;

        store.set(gameInfoAtom, prev => ({ ...prev, cooldwns: { ...prev.cooldwns, reload: 0 } }));

        player.reloading = true;

        store.set(gameInfoAtom, prev => ({
            ...prev,
            reloading: true,
        }));

        reloadWait = player.wait(player.reloadCd, () => {
            gun.clip = Math.min(
                gun.ammo,
                gun.clipSize
            );

            player.reloading = false;
            store.set(gameInfoAtom, prev => ({
                ...prev,
                reloading: false,
            }));

            store.set(playerInfoAtom, prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    guns: player.guns
                },
            }));
        });

        // every 0.1s update cd progress for ui
        const interval = 0.1;
        reloadLoop = player.loop(interval, () => {
            store.set(gameInfoAtom, prev => ({
                ...prev,
                cooldwns: {
                    ...prev.cooldwns,
                    reload: prev.cooldwns.reload + interval / player.reloadCd
                }
            }));
        }, player.reloadCd / interval);

    }

    player.use({ setOnMission, setPlayerDashing, equipGun, loseAmmo, reload });

    let mWheel = '';

    document.addEventListener('wheel', event => {
        if (player.inDialogue || store.get(menuAtom).visible) return;
        if (event.deltaY > 0) {
            mWheel = 'down';
        } else if (event.deltaY < 0) {
            mWheel = 'up';
        }
    });

    // taking damage
    player.on("hurt", async () => {
        store.set(gameInfoAtom, prev => ({ ...prev, health: player.hp() }));

        const maxFlickers = 20;
        const interval = 0.05;
        player.invincible = true;

        await player.loop(interval, () => {
            player.hidden = !player.hidden;
        }, maxFlickers);

        player.invincible = false;
        player.hidden = false;
    });

    player.on("heal", () => {
        store.set(gameInfoAtom, prev => ({ ...prev, health: player.hp() }));
    });

    player.onAnimEnd(anim => {
        if (anim === "dash" && player.dashing) {
            player.frame = player.frame;
        }
    });

    // drops
    let pickupDelay = 0;
    player.onCollideUpdate("drop", drop => {

        const dropName = drop.tags[1];

        if (dropName === "coin") {
            store.set(
                gameInfoAtom,
                prev => ({
                    ...prev,
                    gold: prev.gold + drop.amount
                })
            );
            makeFloatingText(k, drop.pos, `+${drop.amount}`);

            drop.destroy();
            return;
        }

        const gunFound = player.guns.find(gun => gun.name === dropName);
        const action = gunFound ? "Get Ammo" : "Pick Up";
        store.set(
            popupAtom,
            prev => ({
                ...prev,
                visible: true,
                text: {
                    action,
                    name: dropName,
                    key: "E"
                },
                pos: {
                    x: drop.screenPos().x - DROP_OFFSET,
                    y: drop.screenPos().y - DROP_OFFSET
                }
            })
        );

        if (k.isKeyDown("e")) {
            if (pickupDelay <= 0) {
                pickupDelay = 0.5;

                if (dropName === "heart") {
                    if (player.hp() >= player.maxHP()) {
                        makeFloatingText(k, drop.pos, "Health is full");
                        return;
                    }
                    player.heal(1);

                    drop.destroy();
                    return;
                }

                const equippedGun = player.guns[player.gunIndex];

                if (gunFound) {
                    if (gunFound.ammo === gunFound.maxAmmo) {
                        makeFloatingText(k, drop.pos, "Ammo is full");
                        return;
                    }

                    gunFound.ammo = Math.min(gunFound.ammo + drop.ammo, gunFound.maxAmmo);
                    gunFound.clip = Math.min(gunFound.clip + drop.ammo, gunFound.clipSize);

                    if (equippedGun === gunFound) {
                        store.set(
                            gameInfoAtom,
                            prev => ({
                                ...prev,
                                cooldwns: { ...prev.cooldwns, reload: gunFound.clip / gunFound.clipSize }
                            })
                        );
                    }
                } else if (player.guns.length === player.maxGuns) {
                    makeGunDrop(k, equippedGun, player.pos);
                    player.guns[player.gunIndex] = {
                        name: dropName,
                        ammo: drop.ammo,
                        ...GUNS[dropName],
                        clip: drop.clip
                    };
                    player.equipGun(player.gunIndex);
                } else {
                    player.guns.push({
                        name: dropName,
                        ammo: GUNS[dropName].maxAmmo,
                        ...GUNS[dropName],
                        clip: GUNS[dropName].clipSize
                    });
                }

                drop.destroy();
            }
        }


    });

    player.onCollideEnd("drop", () => {
        store.set(
            popupAtom,
            prev => ({
                ...prev,
                visible: false
            })
        );
    });

    player.onCollide("entrance", entrance => {
        if (entrance.rId === "1-1") {
            store.set(infoBoxAtom, prev => ({
                ...prev,
                visible: true,
                text: "You can right click to slide. You are immune to damage while sliding. "
                    + "Sliding into enemies will damage them, and your cooldown and duration will get "
                    + "reduced and increased respectively for each enemy you hit. You can right click again "
                    + "to end your slide early."
            }));
        } else if (entrance.rId === "1-9") {
            store.set(infoBoxAtom, prev => ({
                ...prev,
                visible: true,
                text: "Portals lead to a boss. You can't return after starting a boss fight, so make sure "
                    + "you are prepared first."
            }));
        }


        const roomId = entrance.rId;
        const gameState = k.get("gameState")[0];
        const toSpawn = gameState.pendingSpawns.filter(e => e.roomId === roomId);

        toSpawn.forEach(e => {
            const factory = ENEMY_FACTORIES[e.name] || ENEMY_FACTORIES["default"];
            factory(k, e.name, { pos: e.pos, roomId: e.roomId })
        }
        );

        // Remove them from the pending list so they don't respawn
        gameState.pendingSpawns = gameState.pendingSpawns.filter(e => e.roomId !== roomId);

        k.get("boulder").filter(b => b.roomIds.includes(entrance.rId)).forEach(b => {
            b.opacity = 1;
            b.use(k.body({ isStatic: true }));
        });

        k.get("entrance").filter(e => e.rId === entrance.rId).forEach(e => {
            e.destroy();
        });
    });

    player.onUpdate(() => {
        if (pickupDelay > 0) pickupDelay -= k.dt();
        // === A. Update Direction (mouse and keyboard) ===
        const worldMousePos = k.toWorld(k.mousePos());
        player.direction = worldMousePos.sub(player.pos).unit();

        // === B. Update Camera ===
        if (!k.getCamPos().eq(player.pos)) {
            k.tween(
                k.getCamPos(),
                player.pos,
                0.2,
                (newPos) => k.setCamPos(newPos),
                k.easings.linear
            );
        }

        // === C. Update UI (reload bar position) ===
        if (player.reloading) {
            store.set(gameInfoAtom, prev => ({
                ...prev,
                rBarPos: {
                    x: player.screenPos().x,
                    y: player.screenPos().y - 65
                }
            }));
        }

        // === D. Prevent movement during dialogue ===
        if (player.inDialogue) {
            player.play("idle");
            return;
        }

        // === E. Dashing ===
        if (player.dashOnCd) {
            player.dashElapsed += k.dt();
            const progress = Math.min(player.dashElapsed / player.dashCd, 1);

            store.set(gameInfoAtom, prev => ({
                ...prev,
                cooldwns: {
                    ...prev.cooldwns,
                    dash: progress
                }
            }));

            if (player.dashElapsed >= player.dashCd) {
                player.dashOnCd = false;
            }
        }

        if (k.isMouseDown("right") && !player.dashing && !player.dashOnCd) {
            if (!player.directionVector.eq(k.vec2(0))) {
                player.flipX = player.directionVector.x < 0;
            }
            player.setPlayerDashing(true);
            player.dashJustStarted = true;
        }

        if (k.isMouseReleased("right")) {
            if (player.dashing && !player.dashJustStarted) {
                player.setPlayerDashing(false);
            }

            player.dashJustStarted = false;
        }

        if (player.dashing) {
            player.dashTimer -= k.dt();

            if (player.dashTimer <= 0) {
                player.dashing = false;
                player.invincible = false;
                player.use(k.area({
                    shape: new k.Rect(k.vec2(0, 5), 15, 19)
                }));
            }

            const dashDirection = player.directionVector.isZero()
                ? (player.flipX ? k.vec2(-1, 0) : k.vec2(1, 0))
                : player.directionVector;

            player.move(dashDirection.scale(player.dashSpeed));

            k.get("enemy").forEach(e => {
                if (!e?.area?.shape) return;
                const enemyScale = e.scale?.x || 1;
                const enemyOverlap = {
                    x: e.pos.x - (e.area.shape.width * enemyScale) / 2,
                    y: e.pos.y - (e.area.shape.height * enemyScale) / 2,
                    width: e.area.shape.width * enemyScale,
                    height: e.area.shape.height * enemyScale
                };

                const playerScale = player.scale?.x || 1;
                const playerOverlap = {
                    x: player.pos.x - (player.area.shape.width * playerScale) / 2,
                    y: player.pos.y - (player.area.shape.height * playerScale) / 2,
                    width: player.area.shape.width * playerScale,
                    height: player.area.shape.height * playerScale
                };

                if (
                    hasOverlap(enemyOverlap, playerOverlap) &&
                    !player.dashHitEnemies.has(e) &&
                    !e.dead
                ) {
                    e.hurt(player.dashDamage);
                    player.dashCd = Math.max(player.dashCd - 0.5, 0.1);
                    player.dashTimer += Math.max(0.15 - player.dashHitEnemies.size * 0.75, 0.05);
                    player.dashHitEnemies.add(e);
                }
            });

            return;
        }

        // === F. Weapon Switching ===
        if (k.isKeyPressed(["1", "2", "3", "4", "5"])) {
            const keyDown = k.isKeyPressed("1") ? 1 :
                k.isKeyPressed("2") ? 2 :
                    k.isKeyPressed("3") ? 3 :
                        k.isKeyPressed("4") ? 4 : 5;
            player.equipGun(keyDown - 1);
        }
        if (mWheel === "down") player.equipGun(player.gunIndex + 1);
        else if (mWheel === "up") player.equipGun(player.gunIndex - 1);
        mWheel = "";

        // === G. Reloading ===
        if (k.isKeyPressed("r") && !player.reloading) {
            player.reload();
        }

        // === H. Animation (based on movement) ===
        player.flipX = player.direction.x < 0;

        if (
            k.isKeyDown("a") ||
            k.isKeyDown("d") ||
            k.isKeyDown("w") ||
            k.isKeyDown("s")
        ) {
            if (!player.onMission && player?.getCurAnim()?.name !== "walk") {
                player.play("walk");
            } else if (player.onMission && player?.getCurAnim()?.name !== "walk2") {
                player.play("walk2");
            }
        } else {
            !player.onMission ? player.play("idle") : player.play("idle2");
        }

        // === I. Movement (normal walking) ===
        player.directionVector = k.vec2(0);
        if (k.isKeyDown("a")) player.directionVector.x = -1;
        if (k.isKeyDown("d")) player.directionVector.x = 1;
        if (k.isKeyDown("w")) player.directionVector.y = -1;
        if (k.isKeyDown("s")) player.directionVector.y = 1;

        if (!player.directionVector.isZero())
            player.directionVector = player.directionVector.unit();

        player.move(player.directionVector.scale(player.speed));

        // === J. Abilities ===

        if (player.onMission) {
            player.abilities.filter(a => a.active).forEach(ability => {
                if (k.isKeyPressed(ability.key) && ability.cooldown === ability.baseCooldown) {

                    ability.action();
                    ability.cooldown = 0;

                    store.set(playerInfoAtom, prev => ({
                        ...prev,
                        data: {
                            ...prev.data,
                            abilities: player.abilities
                        }
                    }));
                }
            });
        }
    });

    return player;
}