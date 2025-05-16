import makeEnemy, { shoot, makeEnemyPath, checkEnemyDead } from "./enemy";
import { hasLineOfSight } from "../utils/collision";

export default function makeBird(k, name, { pos, roomId }) {
    const bird = makeEnemy(k, name, { pos, roomId });

    bird.onUpdate(() => {
        checkEnemyDead(k, bird);

        makeEnemyPath(k, bird);

        /*  shooting  */
        const player = k.get("player")[0];
        if (bird.shootCd <= 0 && hasLineOfSight(k, bird.pos, player.pos)) {
            shoot(k, bird, bird.shootCd);
        }

    });
}