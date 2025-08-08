import { useFlash } from '../utils/shader';
import { hasLineOfSight } from "../utils/collision";
import makeProjectile from "./projectile";
import PathfindingManager from "../utils/PathfindingManager";
import makeGunDrop from './gunDrop';
import makeCoin from './coin';
import { GUNS, ENEMIES, ENEMY_FACTORIES } from "../constants";
import makeHeart from './heart';

export default function makeEnemy(k, name, { pos, roomId, maxRange = 500, minRange = 100 }) {
    const enemyData = ENEMIES[name];
    const hitbox = enemyData?.hitbox ?? { x: 0, y: 0, width: 20, height: 20 };

    const enemy = k.add([
        k.sprite(name, { anim: "walk" }),
        k.scale(4),
        k.anchor(k.vec2(hitbox.x / 2, hitbox.y / 2)),
        k.area({
            shape: new k.Rect(k.vec2(hitbox.x, hitbox.y), hitbox.width, hitbox.height),
            collisionIgnore: ["enemy"]
        }),
        k.body(),
        k.pos(pos),
        k.health(enemyData.health, enemyData.health),
        k.opacity(1),
        k.offscreen({ hide: true }),
        "enemy",
        "pausable",
        {
            name,
            path: [],
            shooting: false,
            firingSpeed: enemyData.firingSpeed,
            speed: enemyData.speed,
            dead: false,
            roomId,
            pathTimer: 0,
            shootDistance: k.randi(minRange, maxRange),
            shootCd: 0.5,
            damage: enemyData.damage,
            shootOffset: enemyData.shootOffset ?? { x: 0, y: 0 },
            hasSight: false,
            losTimer: 0.2,
            maxRange,
            minRange
        }
    ]);

    useFlash(k, enemy);

    const room = k.get("room").find(r => r.rId === enemy.roomId);
    enemy.pf = new PathfindingManager(k, room, enemy);

    enemy.on("hurt", amount => {
        enemy.flash();

        const player = k.get("player")[0];

        player.abilities.filter(a => a.active).forEach(ability => {
            // psi beam does not recharge psi beam cd
            if (k.get("beam").length > 0 && ability.name === "Psi Beam") {
                return;
            }
            ability.cooldown += Math.min(
                1 - ability.cooldown,
                ability.rechargeRate * amount + (player.mind.level - 1) * 0.005
            );
        });
    });

    enemy.on("death", () => {
        enemy.dead = true;
        enemy.unuse("body");
        enemy.play("dying");
    });

    enemy.onAnimEnd(anim => {
        if (anim === "dying") {
            if (k.getSceneName().includes("boss")) {
                k.destroy(enemy);
                return;
            }
            const dropChance = k.randi(1, 4);
            const gunDropChance = k.randi(1, 6);
            const coinDropChance = k.randi(0, 10);

            const player = k.get("player")[0];

            const healthDropChance = k.randi(
                1,
                Math.max(16, 21 - (player.maxHP() - player.hp()))
            );

            if (dropChance === 1 || dropChance === 2) {
                if (healthDropChance === 1) {
                    makeHeart(k, enemy.pos);
                } else if (gunDropChance === 3) {
                    const guns = Object.keys(GUNS).filter(gun => GUNS[gun].level <= k.get("player")[0].weapon.level);
                    const gunName = guns[k.randi(0, guns.length)];

                    makeGunDrop(
                        k,
                        {
                            name: gunName
                        },
                        enemy.pos
                    );
                } else if (coinDropChance !== 0) {
                    makeCoin(k, enemy.pos);
                }
            }

            // remove boulder when all enemies in room are dead
            const enemiesLeft = k.get("enemy").filter(e => e.roomId === enemy.roomId);
            const reinforcements = k.get("gameState")[0].reinforcements.filter(e => e.roomId === enemy.roomId);
            if (enemiesLeft.length === 1) {
                if (reinforcements.length) {
                    reinforcements.forEach(async e => {
                        const warning = k.add([
                            k.pos(e.pos),
                            k.sprite("warning", { anim: "idle" }),
                            k.scale(4),
                            "warning",
                            "pausable",
                            k.timer()
                        ]);

                        let t = 0;
                        warning.onUpdate(() => {
                            t += k.dt();
                            warning.opacity = 0.5 + 0.5 * Math.sin(t * 10);
                        });

                        await warning.wait(1);

                        k.destroy(warning);

                        const factory = ENEMY_FACTORIES[e.name] || ENEMY_FACTORIES["default"];
                        factory(k, e.name, { pos: e.pos, roomId: enemy.roomId });
                    });
                    k.get("gameState")[0].reinforcements = k.get("gameState")[0].reinforcements.filter(e => e.roomId !== enemy.roomId);
                } else {
                    k.get("boulder").filter(b => b.roomIds.includes(enemy.roomId)).forEach(b => {
                        b.opacity = 0;
                        b.unuse("body");
                    });

                    if (player.passives["Rapid Recovery"]) {
                        const regenChance = k.randi(0, 4);
                        if (regenChance === 0) player.heal();
                    }
                }
            }
            k.destroy(enemy);
        }
    });

    return enemy;
}

