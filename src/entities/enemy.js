import { useFlash } from '../utils/shader';
import { hasLineOfSight } from "../utils/collision";
import makeProjectile from "./projectile";
import PathfindingManager from "../utils/PathfindingManager";
import makeGunDrop from './gunDrop';
import makeCoin from './coin';
import { GUNS } from "../constants";
import makeHeart from './heart';
import { store, gameInfoAtom } from "../store";

export default function makeEnemy(k, pos, name, { roomId, spawned }) {
    const enemy = k.add([
        k.sprite(name, { anim: "fly" }),
        k.scale(4),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 0), 20, 20),
            collisionIgnore: ["enemy"]
        }),
        k.body(),
        k.pos(pos),
        k.timer(),
        k.health(10, 10),
        "enemy",
        {
            path: [],
            shooting: false,
            firingSpeed: 3,
            speed: 100,
            dead: false,
            roomId,
            spawned
        }
    ]);

    useFlash(k, enemy);

    enemy.on("hurt", () => {
        enemy.flash();
    });

    enemy.on("death", () => {
        enemy.dead = true;
        enemy.unuse("body");
        enemy.play("dying");
    });

    enemy.onAnimEnd(anim => {
        if (anim === "dying") {
            const dropChance = k.randi(1, 3);
            const gunDropChance = k.randi(1, 4);
            const gameInfo = store.get(gameInfoAtom);
            const healthDropChance = k.randi(
                1, 
                Math.min(
                    11 - (gameInfo.maxHealth - gameInfo.health), 
                    5
                )
            );

            if (dropChance === 2) {
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
            if (enemies.length === 1) {
                k.get("boulder").filter(b => b.roomIds.includes(enemy.roomId)).forEach(b => {
                    b.opacity = 0;
                    b.unuse("body");
                });
            }
            enemy.destroy();
        }
    });

    const room = k.get("room").find(r => r.rId === enemy.roomId);
    const pf = new PathfindingManager(k, room, enemy);
    let pathTimer = 0;
    let shootDistance = k.randi(100, 500);
    let shootCd = 0;

    enemy.onUpdate(() => {
        enemy.opacity = enemy.spawned ? 1 : 0;
        if (enemy.dead || !enemy.spawned) return;

        const player = k.get("player")[0];
        shootCd -= k.dt();
        pathTimer -= k.dt();

        enemy.flipX = player.pos.sub(enemy.pos).x < 0;

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
            makeProjectile(k, {
                pos: enemy.pos,
                damage: 1,
                projectileSpeed: 200
            }, {
                name: "enemyProjectile",
                friendly: false,
                lifespan: 5
            });
            shootCd = 3;
        }

    });

    return enemy;
}