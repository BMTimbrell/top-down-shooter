import makeEnemy, { shoot, makeEnemyPath, checkEnemyDead, checkEnemySight } from "./enemy";

export default function makeWisp(k, name, { pos, roomId }) {
    const wisp = makeEnemy(k, name, { pos, roomId });

    wisp.angryCd = 3;
    wisp.angryTimer = wisp.angryCd;
    wisp.shootDuration = 5;
    wisp.shootTimer = wisp.shootDuration;
    wisp.shooting = false;

    wisp.onAnimEnd(anim => {
        if (anim === "angry") {
            wisp.play("attack");
            wisp.shooting = true;
            wisp.path = [];
        }
    });

    wisp.onUpdate(() => {
        checkEnemyDead(k, wisp);

        const animName = wisp?.getCurAnim()?.name;
        if (animName === "walk") {
            checkEnemySight(k, wisp);
            makeEnemyPath(k, wisp);
            wisp.angryTimer -= k.dt();
        } 

        const shootPos = wisp.pos.add(k.vec2(wisp.shootOffset.x, wisp.shootOffset.y));
        if (wisp.angryTimer <= 0 && wisp.hasSight) {
            wisp.angryTimer = wisp.angryCd;
            wisp.play("angry");
        }

        /*  shooting  */
        if (wisp.shooting) {
            wisp.shootCd -= k.dt();
            wisp.shootTimer -= k.dt();

            if (wisp.shootTimer <= 0) {
                wisp.shootTimer = wisp.shootDuration;
                wisp.play("walk");
                wisp.shooting = false;
            } else if (wisp.shootCd <= 0) {  
                const randomSpread = k.randi(20, -20);
                shoot(k, wisp, { baseAngle: randomSpread });
            }
        }

    });
}