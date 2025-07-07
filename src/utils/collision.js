export function hasOverlap(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

export function hasLineOfSight(k, from, to) {
    const blockers = k.get("*").filter(
        obj => obj.has("body") && obj.has("area") && !obj.is("player") && !obj.is("enemy")
    );

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy)) / 4;

    for (let i = 0; i <= steps; i++) {
        const x = from.x + (dx * i) / steps;
        const y = from.y + (dy * i) / steps;

        const projectile = {
            x: x - 20,
            y: y - 20,
            width: 40,
            height: 40
        };

        for (const b of blockers) {
            const blocker = {
                x: b.pos.x,
                y: b.pos.y,
                width: b.area.shape.width,
                height: b.area.shape.height
            };
            if (hasOverlap(projectile, blocker)) {
                return false;
            }
        }
    }

    return true;
}

export function castRay(k, start, dir, maxDist = 800, step = 4) {
    let pos = start;

    const blockers = k.get("*").filter(
        obj => obj.has("body") && obj.has("area") && !obj.is("player") && !obj.is("enemy")
    );

    for (let d = 0; d < maxDist; d += step) {
        pos = pos.add(dir.scale(step));

        for (const b of blockers) {
            const blocker = {
                x: b.pos.x,
                y: b.pos.y,
                width: b.area.shape.width,
                height: b.area.shape.height
            };

            const projectile = {
                x: pos.x - 32,
                y: pos.y - 32,
                width: 64,
                height: 64
            };

            if (hasOverlap(projectile, blocker)) {
                return pos; // Hit wall
            }
        }
    }
    return start.add(dir.scale(maxDist)); // No wall hit
}