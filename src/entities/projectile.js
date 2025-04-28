export default function makeProjectile(
    k, 
    gun, 
    { 
        name, 
        lifespan = 1.5, 
        friendly = true, 
        spread = 0 ,
        speedOffset = 0
    }) {

    const target = (friendly ? k.toWorld(k.mousePos()) : k.get("player")[0].pos).angle(gun.pos) + spread;
    const projectileSpeed = gun.projectileSpeed + speedOffset;

    const projectile = k.add([
        k.sprite(name, { anim: "idle" }),
        k.pos(gun.pos),
        k.rotate(
            friendly ? k.toWorld(k.mousePos()).angle(gun.worldPos()) + spread : 0
        ),
        k.anchor("center"),
        k.scale(4),
        k.area({
            shape: new k.Rect(k.vec2(0), 10, 10),
        }),
        name,
        k.move(
            target, 
            projectileSpeed
        ),
        k.offscreen({ hide: true }),
        {
            lifespan
        },
        k.timer()
    ]);

    projectile.wait(projectile.lifespan, () => {
        k.destroy(projectile);
    });

    const collisions = ["boulder", "boundary", friendly ? "enemy" : "player"];

    projectile.onCollide(obj => {
        if (collisions.some(e => obj.is(e))) {
            if (obj?.invincible || obj?.dead) return;
            if (obj.is("enemy") || obj.is("player")) {
                obj.hurt(gun.damage);
            }
            k.destroy(projectile);
        }
    });

    return projectile;
}