import { DIAGONAL_FACTOR } from "../constants";
import { GUNS } from '../constants';
import { gameInfoAtom, store } from "../store";

export default function makePlayer(k, posVec2) {

    const player = k.make([
        k.sprite("player", { anim: "idle" }),
        k.scale(5),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 10), 10, 10)
        }),
        k.body(),
        k.pos(posVec2),
        k.timer(),
        "player",
        {
            speed: 200,
            direction: k.vec2(0),
            directionVector: k.vec2(0),
            isDashing: false,
            dashCd: 3,
            dashOnCd: false,
            dashLength: 400,
            onMission: false,
            inDialogue: false,
            guns: [{ name: "pistol", ...GUNS.pistol }, { name: "smg", ...GUNS.smg }],
            mind: { level: 1, exp: 25, maxExp: 50 },
            body: { level: 1, exp: 5, maxExp: 50 },
            weaponLvl: { level: 1, exp: 0, maxExp: 50 }
        }
    ]);


    function setOnMission(onMission = false) {
        if (onMission) {
            player.onMission = true;
            store.set(gameInfoAtom, prev => ({ ...prev, onMission: true }));
        }
    }

    function setPlayerDashing(isDashing) {
        if (isDashing) {
            player.play("dash");
            player.isDashing = true;
            player.dashOnCd = true;
            store.set(gameInfoAtom, prev => ({ ...prev, playerInfo: { ...prev.playerInfo, dashCd: 0 }}));

            player.wait(player.dashCd, () => {
                player.dashOnCd = false;
            });

            // every 0.1s update cd progress
            const interval = 0.1;
            player.loop(interval, () => {
                store.set(gameInfoAtom, prev => ({ ...prev, playerInfo: { ...prev.playerInfo, dashCd: prev.playerInfo.dashCd + interval / player.dashCd }}));
            }, player.dashCd / interval);
        }
    }

    player.use({ setOnMission });
    player.use({ setPlayerDashing });

    player.setOnMission();

    player.onUpdate(() => {
        const worldMousePos = k.toWorld(k.mousePos());
        player.direction = worldMousePos.sub(player.pos).unit();

        if (!k.getCamPos().eq(player.pos)) {
            k.tween(
                k.getCamPos(),
                player.pos,
                0.2,
                newPos => k.setCamPos(newPos),
                k.easings.linear
            );
        }

        // don't do anything while showing dialogue box
        if (player.inDialogue) return;

        // dashing
        if (k.isMouseDown("right") && !player.isDashing && !player.dashOnCd) {
            if (!player.directionVector.eq(k.vec2(0))) {
                if (player.directionVector.x < 0) player.flipX = true;
                else player.flipX = false;
            }

            player.setPlayerDashing(true);
        }

        if (player.isDashing) {
            // dash direction facing if not moving
            if (player.directionVector.eq(k.vec2(0))) {
                if (player.flipX) {
                    player.move(k.vec2(-1, 0).scale(player.dashLength));
                } else {
                    player.move(k.vec2(1, 0).scale(player.dashLength));
                }
            }
            // move same speed diagonally as horizontal and vertically
            if (player.directionVector.x && player.directionVector.y) {
                player.move(player.directionVector.scale(DIAGONAL_FACTOR * player.dashLength));
            } else {
                player.move(player.directionVector.scale(player.dashLength));
            }
            player.onAnimEnd(() => {
                player.isDashing = false;
            });
            return;
        }

        // movement
        player.directionVector = k.vec2(0);
        if (k.isKeyDown("a")) player.directionVector.x = -1;
        if (k.isKeyDown("d")) player.directionVector.x = 1;
        if (k.isKeyDown("w")) player.directionVector.y = -1;
        if (k.isKeyDown("s")) player.directionVector.y = 1;

        // face direction of mouse
        if (player.direction.x < 0) {
            player.flipX = true;
        } else {
            player.flipX = false;
        }

        if (!player.isDashing) {
            if (
                k.isKeyDown("a") ||
                k.isKeyDown("d") ||
                k.isKeyDown("w") ||
                k.isKeyDown("s")
            ) {
                if (!player.onMission && player?.getCurAnim()?.name !== "walk") player.play("walk");
                else if (player.onMission && player?.getCurAnim()?.name !== "walk2") player.play("walk2");
            } else {
                player.play("idle");
            }
        }

        // move same speed diagonally as horizontal and vertically
        if (player.directionVector.x && player.directionVector.y) {
            player.move(player.directionVector.scale(DIAGONAL_FACTOR * player.speed));
            return;
        }

        player.move(player.directionVector.scale(player.speed));
    });

    return player;
}