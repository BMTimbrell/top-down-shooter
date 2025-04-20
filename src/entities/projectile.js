export default function makeProjectile(k, gun, { name, lifespan = 1.5, friendly = true }) {
    const target = friendly ? k.toWorld(k.mousePos()) : k.get("player")[0].pos;

    const projectile = k.add([
        k.sprite(name, { anim: "idle" }),
        k.pos(gun.worldPos()),
        k.rotate(k.toWorld(k.mousePos()).angle(gun.worldPos())),
        k.anchor("center"),
        k.scale(2),
        k.area({
            shape: new k.Rect(k.vec2(0), 10, 10),
        }),
        name,
        k.move(k.toWorld(k.mousePos()).angle(gun.worldPos()), 700),
        k.offscreen({ hide: true }),
        {
            lifespan
        },
        k.timer()
    ]);

    projectile.wait(projectile.lifespan, () => {
        k.destroy(projectile);
    });

    const collisions = ["boulder", "boundary", "enemy"];

    projectile.onCollide(obj => {
        if (collisions.some(e => obj.is(e))) {
            if (obj.is("enemy")) {
                obj.hurt(gun.damage);
            }
            k.destroy(projectile);
        }
    });

    return projectile;
}