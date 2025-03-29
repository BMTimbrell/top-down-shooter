export default function makeProjectile(k, gun, { name }) {
    const projectile = k.add([
        k.sprite(name, { anim: "idle" }),
        k.pos(gun.worldPos()),
        k.rotate(k.toWorld(k.mousePos()).angle(gun.worldPos())),
        k.anchor("center"),
        k.scale(2),
        k.area(),
        name,
        k.move(k.toWorld(k.mousePos()).angle(gun.worldPos()), 700),
        k.offscreen({ destroy: true }),
    ]);

    projectile.onCollide("boundary", () => {
        k.destroy(projectile);
    });

    return projectile;
}