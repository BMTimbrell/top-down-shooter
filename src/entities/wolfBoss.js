import { useFlash } from "../utils/shader";
import PathfindingManager from "../utils/PathfindingManager";
import { ENEMY_FACTORIES, CELL_SIZE } from "../constants";
import { shoot, makeEnemyPath, checkTimeFrozen } from "./enemy";
import { store, victoryScreenAtom, gameInfoAtom } from "../store";

export default function makeWolfBoss(k, name, { pos, roomId }) {
    const boss = k.add([
        k.sprite("sheepboss", { anim: "walk" }),
        k.scale(4),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 0), 45, 45),
            collisionIgnore: ["enemy"]
        }),
        k.body(),
        k.pos(pos),
        k.health(400, 400),
        k.opacity(1),
        k.offscreen({ hide: true }),
        "enemy",
        "pausable",
        name,
        {
            name,
            path: [],
            shooting: false,
            firingSpeed: 1.5,
            speed: 50,
            dead: false,
            roomId,
            pathTimer: 0,
            phaseTimer: 5,
            shootAngle: 0,
            attack1Count: 0,
            shootDistance: k.randi(100, 500),
            shootCd: 0.5,
            damage: 5,
            minRange: 100,
            maxRange: 500,
            shootOffset: { x: 0, y: 0 },
            phase: 1,
            spriteChangeTrigger: true,
            runningPhaseTime: 2,
            idlePhaseTime: 1.5,
            spawnWaveTrigger: true
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
        k.z(999999999999),
        "healthBar",
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

    boss.on("hurt", amount => {
        boss.flash();

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

        if (boss.hp() < boss.maxHP() * 0.6 && boss.spriteChangeTrigger) {
            boss.use(k.sprite("sheepbossDamaged", { anim: "walk" }));
            boss.spriteChangeTrigger = false;
        }
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

                    const time = k.get("gameState")[0].time = 3;

                    store.set(
                        gameInfoAtom,
                        prev => ({
                            ...prev,
                            daysUntilMission: 8,
                            time
                        })
                    );

                    k.go("room", {
                        player: k.get("player")[0],
                        gameState: k.get("gameState")[0]
                    });
                },
                rewards: ["1000", "+20 weapon xp"]
            }));

            const player = k.get("player")[0];

            player.weapon.exp += 20;
            const playerExp = player.weapon.exp;
            const maxExp = player.weapon.maxExp;

            if (playerExp >= maxExp) {
                if (player.weapon.level < 3) {
                    player.weapon.exp = playerExp - maxExp;
                    player.weapon.level += 1;
                    player.reloadCd -= 0.25;
                }

                if (player.weapon.level === 3) {
                    player.weapon.exp = maxExp;
                } else {
                    player.weapon.maxExp = 100;
                }
            }

            store.set(
                gameInfoAtom,
                prev => ({
                    ...prev,
                    gold: prev.gold + 1000
                })
            );
            player.setOnMission(false);
        } else if (anim === "remove clothes") {
            boss.phase = 4;
            boss.firingSpeed = 0.5;
            boss.shootCd = 0;
            boss.use(k.sprite("wolfBoss", { anim: "run" }));
            boss.phaseTimer = boss.runningPhaseTime;
        }
    });

    function spawnWave() {
        const reinforcements = k.get("gameState")[0].reinforcements.filter(
            e => e.roomId === boss.roomId
        );

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

                const factory = ENEMY_FACTORIES[e.name] || ENEMY_FACTORIES["default"];
                factory(k, e.name, { pos: e.pos, roomId: boss.roomId });
            });

            k.get("gameState")[0].reinforcements = [];
        }
    }

    function attack1({ target = null, angle = null }) {
        const wool = k.add([
            k.sprite("wool"),
            k.pos(boss.pos),
            "wool",
            "enemy",
            "pausable",
            k.scale(4),
            k.opacity(1),
            k.anchor("center"),
            k.area({
                shape: new k.Rect(k.vec2(0), 20, 20),
                collisionIgnore: ["enemy"]
            }),
            k.body(),
            k.offscreen({ hide: true }),
            k.health(10, 10),
            k.move(target ? target.angle(boss.pos) : angle, 200),
            {
                shootOffset: { x: 0, y: 0 }
            }
        ]);

        useFlash(k, wool);

        wool.onCollideUpdate(obj => {
            if (obj.is("boundary") || obj.is("player")) wool.hurt(10);
        });

        wool.on("hurt", () => {
            wool.flash();
        });

        wool.on("death", () => {
            shoot(k, wool, { pCount: 8, aStep: 45, type: "woolProjectile", baseAngle: 22.5 });
            k.destroy(wool);
        });

        wool.onUpdate(() => {
            if (k.get("freeze").length) {
                wool.unuse("move");
            } else if (!wool.has("move")) {
                wool.use(k.move(target ? target.angle(boss.pos) : angle, 200));
            }
        });
    }

    function attack2() {
        if (boss.shootCd <= 0) {
            const randomSpread = k.randi(-40, 40);
            const playerDir = k.Vec2.fromAngle(k.get("player")[0].pos.angle(boss.pos) + randomSpread);

            const numProjectiles = 8;
            const radius = 10; // Starting circle radius
            const ringSpeed = 2.5; // How fast the center of the ring moves
            const spreadSpeed = 0.5; // How fast the bullets move outward from center

            const centerVelocity = playerDir.scale(ringSpeed);

            for (let i = 0; i < numProjectiles; i++) {
                const angle = (Math.PI * 2 / numProjectiles) * i;
                const offset = k.vec2(Math.cos(angle), Math.sin(angle)).scale(radius);

                const bulletVelocity = centerVelocity.add(offset.unit().scale(spreadSpeed));

                shoot(k, boss, {
                    velocity: bulletVelocity
                });
            }
        }
    }

    function attack3() {
        shoot(k, boss, { pCount: 4 });
    }

    boss.onUpdate(() => {
        // console.log(k.get("player")[0].pos.angle(boss.pos));
        if (checkTimeFrozen(k, boss)) return;

        if (boss.dead) {
            k.destroy(healthBar);
            k.destroy(healthBarBg);
            boss.opacity -= k.dt() * 0.5;
            k.get("enemy").filter(e => !e.is("wolfboss")).forEach(e => e.hurt(e.hp()));
            k.get("enemyProjectile").forEach(e => k.destroy(e));
            k.get("woolProjectile").forEach(e => k.destroy(e));
            return;
        }

        makeEnemyPath(k, boss);

        if (boss.phase < 3 && boss.hp() <= boss.maxHP() * 0.35) {
            boss.phase = 3
        }

        if (boss.phase === 1) {
            /*  shooting  */
            boss.phaseTimer -= k.dt();
            if (boss.shootCd <= 0) {
                const target = k.get("player")[0].pos;
                attack1({ target });
                boss.shootCd = boss.firingSpeed;
            }

            if (boss.phaseTimer <= 0) {
                boss.phase = 2;
                boss.firingSpeed = 0.5;
                boss.phaseTimer = 3;
            }
        } else if (boss.phase === 2) {
            boss.phaseTimer -= k.dt();
            attack2();

            if (boss.phaseTimer <= 0) {
                boss.phase = 1;
                boss.firingSpeed = 1.5;
                boss.phaseTimer = 5;
            }
        } else if (boss.phase === 3) {
            if (boss.curAnim() !== "remove clothes") {
                boss.play("remove clothes");

                const numProjectiles = 8;

                for (let n = 0; n < numProjectiles; n++) {
                    let angle = 360 / numProjectiles * n;
                    angle = ((angle + 180) % 360 + 360) % 360 - 180;
                    attack1({ angle });
                }
            }
        } else if (boss.phase === 4) {
            boss.phaseTimer -= k.dt();
            if (boss.phaseTimer <= 0) {
                if (boss.curAnim() === "run") {
                    boss.play("idle");
                    boss.phaseTimer = boss.idlePhaseTime;
                } else if (boss.curAnim() === "idle") {
                    boss.play("run");
                    boss.phaseTimer = boss.runningPhaseTime;
                }
            }

            if (boss.curAnim() === "run") {
                boss.speed = 200;
                if (boss.shootCd <= 0) {
                    attack3();
                    boss.shootCd = boss.firingSpeed;
                }
            } else if (boss.curAnim() === "idle") {
                boss.speed = 0;
            }
        }

        const healthRatio = boss.hp() / boss.maxHP();
        if (healthRatio < 0.2 && boss.spawnWaveTrigger) {
            spawnWave(1);
            boss.spawnWaveTrigger = false;
        }
    });

    return boss;
}

