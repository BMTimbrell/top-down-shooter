import { DIAGONAL_FACTOR } from "../constants";
import makeGun from "./gun";

export default function makePlayer(k, posVec2) {
    const player = k.add([
        k.sprite("player", { anim: "idle" }),
        k.scale(5),
        k.anchor("center"),
        k.area(),
        k.pos(posVec2),
        "player",
        {
            speed: 200,
            direction: k.vec2(0),
            directionVector: k.vec2(0),
            isDashing: false,
            dashCd: 3,
            dashOnCd: false,
            dashLength: 400
        }
    ]);

    makeGun(k, player, { name: "pistol" });

    player.onUpdate(() => {
        const worldMousePos = k.toWorld(k.mousePos());
        player.direction = worldMousePos.sub(player.pos).unit();

        // dashing
        if (k.isKeyDown("shift") && !player.isDashing && !player.dashOnCd) {
            player.play("dash");
            player.isDashing = true;
            player.dashOnCd = true;
            k.wait(player.dashCd, () => {
                player.dashOnCd = false;
            });               
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
        
        if (player.directionVector.eq(k.vec2(0)) && !player.isDashing) {
            player.play("idle");
        } else if (!player.isDashing && !player.directionVector.eq(k.vec2(0)) && player?.getCurAnim()?.name !== "walk") {
            player.play("walk");
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