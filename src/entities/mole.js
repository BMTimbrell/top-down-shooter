import makeEnemy, { 
    shoot, 
    makeEnemyPath, 
    checkEnemyDead, 
    checkEnemySight,
    checkTimeFrozen 
} from "./enemy";

export default function makeMole(k, name, { pos, roomId }) {
    const mole = makeEnemy(k, name, { pos, roomId });

    let dirtPuff, dirtPuff2, crack;

    const spawnDirt = pos => k.add([
        k.sprite("dirtPuff", { anim: "puff" }),
        k.pos(pos),
        k.anchor("center"),
        k.scale(6),
        k.z(99999),
        "dirtPuff",
        "pausable"
    ]);

    mole.use(k.timer());
    mole.digTimer = 0;
    mole.digFlag = true;
    mole.digging = false;
    mole.underground = false;

    mole.on("hurt", () => {
        if (
            mole.digFlag && 
            mole.path.length && 
            !mole.dead && 
            !k.get("freeze").length
        ) {
            mole.digFlag = false;
            mole.play("rotate");
        }
    });

    mole.onDeath(() => {
        if (dirtPuff || dirtPuff2) {
            k.destroy(dirtPuff);
            k.destroy(dirtPuff2);
        }
    });

    mole.onAnimEnd(anim => {
        if (anim === "rotate" && !mole.dead) {
            mole.play("dig");
            dirtPuff = spawnDirt(mole.pos.sub(k.vec2(50, 0)));
            dirtPuff2 = spawnDirt(mole.pos.add(k.vec2(50, 0)));
            mole.digging = true;
            mole.digTimer = 1.5;
        }
    });

    mole.onUpdate(() => {
        if (checkEnemyDead(k, mole) || checkTimeFrozen(k, mole)) return;

        if (mole?.digging) {
            if (!mole.underground) {
                mole.digTimer -= k.dt();
                if (mole.digTimer <= 0) {
                    mole.underground = true;
                    mole.opacity = 0;
                    mole.undergroundTimer = 3;
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
                    mole.unuse("body");
                    mole.unuse("area");
                }
            } else {
                mole.pos = mole.path[mole.path.length - 1];
                dirtPuff.pos = mole.pos;
                crack.pos = dirtPuff.pos.add(k.vec2(0, 20));
                mole.undergroundTimer -= k.dt();
                if (mole.undergroundTimer <= 1) {
                    dirtPuff.opacity = 1;
                    crack.opacity = 1;
                    if (crack.getCurAnim()?.name === "idle") {
                        crack.play("crack");
                    }
                }
                if (mole.undergroundTimer <= 0) {
                    mole.underground = false;
                    mole.digging = false;
                    mole.opacity = 1;
                    k.destroy(dirtPuff);
                    k.destroy(crack);
                    mole.path = [];
                    mole.use(k.body());
                    mole.use(k.area({
                        shape: new k.Rect(k.vec2(0, 0), 20, 20),
                        collisionIgnore: ["enemy"]
                    }));
                    mole.play("walk");
                    mole.wait(3, () => mole.digFlag = true);
                    shoot(k, mole, { shootCd: mole.firingSpeed, pCount: name === "redmole" ? 16 : 8, aStep: name === "redmole" ? 22.5 : 45 });
                }
            }
            return;
        }

        checkEnemySight(k, mole);
        makeEnemyPath(k, mole);

        /*  shooting  */
        if (mole.shootCd <= 0 && mole.hasSight) {
            shoot(k, mole, mole.shootCd);
        }
    });
}