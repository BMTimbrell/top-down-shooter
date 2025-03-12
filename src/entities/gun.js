import makeProjectile from "./projectile";

export default function makeGun(k, player, { name }) {
    const gun = player.add([
        k.sprite(name, { anim: "idle" }),
        k.anchor("center"),
        k.pos(0, 10),
        k.scale(0.5),
        k.rotate(0),
        name,
        {
            direction: k.vec2(0),
            fireTrigger: true
        }
    ]);

    gun.onUpdate(() => {
        // remove gun while player is dashing
        if (player.isDashing) {
            gun.unuse("sprite");
            return;
        }

        player.onAnimEnd(anim => {
            if (anim === "dash") {
                gun.use(k.sprite(name, { anim: "idle" }));
            }
        });

        const worldMousePos = k.toWorld(k.mousePos());

        // face direction of mouse
        if (player.direction.x < 0) {
            gun.flipY = true;
        } else {
            gun.flipY = false;
        }

        gun.rotateTo((worldMousePos).angle(gun.worldPos()));

        if (k.isMouseDown() && gun.getCurAnim().name !== "firing") {
            gun.play("firing");
        }

        if (gun.animFrame === 1 && gun.fireTrigger) {
            makeProjectile(k, gun, { name: "bullet" });
            gun.fireTrigger = false;
        } 

        if (gun.animFrame === 2) {
            gun.fireTrigger = true;
        }

        if (!k.isMouseDown() && gun.getCurAnim().name === "firing") {
            gun.getCurAnim().loop = false;
            gun.onAnimEnd(anim => {
                if (anim === "firing") {
                    gun.play("idle");
                }
            });
        }

    });

    return gun;
}