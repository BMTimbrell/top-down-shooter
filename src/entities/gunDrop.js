import { GUNS } from "../constants";

export default function makeGunDrop(k, gunObj, pos) {
    const { name, ammo = GUNS[name].maxAmmo } = gunObj;

    const gun = k.add([
        k.sprite(name, { anim: "idle" }),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0), 10, 10)
        }),
        k.pos(pos),
        k.scale(3),
        k.opacity(1),
        name,
        {
            ammo,
            pickupDelay: 0.5
        },
        "drop"
    ]);

    gun.onUpdate(() => {
        if (gun.pickupDelay > 0) {
            gun.pickupDelay -= k.dt();
        }
    });

    return gun;
}