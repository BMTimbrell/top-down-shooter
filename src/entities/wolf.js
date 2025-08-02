import makeEnemy, {
    shoot,
    makeEnemyPath,
    checkEnemyDead,
    checkEnemySight,
    checkTimeFrozen
} from "./enemy";

export default function makeWolf(k, name, { pos, roomId }) {
    const range = 150;
    const wolf = makeEnemy(k, name, { pos, roomId, maxRange: range, minRange: 0 });

    wolf.range = range;
    wolf.maxShootRange = 300;
    wolf.shooting = false;

    const player = k.get("player")[0];

    wolf.onUpdate(() => {
        if (checkEnemyDead(k, wolf) || checkTimeFrozen(k, wolf)) return;

        checkEnemySight(k, wolf);

        const animName = wolf?.getCurAnim()?.name;
        if (animName === "walk") {
            makeEnemyPath(k, wolf);
        }

        if (wolf.pos.dist(player.pos) <= wolf.range && wolf.hasSight) {
            wolf.play("attack");
            wolf.shooting = true;
            wolf.path = [];
        }

        /*  shooting  */
        if (wolf.shooting) {
            wolf.shootCd -= k.dt();
            const dir = wolf.pos.sub(player.pos).unit();
            if (dir.x > 0.25 || dir.x < -0.25) wolf.flipX = dir.x > 0;

            if (wolf.pos.dist(player.pos) >= wolf.maxShootRange || !wolf.hasSight) {
                wolf.play("walk");
                wolf.shooting = false;
            } else if (wolf.shootCd <= 0) {
                const randomSpread = k.randi(20, -20);
                shoot(k, wolf, { baseAngle: randomSpread, aStep: 60 });
            }
        }

    });
}