import makeEnemy, { shoot, makeEnemyPath, checkEnemyDead, checkEnemySight } from "./enemy";

export default function makeBird(k, name, { pos, roomId }) {
    const bird = makeEnemy(k, name, { pos, roomId });

    bird.onUpdate(() => {
        if (checkEnemyDead(k, bird)) return;

        checkEnemySight(k, bird);
        makeEnemyPath(k, bird);

        /*  shooting  */
        if (bird.shootCd <= 0 && bird.hasSight) {
            shoot(k, bird);
        }

    });
}