export function shoot(
    k, 
    enemy, 
    { 
        pCount, 
        aStep = 15, 
        baseAngle = 0, 
        target = null, 
        velocity = null, 
        pos = null,
        pSpeed = 200
    } = {}
) {
    const enemyData = ENEMIES[enemy.name];

    const projectileCount = pCount ?? enemyData?.projectileCount ?? 1;

    const totalSpread = (projectileCount - 1) * aStep;
 
    for (let i = 0; i < projectileCount; i++) {
        const offset = -totalSpread / 2 + i * aStep;
        const angle = baseAngle + offset;

        makeProjectile(k, {
            pos: pos ? pos : enemy.pos.add(k.vec2(enemy.shootOffset.x, enemy.shootOffset.y)),
            damage: enemy.damage,
            projectileSpeed: pSpeed
        }, {
            name: "enemyProjectile",
            spread: angle,
            friendly: false,
            lifespan: 5,
            target,
            velocity
        });
    }

    enemy.shootCd = enemy.firingSpeed;
}

export function makeEnemyPath(k, enemy) {
    const player = k.get("player")[0];
    enemy.shootCd -= k.dt();
    enemy.pathTimer -= k.dt();

    enemy.flipX = player.pos.sub(enemy.pos).x < 0;

    if (
        enemy.pathTimer <= 0 &&
        (
            enemy.pos.dist(player.pos) > enemy.shootDistance ||
            !enemy.hasSight
        )
    ) {
        enemy.path = enemy.pf.findPath(enemy.path?.length ? enemy.path[0] : enemy.pos, player.pos);
        enemy.pathTimer = k.rand(0.5, 1.5);
        enemy.shootDistance = k.randi(enemy.minRange, enemy.maxRange);

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
            !enemy.hasSight ||
            enemy.pos.dist(player.pos) > enemy.shootDistance
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
}

export function checkEnemyDead(k, enemy) {
    if (enemy.dead) {
        enemy.opacity -= k.dt() * 0.5;
    }

    return enemy.dead;
}

export function checkTimeFrozen(k, enemy) {
    if (k.get("freeze").length) {
        if (!enemy.currentAnim) enemy.currentAnim = enemy.curAnim();
        enemy.stop();
        return true;
    } else return false;
}

export function checkEnemySight(k, enemy) {
    const player = k.get("player")[0];
    if (enemy.losTimer <= 0) {
        enemy.hasSight = hasLineOfSight(
            k,
            enemy.pos.add(k.vec2(enemy.shootOffset.x, enemy.shootOffset.y)),
            player.pos
        );
        enemy.losTimer = 0.2;
    }
    enemy.losTimer -= k.dt();
}