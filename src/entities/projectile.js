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
    const pos = gun?.pOffset ? gun.pos.add(k.vec2(gun.pOffset.x, gun.pOffset.y)) : gun.pos

    const projectile = k.add([
        k.sprite(name, { anim: "idle" }),
        k.pos(pos),
        k.rotate(
            friendly ? k.toWorld(k.mousePos()).angle(gun.worldPos()) + spread : 0
        ),
        k.anchor("center"),
        k.scale(4),
        k.area({
            shape: new k.Rect(k.vec2(0), 10, 10),
        }),
        name,
        'pausable',
        k.move(
            target,
            projectileSpeed
        ),
        k.offscreen({ hide: true }),
        {
            lifespan,
            pierce
        }
    ]);

    projectile.onUpdate(() => {
        if (projectile.lifespan > 0) {
            projectile.lifespan -= k.dt();
        } else {
            k.destroy(projectile);
        }
    });

    let collisions = ["boulder", "boundary", friendly ? "enemy" : "player"];

    projectile.onCollide(obj => {
        if (collisions.some(e => obj.is(e)) && obj.has("body")) {

            if (obj.is("player") && k.get("force field").length > 0) {
                k.destroy(projectile);
                return;
            }

            if (obj?.dashing && obj?.passives["Improved Slide"]) {
                collisions = collisions.filter(e => e !== "player");
                collisions.push("enemy");
                projectile.use(k.move(target, -projectileSpeed))
            }

            if (obj?.invincible || obj?.dead) return;

            if (projectile.is("rocket")) {
                const explosion = k.add([
                    k.sprite("explosion", { anim: "explode" }),
                    k.pos(projectile.pos),
                    k.anchor("center"),
                    k.scale(7),
                    k.area({
                        shape: new k.Rect(k.vec2(0), 20, 20),
                    }),
                    "explosion",
                    k.z(9999),
                    {
                        damaged: false,
                        enemiesHit: new Set()
                    }
                ]);

                explosion.onUpdate(() => {
                    if (explosion.damaged) return;

                    const player = k.get("player")[0];
                    if (
                        player.has("body") &&
                        explosion.isColliding(player) &&
                        !player.invincible
                    ) player.hurt(1);
                        

                    const hits = k.get("enemy").filter(e =>
                        e.has("body") &&
                        explosion.isColliding(e) &&
                        !e.invincible &&
                        !e.dead
                    );

                    for (const target of hits) {
                        if (explosion.enemiesHit.has(target)) continue;
                        explosion.enemiesHit.add(target);
                        target.hurt(gun.damage);
                    }

                    // mark as damaged so it doesn’t damage on future frames
                    explosion.damaged = true;
                });

                explosion.onAnimEnd(() => {
                    k.destroy(explosion);
                });

                k.destroy(projectile);
                return;
            }

            if (obj.is("enemy")) {
                obj.hurt(gun.damage);
            } else if (obj.is("player")) {
                obj.hurt(1);
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


    return projectile;
}