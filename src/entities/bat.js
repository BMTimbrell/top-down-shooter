import makeEnemy, {
    shoot,
    makeEnemyPath,
    checkEnemyDead,
    checkEnemySight,
    checkTimeFrozen
} from "./enemy";

import { getInterceptPoint, hasLineOfSight } from "../utils/collision";

export default function makeBat(k, name, { pos, roomId }) {
    const bat = makeEnemy(k, name, { pos, roomId });

    const player = k.get("player")[0];
    let playerOldPos = player.pos;

    bat.onUpdate(() => {
        if (checkEnemyDead(k, bat) || checkTimeFrozen(k, bat)) return;
        if (k.get("freeze").length) {
            if (!bat.currentAnim) bat.currentAnim = bat.curAnim();
            bat.stop();
            return;
        }

        checkEnemySight(k, bat);
        makeEnemyPath(k, bat);

        /*  shooting  */
        if (bat.shootCd <= 0 && bat.hasSight) {
            const playerVel = player.pos.sub(playerOldPos).scale(1 / k.dt());

            const target = getInterceptPoint(bat.pos, player.pos, playerVel, 400);

            if (hasLineOfSight(
                k,
                bat.pos.add(k.vec2(bat.shootOffset.x, bat.shootOffset.y)),
                target
            )) {
                shoot(k, bat, { target });
            } else shoot(k, bat);

        }

        playerOldPos = player.pos;

    });
}