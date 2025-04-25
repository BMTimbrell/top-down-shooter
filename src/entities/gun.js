import makeProjectile from "./projectile";
import { GUN_OFFSET, GUNS } from "../constants";

export default function makeGun(k, player, gunObj) {
    const { 
        name, 
        damage, 
        firingInterval, 
        ammo, 
        clip, 
        projectileSpeed 
    } = gunObj;

    const gun = k.add([
        k.sprite(name, { anim: "idle" }),
        k.anchor("center"),
        k.pos(player.pos.x, player.pos.y + GUN_OFFSET),
        k.scale(3),
        k.rotate(0),
        name,
        {
            direction: k.vec2(0),
            fireTrigger: true,
            damage,
            firingInterval,
            ammo,
            clip,
            projectileSpeed
        }
    ]);

    gun.onUpdate(() => {
        if (player.guns[player.gunIndex] !== gunObj) gun.destroy();

        gun.pos = k.vec2(player.pos.x, player.pos.y + GUN_OFFSET);
        if (gun.fireTrigger && gun.firingInterval > 0) gun.firingInterval--;

        // remove gun while player is dashing
        if (player.isDashing) {
            gun.opacity = 0;
            return;
        }

        player.onAnimEnd(anim => {
            if (anim === "dash") {
                gun.opacity = 1;
            }
        });

        const worldMousePos = k.toWorld(k.mousePos());

        // face direction of mouse
        if (player.direction.x < 0) {
            gun.flipY = true;
        } else {
            gun.flipY = false;
        }

        gun.rotateTo((worldMousePos).angle(gun.pos));

        if (
            k.isMouseDown() && gun.getCurAnim().name !== "firing" && 
            gun.firingInterval <= 0 &&
            !player.reloading
        ) {
            if (gunObj.clip <= 0) {
                player.reload();
            } else{
                gun.play("firing");
            }
        }

        if (gun.animFrame === 1 && gun.fireTrigger) {
            makeProjectile(k, gun, { name: "bullet", lifespan: 1 });
            player.loseAmmo();
            gun.fireTrigger = false;
        } 

        if (gun.animFrame === 2) {
            gun.fireTrigger = true;
        }

        if (gun.getCurAnim().name === "firing") {
            gun.getCurAnim().loop = false;
            gun.onAnimEnd(anim => {
                if (anim === "firing") {
                    gun.firingInterval = GUNS[name].firingInterval;
                    gun.play("idle");
                }
            });
        }

    });

    return gun;
}