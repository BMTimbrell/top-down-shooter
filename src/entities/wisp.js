import makeEnemy, { shoot, makeEnemyPath, checkEnemyDead } from "./enemy";
import { hasLineOfSight } from "../utils/collision";

export default function makeWisp(k, name, { pos, roomId }) {
    const wisp = makeEnemy(k, name, { pos, roomId });

    wisp.onUpdate(() => {
        checkEnemyDead(k, wisp);

        makeEnemyPath(k, wisp);

        /*  shooting  */
        const player = k.get("player")[0];
        if (wisp.shootCd <= 0 && hasLineOfSight(k, wisp.pos, player.pos)) {
            shoot(k, wisp, wisp.shootCd);
        }

    });
}