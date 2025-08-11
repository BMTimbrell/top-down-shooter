import { useFlash } from "../utils/shader";
import PathfindingManager from "../utils/PathfindingManager";
import { CELL_SIZE } from "../constants";
import { shoot, makeEnemyPath, checkTimeFrozen } from "./enemy";
import { store, victoryScreenAtom, gameInfoAtom } from "../store";
import makeProjectile from "./projectile";

export default function makeFloatingRockBoss(k, name, { pos, roomId }) {
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
        k.health(600, 600),
        k.opacity(1),
        k.offscreen({ hide: true }),
        k.timer(),
        "enemy",
        "pausable",
        name,
        {
            name,
            path: [],
            shooting: false,
            firingSpeed: 0.5,
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
            orbTimer: 1,
            orbInterval: 0.25,
            shootOffset: { x: 0, y: 0 },
            phase: 1,
            phase3ShootOffset: -180,
            waitTrigger: true,
            sunCount: 3
        }
    ]);

    let oldPlayerPos;

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
                finalMission: true,
                onClick: () => {
                    store.set(victoryScreenAtom, prev => ({
                        ...prev,
                        visible: false
                    }));

                    k.go("main menu", { player: k.get("player")[0], gameState: k.get("gameState")[0] });
                },
                rewards: ["1000", "+25 weapon xp", "Saving humanity"]
            }));
        }
    });

    function attack1() {
        if (boss.shootCd <= 0) {
            const randomSpread = k.randi(-40, 40);
            const player = k.get("player")[0];

            const patternPoints = [];

            const hpRatio = boss.hp() / boss.maxHP();
            const isSad = hpRatio < 0.5;

            // Eyes
            patternPoints.push(k.vec2(-5, -5)); // Left eye
            patternPoints.push(k.vec2(5, -5));  // Right eye

            // Mouth (a semi-circle of points)
            const mouthRadius = 6;
            const mouthPoints = 6;

            for (let i = 0; i < mouthPoints; i++) {
                const t = i / (mouthPoints - 1); // 0 to 1
                const angle = isSad
                    ? Math.PI + Math.PI * t   // π to 2π (bottom half)
                    : Math.PI * t;            // 0 to π (top half)

                const x = Math.cos(angle) * mouthRadius;
                const y = Math.sin(angle) * mouthRadius;

                patternPoints.push(k.vec2(x, y));
            }

            const playerVel = player.pos.sub(oldPlayerPos).scale(1 / k.dt());
            const predictedTime = 1;
            // predict player position unless dashing
            const predictedPos = player.pos.add(player.dashing ? k.vec2(0) : playerVel.scale(predictedTime));

            const playerDir = k.Vec2.fromAngle(predictedPos.angle(boss.pos) + randomSpread);
            const centerVelocity = playerDir.scale(2.5);
            const spreadSpeed = 0.5;

            for (let i = 0; i < patternPoints.length; i++) {
                const offset = patternPoints[i];
                const isMouth = i >= 2;

                const mouthOffset = k.vec2(0, 0.5);

                const bulletVelocity = centerVelocity.add(offset.unit().scale(spreadSpeed)).add(isMouth ? mouthOffset : k.vec2(0, 0));

                shoot(k, boss, {
                    velocity: bulletVelocity,
                });
            }
        }
    }

    function attack2() {
        const purpleOrb = k.add([
            k.sprite("purple orb", { anim: "rise" }),
            k.scale(4),
            "purple orb",
            "pausable",
            k.anchor("center"),
            k.pos(boss.pos.add(k.vec2(0, -150))),
            k.timer()
        ]);

        purpleOrb.onAnimEnd(anim => {
            if (anim === "rise") {
                k.destroy(purpleOrb);
            }
        });
    }

    function attack3(k) {
        shoot(k, boss, { target: oldPlayerPos, baseAngle: boss.phase3ShootOffset, aStep: 90, pCount: 4 });
        boss.phase3ShootOffset += 20;
        if (boss.phase3ShootOffset >= 180) {
            boss.phase3ShootOffset = -180;
        }
    }

    function attack4() {
        const target = k.get("player")[0].pos;

        const sunProjectile = k.add([
            k.sprite("sunProjectile"),
            k.pos(boss.pos),
            "sunProjectile",
            "pausable",
            k.scale(4),
            k.anchor("center"),
            k.area({
                shape: new k.Rect(k.vec2(0), 40, 40)
            }),
            k.offscreen({ hide: true }),
            k.move(target.angle(boss.pos), 200),
            {
                shootOffset: { x: 0, y: 0 }
            }
        ]);

        boss.sunCount--;

        sunProjectile.onCollideUpdate(obj => {
            if (obj.is("boundary") || obj.is("player")) {
                const pCount = 8;
                const speed = 3.5;
                const outerRadius1 = 50;
                const outerRadius2 = 100;
                const center = sunProjectile.pos;

                for (let i = 0; i < pCount; i++) {
                    const angle = (2 * Math.PI * i) / pCount;
                    const innerDir = k.vec2(Math.cos(angle), Math.sin(angle));
                    const outerDir2 = innerDir;

                    makeProjectile(k, {
                        pos: center,
                        damage: 5,
                    }, {
                        name: "enemyProjectile",
                        friendly: false,
                        lifespan: 5,
                        velocity: innerDir.scale(speed)
                    });

                    const offsetAngle = angle + Math.PI / pCount;
                    const outerDir1 = k.vec2(Math.cos(offsetAngle), Math.sin(offsetAngle));

                    makeProjectile(k, {
                        pos: center.add(outerDir1.scale(outerRadius1)),
                        damage: 5,
                    }, {
                        name: "enemyProjectile",
                        friendly: false,
                        lifespan: 5,
                        velocity: outerDir1.scale(speed)
                    });

                    makeProjectile(k, {
                        pos: center.add(outerDir2.scale(outerRadius2)),
                        damage: 5,
                    }, {
                        name: "enemyProjectile",
                        friendly: false,
                        lifespan: 5,
                        velocity: outerDir2.scale(speed)
                    });
                }

                k.destroy(sunProjectile);
            }
        });

        sunProjectile.onUpdate(() => {
            if (k.get("freeze").length) {
                sunProjectile.unuse("move");
            } else if (!sunProjectile.has("move")) {
                sunProjectile.use(k.move(target ? target.angle(boss.pos) : angle, 200));
            }
        });
    }

    boss.onUpdate(() => {
        if (checkTimeFrozen(k, boss)) {
            k.get("purple orb").forEach(p => {
                p.paused = true;
            });
            return;
        }

        if (boss.dead) {
            k.destroy(healthBar);
            k.destroy(healthBarBg);
            boss.opacity -= k.dt() * 0.5;
            k.get("enemyProjectile").forEach(e => k.destroy(e));
            k.get("sunProjectile").forEach(e => k.destroy(e));
            k.get("purple orb").forEach(e => k.destroy(e));
            return;
        }

        boss.phaseTimer -= k.dt();
        makeEnemyPath(k, boss);

        if (boss.phase === 1) {
            attack1();

            oldPlayerPos = k.get("player")[0].pos;

            if (boss.phaseTimer <= 0) {
                boss.phase = 2;
                boss.firingSpeed = 0.75;
                boss.shootCd = 0;
                boss.phaseTimer = 7;
            }
        } else if (boss.phase === 2) {
            /*  shooting  */
            boss.orbTimer -= k.dt();

            if (boss.shootCd <= 0 && boss.phaseTimer > 0) {
                attack2();
                boss.shootCd = boss.firingSpeed;
            }

            if (boss.orbTimer <= 0) {
                const targetPlayer = k.randi(0, 4) === 0;
                const player = k.get("player")[0];
                const playerVel = player.pos.sub(oldPlayerPos).scale(1 / k.dt());
                const predictedTime = 0.5;
                const predictedPos = k.get("player")[0].pos.add(playerVel.scale(predictedTime));

                const orbYOffset = 40;
                const orbPos = {
                    x: targetPlayer ? predictedPos.x : k.randi(room.pos.x + CELL_SIZE, room.pos.x + room.area.shape.width - CELL_SIZE),
                    y: targetPlayer ? predictedPos.y + orbYOffset : k.randi(room.pos.y + CELL_SIZE, room.pos.y + room.area.shape.height - CELL_SIZE)
                };

                const orb = k.add([
                    k.sprite("purple orb", { anim: "fall" }),
                    k.scale(4),
                    k.area({
                        shape: new k.Rect(k.vec2(0, -5), 20, 20)
                    }),
                    "purple orb",
                    "pausable",
                    k.anchor("bot"),
                    k.pos(k.vec2(orbPos.x, orbPos.y))
                ]);

                orb.onCollideUpdate("player", () => {
                    const player = k.get("player")[0];

                    if (
                        orb.animFrame > 11 &&
                        !player.invincible &&
                        !k.get("force field")?.length &&
                        !player.dashing
                    ) {
                        player.hurt(1);
                    }
                });

                orb.onAnimEnd(anim => {
                    if (anim === "fall") k.destroy(orb);
                });

                boss.orbTimer = boss.orbInterval;
            }

            oldPlayerPos = k.get("player")[0].pos;

            if (boss.phaseTimer <= 0 && boss.waitTrigger) {
                boss.waitTrigger = false;
                boss.wait(1, () => {
                    boss.phase = 3;
                    boss.firingSpeed = 0.3;
                    boss.shootCd = 0;
                    boss.orbTimer = 1;
                    boss.phaseTimer = 5;
                    boss.waitTrigger = true;
                });
            }
        } else if (boss.phase === 3) {
            if (boss.shootCd <= 0) {
                attack3(k);
            }

            if (boss.phaseTimer <= 0) {
                boss.phase = 4;
                boss.firingSpeed = 1.5;
                boss.shootCd = 1;
                boss.phaseTimer = 5;
                boss.phase3ShootOffset = -180;
            }
        } else if (boss.phase === 4) {
            if (boss.shootCd <= 0 && boss.sunCount > 0) {
                attack4();
                boss.shootCd = boss.firingSpeed;
            }

            if (boss.phaseTimer <= 0 && boss.sunCount <= 0) {
                if (boss.waitTrigger) {
                    boss.firingSpeed = 0.25;
                    boss.speed = 400;
                    boss.minRange = 0;
                    boss.shootCd = 0;
                    boss.waitTrigger = false;
                    boss.wait(1.5, () => {
                        boss.phase = 1;
                        boss.firingSpeed = 0.5;
                        boss.speed = 50;
                        boss.phaseTimer = 5;
                        boss.shootCd = 0;
                        boss.waitTrigger = true;
                        boss.minRange = 100;
                        boss.sunCount = 3;
                    });
                }
                if (boss.shootCd <= 0) {
                    shoot(k, boss, { pCount: 6, aStep: 15, pSpeed: 300 });
                }
            }
        }
    });

    return boss;
}

