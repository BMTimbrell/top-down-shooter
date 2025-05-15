import { useFlash } from '../utils/shader';
import { hasLineOfSight } from "../utils/collision";
import makeProjectile from "./projectile";
import PathfindingManager from "../utils/PathfindingManager";
import makeGunDrop from './gunDrop';
import makeCoin from './coin';
import { GUNS, ENEMIES } from "../constants";
import makeHeart from './heart';
import { store, gameInfoAtom } from "../store";

export default function makeEnemy(k, pos, name, { roomId }) {
    const enemyData = ENEMIES[name];

    const enemy = k.add([
        k.sprite(name, { anim: "walk" }),
        k.scale(4),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 0), 20, 20),
            collisionIgnore: ["enemy"]
        }),
        k.body(),
        k.pos(pos),
        name === "mole" ? k.timer() : "",
        k.health(enemyData.health, enemyData.health),
        k.opacity(1),
        k.offscreen({ hide: true }),
        "enemy",
        "pausable",
        {
            path: [],
            shooting: false,
            firingSpeed: enemyData.firingSpeed,
            speed: enemyData.speed,
            dead: false,
            roomId
        }
    ]);

    function spawnDirt(k, pos) {
        const puff = k.add([
            k.sprite("dirtPuff", { anim: "puff" }),
            k.pos(pos),
            k.anchor("center"),
            k.scale(6),
            "dirtPuff",
            k.z(99999)
        ]);
        return puff;
    }

    let dirtPuff, dirtPuff2, crack = null;
    useFlash(k, enemy);

    const room = k.get("room").find(r => r.rId === enemy.roomId);
    const pf = new PathfindingManager(k, room, enemy);
    let pathTimer = 0;
    let shootDistance = k.randi(100, 500);
    let shootCd = 0;
    const isMole = name === "mole";

    enemy.on("hurt", () => {
        enemy.flash();

        if (isMole && !enemy.digFlag && enemy.path.length && !enemy.dead) {
            enemy.digFlag = true;
            enemy.play("rotate");
        }
    });

    enemy.on("death", () => {
        enemy.dead = true;
        enemy.unuse("body");
        enemy.play("dying");
        pf.cleanup();

        if (dirtPuff || dirtPuff2) {
            k.destroy(dirtPuff);
            k.destroy(dirtPuff2);
        }
    });

    enemy.onAnimEnd(anim => {
        if (anim === "dying") {
            const dropChance = k.randi(1, 4);
            const gunDropChance = k.randi(1, 5);
            const gameInfo = store.get(gameInfoAtom);
            const healthDropChance = k.randi(
                1,
                Math.min(
                    21 - (gameInfo.maxHealth - gameInfo.health),
                    11
                )
            );

            if (dropChance === 1 || dropChance === 2) {
                if (healthDropChance === 1) {
                    makeHeart(k, enemy.pos);
                } else if (gunDropChance === 3) {
                    const guns = Object.keys(GUNS);
                    const gunName = guns[k.randi(0, guns.length)];

                    makeGunDrop(
                        k,
                        {
                            name: gunName
                        },
                        enemy.pos
                    );
                } else {
                    makeCoin(k, enemy.pos);
                }
            }

            // remove boulder when all enemies in room are dead
            const enemies = k.get("enemy").filter(e => e.roomId === enemy.roomId);
            const reinforcements = k.get("gameState")[0].reinforcements.filter(e => e.roomId === enemy.roomId);
            if (enemies.length === 1) {
                if (reinforcements.length) {
                    reinforcements.forEach(async e => {
                        const warning = k.add([
                            k.pos(e.pos),
                            k.sprite("warning", { anim: "idle" }),
                            k.scale(4),
                            "warning",
                            k.timer()
                        ]);

                        let t = 0;
                        warning.onUpdate(() => {
                            t += k.dt();
                            warning.opacity = 0.5 + 0.5 * Math.sin(t * 10);
                        });

                        await warning.wait(1);

                        k.destroy(warning);
                        makeEnemy(k, e.pos, e.name, { roomId: enemy.roomId });
                    });
                    k.get("gameState")[0].reinforcements = k.get("gameState")[0].reinforcements.filter(e => e.roomId !== enemy.roomId);
                } else {
                    k.get("boulder").filter(b => b.roomIds.includes(enemy.roomId)).forEach(b => {
                        b.opacity = 0;
                        b.unuse("body");
                    });
                }
            }
            k.destroy(enemy);
        } else if (anim === "rotate" && !enemy.dead) {
            enemy.play("dig");
            dirtPuff = spawnDirt(k, enemy.pos.sub(k.vec2(50, 0)));
            dirtPuff2 = spawnDirt(k, enemy.pos.add(k.vec2(50, 0)));
            enemy.digging = true;
            enemy.digTimer = 1.5;
        }
    });

    enemy.onUpdate(() => {
        if (enemy.dead) {
            enemy.opacity -= k.dt() * 0.5;
            return;
        }

        const player = k.get("player")[0];
        shootCd -= k.dt();
        pathTimer -= k.dt();

        enemy.flipX = player.pos.sub(enemy.pos).x < 0;

        if (enemy?.digging) {
            if (!enemy.underground) {
                enemy.digTimer -= k.dt();
                if (enemy.digTimer <= 0) {
                    enemy.underground = true;
                    enemy.opacity = 0;
                    enemy.undergroundTimer = 3;
                    k.destroy(dirtPuff2);
                    dirtPuff.opacity = 0;
                    crack = k.add([
                        k.pos(dirtPuff.pos),
                        k.anchor("center"),
                        k.sprite("crack", { anim: "idle" }),
                        k.scale(6),
                        k.opacity(0),
                        "crack"
                    ]);
                    enemy.unuse("body");
                    enemy.unuse("area");
                }
            } else {
                enemy.pos = enemy.path[enemy.path.length - 1];
                dirtPuff.pos = enemy.pos;
                crack.pos = dirtPuff.pos.add(k.vec2(0, 20));
                enemy.undergroundTimer -= k.dt();
                if (enemy.undergroundTimer <= 1) {
                    dirtPuff.opacity = 1;
                    crack.opacity = 1;
                    if (crack.getCurAnim()?.name === "idle") {
                        crack.play("crack");
                    }
                }
                if (enemy.undergroundTimer <= 0) {
                    enemy.underground = false;
                    enemy.digging = false;
                    enemy.opacity = 1;
                    k.destroy(dirtPuff);
                    k.destroy(crack);
                    enemy.path = [];
                    enemy.use(k.body());
                    enemy.use(k.area({
                        shape: new k.Rect(k.vec2(0, 0), 20, 20),
                        collisionIgnore: ["enemy"]
                    }));
                    enemy.play("walk");
                    enemy.wait(3, () => enemy.digFlag = false);

                    const projectileCount = 8;

                    const angleStep = 45;

                    const totalSpread = (projectileCount - 1) * angleStep;

                    for (let i = 0; i < projectileCount; i++) {
                        const offset = -totalSpread / 2 + i * angleStep;
                        makeProjectile(k, {
                            pos: enemy.pos,
                            damage: ENEMIES[name].damage,
                            projectileSpeed: 200
                        }, {
                            name: "enemyProjectile",
                            spread: offset,
                            friendly: false,
                            lifespan: 5
                        });
                    }
                }
            }
            return;
        }

        if (
            pathTimer <= 0 &&
            (enemy.pos.dist(player.pos) > shootDistance || !hasLineOfSight(k, enemy.pos, player.pos))
        ) {
            enemy.path = pf.findPath(enemy.path?.length ? enemy.path[0] : enemy.pos, player.pos);
            pathTimer = k.rand(0.5, 1.5);
            shootDistance = k.randi(100, 500);

            // k.add([
            //     k.pos(0, 0),
            //     {
            //         draw() {
            //             for (const p of enemy.path ?? []) {
            //                 k.drawCircle({
            //                     pos: p,
            //                     radius: 3,
            //                     color: k.rgb(0, 255, 0)
            //                 });
            //             }
            //         }
            //     }
            // ]);
        }

        if (
            enemy.path?.length > 0 && (
                !hasLineOfSight(k, enemy.pos, player.pos) ||
                enemy.pos.dist(player.pos) > shootDistance
            )
        ) {
            if (enemy.path?.length > 0) {
                if (enemy.pos.dist(enemy.path[0]) < 4) {
                    enemy.path.shift();
                }

                if (enemy.path.length > 0) {
                    const dir = enemy.path[0].sub(enemy.pos).unit();

                    if (dir.x > 0.25 || dir.x < -0.25) enemy.flipX = dir.x < 0;

                    enemy.move(dir.scale(enemy.speed));
                }
            }
        }

        /*  shooting  */
        if (shootCd <= 0 && hasLineOfSight(k, enemy.pos, player.pos)) {
            const projectileCount = enemyData.projectileCount ?? 1;

            const angleStep = 15;

            const totalSpread = (projectileCount - 1) * angleStep;

            for (let i = 0; i < projectileCount; i++) {
                const offset = -totalSpread / 2 + i * angleStep;
                makeProjectile(k, {
                    pos: enemy.pos,
                    damage: ENEMIES[name].damage,
                    projectileSpeed: 200
                }, {
                    name: "enemyProjectile",
                    spread: offset,
                    friendly: false,
                    lifespan: 5
                });
            }

            shootCd = enemy.firingSpeed;
        }

    });

    return enemy;
}