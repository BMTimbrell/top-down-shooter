import { useFlash } from "../utils/shader";
import PathfindingManager from "../utils/PathfindingManager";
import { ENEMY_FACTORIES } from "../constants";
import { shoot, makeEnemyPath, checkEnemyDead, checkEnemySight } from "./enemy";

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
            losTimer: 0.2,
            phase: 1
        }
    ]);

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
        if (boss.dead) {
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

