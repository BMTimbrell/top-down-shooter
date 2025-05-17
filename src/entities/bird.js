import makeEnemy, { shoot, makeEnemyPath, checkEnemyDead, checkEnemySight } from "./enemy";

export default function makeBird(k, name, { pos, roomId }) {
    const bird = makeEnemy(k, name, { pos, roomId });

    bird.onUpdate(() => {
        checkEnemyDead(k, bird);

        checkEnemySight(k, bird);
        makeEnemyPath(k, bird);

        /*  shooting  */
        const player = k.get("player")[0];
        const shootPos = bird.pos.add(k.vec2(bird.shootOffset.x, bird.shootOffset.y));
        if (bird.shootCd <= 0 && bird.hasSight) {
            shoot(k, bird, bird.shootCd);
        }

    });
}