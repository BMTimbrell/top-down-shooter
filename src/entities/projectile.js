export default function makeProjectile(
    k,
    gun,
    {
        name,
        lifespan = 1.5,
        friendly = true,
        spread = 0,
        speedOffset = 0,
        pierce = 0
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
            lifespan,
            pierce
        },
        k.timer()
    ]);

    projectile.wait(projectile.lifespan, () => {
        k.destroy(projectile);
    });

    const collisions = ["boulder", "boundary", friendly ? "enemy" : "player"];

    projectile.onCollide(obj => {
        if (collisions.some(e => obj.is(e)) && obj.has("body")) {
            if (obj?.invincible || obj?.dead) return;
    
            if (projectile.is("rocket")) {
                const explosion = k.add([
                    k.sprite("explosion", { anim: "explode" }),
                    k.pos(projectile.pos),
                    k.anchor("center"),
                    k.scale(6),
                    k.area({
                        shape: new k.Rect(k.vec2(0), 20, 20),
                    }),
                    "explosion",
                    {
                        enemiesHit: new Set()
                    }
                ]);
    
                explosion.onCollide(explodee => {
                    if (collisions.some(e => explodee.is(e)) && explodee.has("body")) {
                        if (explodee?.invincible || explodee?.dead) return;
                        if (explosion.enemiesHit.has(explodee)) return;
                        explosion.enemiesHit.add(explodee);
    
                        if (explodee.is("enemy") || explodee.is("player")) {
                            explodee.hurt(gun.damage);
                        }
                    }
                });
    
                explosion.onAnimEnd(() => {
                    k.destroy(explosion);
                });
    
                k.destroy(projectile);
                return;
            }
    
            if (obj.is("enemy") || obj.is("player")) {
                obj.hurt(gun.damage);
            } else {
                k.destroy(projectile);
                return;
            }
    
            projectile.pierce--;
            if (projectile.pierce <= 0) {
                k.destroy(projectile);
            }
        }
    });


    return projectile || explosion;
}