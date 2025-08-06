import makeEnemy, {
    shoot,
    makeEnemyPath,
    checkEnemyDead,
    checkEnemySight,
    checkTimeFrozen
} from "./enemy";

export default function makeFloatingRock(k, name, { pos, roomId }) {
    const floatingRock = makeEnemy(k, name, { pos, roomId });

    floatingRock.onUpdate(() => {
        if (checkEnemyDead(k, floatingRock) || checkTimeFrozen(k, floatingRock)) return;
        if (k.get("freeze").length) {
            if (!floatingRock.currentAnim) floatingRock.currentAnim = floatingRock.curAnim();
            floatingRock.stop();
            return;
        }

        checkEnemySight(k, floatingRock);
        makeEnemyPath(k, floatingRock);

        /*  shooting  */
        if (floatingRock.shootCd <= 0 && floatingRock.hasSight) {
            const patternPoints = [];

            const hpRatio = floatingRock.hp() / floatingRock.maxHP();
            const isSad = hpRatio < 0.5;

            // Eyes
            patternPoints.push(k.vec2(-5, -5)); // Left eye
            patternPoints.push(k.vec2(5, -5));  // Right eye

            // Mouth (a semi-circle of points)
            const mouthRadius = 6;
            const mouthPoints = 6; // More points = smoother arc

            for (let i = 0; i < mouthPoints; i++) {
                const t = i / (mouthPoints - 1); // 0 to 1
                const angle = isSad
                    ? Math.PI + Math.PI * t   // π to 2π (bottom half)
                    : Math.PI * t;            // 0 to π (top half)

                const x = Math.cos(angle) * mouthRadius;
                const y = Math.sin(angle) * mouthRadius;

                patternPoints.push(k.vec2(x, y));
            }

            const player = k.get("player")[0];

            const playerDir = player.pos.sub(floatingRock.pos).unit();
            const centerVelocity = playerDir.scale(2.5);
            const spreadSpeed = 0.5;

            for (let i = 0; i < patternPoints.length; i++) {
                const offset = patternPoints[i];
                const isMouth = i >= 2;

                const mouthOffset = k.vec2(0, 0.5);

                const bulletVelocity = centerVelocity.add(offset.unit().scale(spreadSpeed)).add(isMouth ? mouthOffset : k.vec2(0, 0));

                shoot(k, floatingRock, {
                    velocity: bulletVelocity,
                });
            }

        }

    });
}