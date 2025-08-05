import { useFlash } from "../utils/shader";
import PathfindingManager from "../utils/PathfindingManager";
import { ENEMY_FACTORIES, CELL_SIZE } from "../constants";
import { shoot, makeEnemyPath, checkTimeFrozen } from "./enemy";
import { store, victoryScreenAtom, gameInfoAtom } from "../store";

export default function makeMoleBoss(k, name, { pos, roomId }) {
    const boss = k.add([
        k.sprite(name, { anim: "walk" }),
        k.scale(4),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 0), 45, 45),
            collisionIgnore: ["enemy"]
        }),
        k.body(),
        k.pos(pos),
        k.health(300, 300),
        k.opacity(1),
        k.offscreen({ hide: true }),
        "enemy",
        "pausable",
        name,
        {
            name,
            path: [],
            shooting: false,
            firingSpeed: 0.25,
            speed: 50,
            dead: false,
            roomId,
            pathTimer: 0,
            shootAngle: 0,
            attack1Count: 0,
            shootDistance: k.randi(100, 500),
            shootCd: 0.5,
            damage: 5,
            minRange: 100,
            maxRange: 500,
            shootOffset: { x: 0, y: 0 },
            boulderTimer: 0,
            boulderInterval: 0.25,
            spawn1Trigger: true,
            spawn2Trigger: true,
            phase: 1
        }
    ]);

    let dirtPuff, dirtPuff2, crack, oldPlayerPos;

    const spawnDirt = pos => k.add([
        k.sprite("dirtPuff", { anim: "puff" }),
        k.pos(pos),
        k.anchor("center"),
        k.scale(6),
        k.z(99999),
        "dirtPuff"
    ]);

    boss.use(k.timer());
    boss.digTimer = 0;
    boss.digFlag = true;
    boss.digging = false;
    boss.underground = false;

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
        healthBarBg.opacity = boss.underground ? 0 : 1;

        healthBarBg.pos = boss.pos.sub(k.vec2((healthBarBg.width * 4) / 2, 140));
    });

    healthBar.onUpdate(() => {
        healthBar.opacity = boss.underground ? 0 : 1;

        healthBar.pos = boss.pos.sub(k.vec2((healthBarBg.width * 4) / 2, 140));

        if (!boss.underground) healthBar.updateFill(boss.hp(), boss.maxHP());
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
        })
    });

    boss.on("death", () => {
        boss.dead = true;
        boss.unuse("body");
        boss.play("dying");
    });

    boss.onAnimEnd(anim => {
        if (anim === "dying") {
            k.destroy(boss);

            k.get("gameState")[0].nextLevel = "level3";

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
                            daysUntilMission: 7,
                            time
                        })
                    );

                    k.go("room", {
                        player: k.get("player")[0],
                        gameState: k.get("gameState")[0]
                    });
                },
                rewards: ["750", "+15 weapon xp"]
            }));

            const player = k.get("player")[0];
            player.weapon.exp += 15;
            store.set(
                gameInfoAtom,
                prev => ({
                    ...prev,
                    gold: prev.gold + 750
                })
            );
            player.setOnMission(false);
        } else if (anim === "crouch" && !boss.dead) {
            boss.digTimer = 1.5;
            boss.play("dig");
            dirtPuff = spawnDirt(boss.pos.sub(k.vec2(50, -20)));
            dirtPuff2 = spawnDirt(boss.pos.add(k.vec2(50, 20)));
            boss.digging = true;
        }
    });

    function spawnWave(wNum) {
        const reinforcements = k.get("gameState")[0].reinforcements.filter(
            e => e.roomId === boss.roomId
        ).slice(0, 2);

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

            if (wNum === 1) k.get("gameState")[0].reinforcements = k.get("gameState")[0].reinforcements.filter(
                e => e.roomId === boss.roomId
            ).slice(2, 4);
            if (wNum === 2) k.get("gameState")[0].reinforcements = [];
        }
    }

    function attack1() {
        if (boss.shootCd <= 0) {
            shoot(k, boss, { pCount: 1, baseAngle: -90 + boss.shootAngle });
            shoot(k, boss, { pCount: 1, baseAngle: 90 - boss.shootAngle });

            if (boss.shootAngle >= 130) {
                boss.shootAngle = 0;
                boss.attack1Count++;
            } else boss.shootAngle += 30;


            if (boss.attack1Count >= 5) {
                boss.shootAngle = 0;
                boss.attack1Count = 0;
                boss.phase++;
                boss.boulderTimer = 0;
                oldPlayerPos = k.get("player")[0];
            }
        }
    }

    boss.onUpdate(() => {
        if (checkTimeFrozen(k, boss)) return;

        if (boss.dead) {
            k.destroy(healthBar);
            k.destroy(healthBarBg);
            boss.opacity -= k.dt() * 0.5;
            k.get("enemy").filter(e => !e.is("moleboss")).forEach(e => e.hurt(e.hp()));
            k.get("enemyProjectile").forEach(e => k.destroy(e));
            return;
        }

        if (boss.curAnim() === "dig" && !boss.underground) k.shake(1);

        if (boss.digging) {
            if (!boss.underground) {
                boss.digTimer -= k.dt();
                if (boss.digTimer <= 0) {
                    boss.underground = true;
                    boss.opacity = 0;
                    boss.undergroundTimer = 3;
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
                    boss.unuse("body");
                    boss.unuse("area");
                }
            } else {
                boss.pos = boss.path[boss.path.length - 1];
                dirtPuff.pos = boss.pos;
                crack.pos = dirtPuff.pos.add(k.vec2(0, 20));
                boss.undergroundTimer -= k.dt();
                if (boss.undergroundTimer <= 1) {
                    dirtPuff.opacity = 1;
                    crack.opacity = 1;
                    if (crack.getCurAnim()?.name === "idle") {
                        crack.play("crack");
                    }
                }
                if (boss.undergroundTimer <= 0) {
                    boss.digging = false;
                    boss.opacity = 1;
                    k.destroy(dirtPuff);
                    k.destroy(crack);
                    boss.path = [];
                    boss.use(k.body());
                    boss.use(k.area({
                        shape: new k.Rect(k.vec2(0, 0), 45, 45),
                        collisionIgnore: ["enemy"]
                    }));
                    boss.underground = false;
                    boss.play("walk");



                    const numRings = 8;              // Number of rings
                    const numProjectiles = 4;        // Projectiles per ring
                    const ringSpacing = 45;           // How far apart the rings are in space
                    const ringSpeed = 2.5;           // Forward movement speed
                    const spreadSpeed = 0.5;         // Outward speed from center line

                    for (let r = 1; r <= numRings; r++) {
                        const ringAngle = ringSpacing * r;

                        const dir = k.Vec2.fromAngle(ringAngle);
                        const centerVelocity = dir.scale(ringSpeed);

                        for (let i = 0; i < numProjectiles; i++) {
                            const angle = (Math.PI * 2 / numProjectiles) * i;
                            const spreadDir = k.vec2(Math.cos(angle), Math.sin(angle));

                            // This will make a circle centered around the forward direction
                            const bulletVelocity = centerVelocity.add(spreadDir.scale(spreadSpeed));

                            shoot(k, boss, {
                                velocity: bulletVelocity
                            });
                        }
                    }

                    boss.phase = 0;

                    boss.wait(1.5, () => boss.phase = 1);
                }
            }
        }

        if (boss.phase !== 2) makeEnemyPath(k, boss);

        if (boss.phase === 1) {
            /*  shooting  */
            attack1();
        } else if (boss.phase === 2) {
            if (boss.curAnim() !== "crouch" && boss.curAnim() !== "dig") {
                boss.play("crouch");
            }

            if (boss.curAnim() === "dig") {
                boss.boulderTimer -= k.dt();
                const hitPlayer = k.randi(0, 4) === 1;
                const player = k.get("player")[0];
                const playerVel = player.pos.sub(oldPlayerPos).scale(1 / k.dt()).scale(boss.boulderInterval + 0.5);
                const playerPos = k.get("player")[0].pos.add(playerVel);
                oldPlayerPos = k.get("player")[0].pos;
                const boulderPos = { 
                    x: hitPlayer ? playerPos.x : k.randi(room.pos.x + CELL_SIZE, room.pos.x + room.area.shape.width - CELL_SIZE),
                    y: hitPlayer ? playerPos.y : k.randi(room.pos.y + CELL_SIZE, room.pos.y + room.area.shape.height - CELL_SIZE)
                }

                if (boss.boulderTimer <= 0) {
                    const boulder = k.add([
                        k.sprite("falling boulder", { anim: "idle" }),
                        k.scale(4),
                        k.area({
                            shape: new k.Rect(k.vec2(0, 15), 20, 20)
                        }),
                        "pausable",
                        k.anchor("center"),
                        k.pos(k.vec2(boulderPos.x, boulderPos.y).add(k.vec2(0, -15).scale(4))),
                        k.timer()
                    ]);

                    boulder.onCollideUpdate("player", () => {
                        const player = k.get("player")[0];

                        if (
                            boulder.animFrame > 16 && 
                            !player.invincible && 
                            !k.get("force field")?.length &&
                            !player.dashing
                        ) {
                            player.hurt(1);
                        }
                    });

                    boulder.onAnimEnd(anim => {
                        if (anim === "fall") k.destroy(boulder);
                    });
                    boulder.wait(0.5, () => boulder.play("fall"));
                    boss.boulderTimer = boss.boulderInterval;
                }
            }

        }

        const healthRatio = boss.hp() / boss.maxHP();
        if (healthRatio < 0.6 && boss.spawn1Trigger) {
            spawnWave(1);
            boss.spawn1Trigger = false;
        } else if (healthRatio < 0.4 && boss.spawn2Trigger) {
            spawnWave(2);
            boss.spawn2Trigger = false;
        }
    });

    return boss;
}

