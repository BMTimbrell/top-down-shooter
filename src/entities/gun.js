import makeProjectile from "./projectile";
import { GUNS } from "../constants";

export default function makeGun(k, player, gunObj) {
    const {
        name,
        projectile,
        damage,
        firingInterval,
        ammo,
        clip,
        projectileSpeed,
        offset
    } = gunObj;

    const gun = k.add([
        k.sprite(name, { anim: "idle" }),
        k.anchor("center"),
        k.pos(player.pos.x + offset.x, player.pos.y + offset.y),
        k.scale(3),
        k.rotate(0),
        k.opacity(1),
        name,
        "pausable",
        {
            direction: k.vec2(0),
            fireTrigger: true,
            damage,
            firingInterval,
            ammo,
            clip,
            projectileSpeed,
            pulseTimer: 0,
            pulseDuration: 0.3,
            projectile,
            ...(gunObj?.pOffset ? { pOffset: gunObj.pOffset } : "")
        }
    ]);

    let prevOpacity = gun.opacity;

    gun.onAnimEnd(anim => {
        if (anim === "firing") {
            gun.firingInterval = GUNS[name].firingInterval;
            gun.play("idle");
        }
    });

    gun.onUpdate(() => {
        if (player.guns[player.gunIndex] !== gunObj) gun.destroy();

        gun.pos = k.vec2(player.pos.x + (gun.flipY ? -offset.x : offset.x), player.pos.y + offset.y);
        if (gun.fireTrigger && gun.firingInterval > 0) gun.firingInterval -= k.dt();

        // fade gun in and out when dashing
        gun.opacity = player.dashing ? Math.max(0, gun.opacity - 5 * k.dt()) : Math.min(1, gun.opacity + 5 * k.dt());

        if (player.dashing) {
            // reset fire state
            if (gun.getCurAnim().name !== "firing") {
                gun.fireTrigger = true;
            }

            return;
        }

        // pulse after fade in
        if (prevOpacity < 1 && gun.opacity === 1) {
            gun.pulseTimer = gun.pulseDuration;
        }
        prevOpacity = gun.opacity;

        if (gun.pulseTimer > 0) {
            gun.pulseTimer -= k.dt();

            const t = 1 - gun.pulseTimer / gun.pulseDuration;

            const decay = 2;
            const scaleBoost = Math.sin(t * Math.PI) * Math.exp(-t * decay);

            gun.scale = k.vec2(3).add(k.vec2(scaleBoost));
        } else gun.scaleTo = k.vec2(3);

        const worldMousePos = k.toWorld(k.mousePos());

        // face direction of mouse
        if (player.direction.x < 0) {
            gun.flipY = true;
        } else {
            gun.flipY = false;
        }

        gun.rotateTo((worldMousePos).angle(gun.pos));

        if (
            k.isMouseDown() &&
            gun.getCurAnim().name !== "firing" &&
            gun.firingInterval <= 0 &&
            !player.reloading
        ) {
            if (gunObj.clip <= 0) {
                player.reload();
            } else {
                gun.play("firing");
            }
        }

        if (gun.animFrame === 1 && gun.fireTrigger) {
            const pellets = gunObj.pelletCount || 1;
            const spread = gunObj.pelletSpread || 0;
            const speedVariation = gunObj.pelletSpeedVariation || 0;

            for (let i = 0; i < pellets; i++) {
                const randomSpread = k.randi(-spread, spread);
                const randomSpeedOffset = k.randi(-speedVariation, speedVariation);

                makeProjectile(
                    k,
                    gun,
                    {
                        name: projectile,
                        spread: randomSpread,
                        speedOffset: randomSpeedOffset,
                        lifespan: gunObj.projectileLifespan,
                        pierce: gunObj.pierce || 0
                    }
                );
            }

            player.loseAmmo();
            gun.fireTrigger = false;
        }

        if (gun.animFrame === 2) {
            gun.fireTrigger = true;
        }

    });

    return gun;
}