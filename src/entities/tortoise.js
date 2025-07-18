import makeEnemy, {
    shoot,
    makeEnemyPath,
    checkEnemyDead,
    checkEnemySight,
    checkTimeFrozen
} from "./enemy";

export default function makeTortoise(k, name, { pos, roomId }) {
    const tortoise = makeEnemy(k, name, { pos, roomId });

    tortoise.use(k.timer());
    tortoise.hideTimer = 0;
    tortoise.hideFlag = true;
    tortoise.hiding = false;

    const player = k.get("player")[0];

    tortoise.on("hurt", () => {
        if (
            tortoise.hideFlag &&
            !tortoise.dead &&
            !k.get("freeze").length
        ) {
            tortoise.hideFlag = false;
            tortoise.play("hide");
        } else if (tortoise.hiding) {
            tortoise.hideTimer = 2.5;
        }
    });

    tortoise.onAnimEnd(anim => {
        if (anim === "hide" && !tortoise.dead) {
            tortoise.hiding = true;
            tortoise.hideTimer = 2.5;
        }
    });

    tortoise.onUpdate(() => {
        if (checkEnemyDead(k, tortoise) || checkTimeFrozen(k, tortoise)) return;
        if (k.get("freeze").length) {
            if (!tortoise.currentAnim) tortoise.currentAnim = tortoise.curAnim();
            tortoise.stop();
            return;
        }

        if (tortoise?.hiding) {
            tortoise.hideTimer -= k.dt();

            if (tortoise.hideTimer <= 0) {
                tortoise.hiding = false;
                tortoise.play("walk");
                tortoise.wait(3, () => tortoise.hideFlag = true);
            } else {
                return;
            }

        }

        checkEnemySight(k, tortoise);
        makeEnemyPath(k, tortoise);

        /*  shooting  */
        if (tortoise.shootCd <= 0 && tortoise.hasSight) {
            // shoot(k, tortoise);

            // const playerPos = player.pos.clone();


            // shoot(k, tortoise, { target: playerPos.add(k.vec2(0, 50)), pSpeed: 180 });
            // shoot(k, tortoise, { target: playerPos.add(k.vec2(0, -50)), pSpeed: 180 });


            // shoot(k, tortoise, { pSpeed: 160 });

            const playerDir = player.pos.sub(tortoise.pos).unit();
            const numProjectiles = 4;
            const radius = 10; // Starting circle radius
            const ringSpeed = 2.5; // How fast the center of the ring moves
            const spreadSpeed = 0.5; // How fast the bullets move outward from center

            const ringCenter = tortoise.pos.clone();
            const centerVelocity = playerDir.scale(ringSpeed);

            for (let i = 0; i < numProjectiles; i++) {
                const angle = (Math.PI * 2 / numProjectiles) * i;
                const offset = k.vec2(Math.cos(angle), Math.sin(angle)).scale(radius);

                const bulletVelocity = centerVelocity.add(offset.unit().scale(spreadSpeed));

                shoot(k, tortoise, {
                    velocity: bulletVelocity
                });
            }

        }

    });
}