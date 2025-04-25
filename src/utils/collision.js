export function hasOverlap(obj1, obj2, type = "rect") {
    const rect = { width: obj2.area.shape.width, height: obj2.area.shape.height };
    if (type === "point") {
        return (
            obj1.x >= obj2.pos.x &&
            obj1.x <= obj2.pos.x + rect.width &&
            obj1.y >= obj2.pos.y &&
            obj1.y <= obj2.pos.y + rect.height
        );
    }
    if (type === "rect") {
        return (
            obj1.x < obj2.pos.x + rect.width &&
            obj1.x + obj1.width > obj2.pos.x &&
            obj1.y < obj2.pos.y + rect.height &&
            obj1.y + obj1.height > obj2.pos.y
        );
    }

    return false;
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
            if (hasOverlap(projectile, b)) {
                return false;
            }
        }
    }

    return true;
}