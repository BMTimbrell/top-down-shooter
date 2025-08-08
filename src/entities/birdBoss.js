import { useFlash } from "../utils/shader";
import PathfindingManager from "../utils/PathfindingManager";
import { ENEMY_FACTORIES } from "../constants";
import { shoot, makeEnemyPath, checkEnemySight, checkTimeFrozen } from "./enemy";
import { store, victoryScreenAtom, gameInfoAtom } from "../store";

export default function makeBirdBoss(k, name, { pos, roomId }) {
    const boss = k.add([
        k.sprite(name, { anim: "fly" }),
        k.scale(4),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 0), 45, 45),
            collisionIgnore: ["enemy"]
        }),
        k.body(),
        k.pos(pos),
        k.health(200, 200),
        k.opacity(1),
        k.offscreen({ hide: true }),
        "enemy",
        "pausable",
        name,
        {
            name,
            path: [],
            shooting: false,
            firingSpeed: 3,
            speed: 50,
            dead: false,
            roomId,
            pathTimer: 0,
            shootDistance: k.randi(100, 500),
            shootCd: 0.5,
            damage: 1,
            shootOffset: { x: 0, y: 0 },
            hasSight: false,
            minRange: 100,
            maxRange: 500,
            losTimer: 0.2,
            phase: 1
        }
    ]);

    const healthBarBg = k.add([
        k.pos(pos),
        k.scale(4),
        k.rect(boss.area.shape.width, 5),
        k.color(k.rgb(78, 78, 78))
    ]);

    const healthBar = k.add([
        k.pos(pos),
        k.scale(4),
        k.rect(boss.area.shape.width, 5),
        k.color(k.rgb(0, 202, 0)),
        "healthBar",
        k.z(999999999999),
        {
            updateFill(current, max) {
                this.width = boss.area.shape.width * (current / max);
            }
        }

    ]);

    healthBarBg.onUpdate(() => {
        healthBarBg.pos = boss.pos.sub(k.vec2((healthBarBg.width * 4) / 2, 140));
    });

    healthBar.onUpdate(() => {
        healthBar.pos = boss.pos.sub(k.vec2((healthBarBg.width * 4) / 2, 140));
        healthBar.updateFill(boss.hp(), boss.maxHP());
    });

    useFlash(k, boss);

    const room = k.get("room").find(r => r.rId === boss.roomId);
    boss.pf = new PathfindingManager(k, room, boss);

    boss.on("hurt", () => {
        boss.flash();
    });

    boss.on("death", () => {
        boss.dead = true;
        boss.unuse("body");
        boss.play("dying");
    });

    boss.onAnimEnd(anim => {
        if (anim === "dying") {
            k.destroy(boss);

            store.set(victoryScreenAtom, prev => ({
                ...prev,
                visible: true,
                onClick: () => {
                    store.set(victoryScreenAtom, prev => ({
                        ...prev,
                        visible: false
                    }));

                    const time = k.get("gameState")[0].time += 2;

                    store.set(
                        gameInfoAtom,
                        prev => ({
                            ...prev,
                            time
                        })
                    );

                    k.go("exposition", {
                        player: k.get("player")[0],
                        gameState: k.get("gameState")[0]
                    });
                },
                rewards: ["500", "+10 weapon xp"]
            }));

            const player = k.get("player")[0];
            player.weapon.exp += 10;
            store.set(
                gameInfoAtom,
                prev => ({
                    ...prev,
                    gold: prev.gold + 500
                })
            );
            player.setOnMission(false);
        }
    });

    function spawnWave(wNum) {
        const reinforcements = k.get("gameState")[0].reinforcements.filter(
            e => e.roomId === boss.roomId
        ).slice(0, wNum === 1 ? 3 : 2);

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
                factory(k, e.name, { pos: e.pos, roomId: boss.roomId });
            });

            if (wNum === 1) k.get("gameState")[0].reinforcements = k.get("gameState")[0].reinforcements.filter(
                e => e.roomId === boss.roomId
            ).slice(3, 5);
            if (wNum === 2) k.get("gameState")[0].reinforcements = [];
        }
    }

    boss.onUpdate(() => {
        if (checkTimeFrozen(k, boss)) return;
        if (boss.dead) {
            k.destroy(healthBar);
            k.destroy(healthBarBg);
            boss.opacity -= k.dt() * 0.5;
            k.get("enemy").filter(e => !e.is("birdboss")).forEach(e => e.hurt(e.hp()));
            k.get("enemyProjectile").forEach(e => k.destroy(e));
            return;
        }

        checkEnemySight(k, boss);
        makeEnemyPath(k, boss);

        if (boss.phase === 1) {
            /*  shooting  */
            if (boss.shootCd <= 0 && boss.hasSight) {
                shoot(k, boss, { pCount: 8, aStep: 20 });
            }
        } else if (boss.phase === 2) {
            /*  shooting  */
            if (boss.shootCd <= 0 && boss.hasSight) {
                shoot(k, boss, { pCount: 2, aStep: 20, baseAngle: k.randi(-20, 20) });
            }
        } else if (boss.phase === 3) {
            /*  shooting  */
            if (boss.shootCd <= 0 && boss.hasSight) {
                shoot(k, boss, { pCount: 4, aStep: 20, baseAngle: k.randi(-20, 20) });
            }
        }

        const healthRatio = boss.hp() / boss.maxHP();
        if (healthRatio < 0.6 && boss.phase === 1) {
            spawnWave(1);
            boss.phase = 2;
            boss.firingSpeed = 0.5;
        } else if (healthRatio < 0.3 && boss.phase === 2) {
            spawnWave(2);
            boss.phase = 3;
        }
    });

    return boss;
}

