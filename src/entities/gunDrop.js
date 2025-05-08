import { GUNS } from "../constants";

export default function makeGunDrop(k, gunObj, pos) {
    const { 
        name, 
        ammo = gunObj?.ammo ? gunObj.ammo : GUNS[name].maxAmmo,
        clip = gunObj?.clip ? gunObj.clip : GUNS[name].clipSize 
    } = gunObj;

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
        "drop",
        {
            ammo,
            clip
        }
    ]);

    return gun;
}