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
        if (checkEnemyDead(k, wisp)) return;

        const animName = wisp?.getCurAnim()?.name;
        if (animName === "walk") {
            checkEnemySight(k, wisp);
            makeEnemyPath(k, wisp);
            wisp.angryTimer -= k.dt();
        } 

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