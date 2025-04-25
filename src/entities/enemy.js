import { CELL_SIZE, MAP_SCALE } from "../constants";
import { useFlash } from '../utils';
import makeProjectile from "./projectile";

export default function makeEnemy(k, pos, name, map) {
    const enemy = k.add([
        k.sprite(name, { anim: "idle" }),
        k.scale(4),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 0), 20, 20),
            collisionIgnore: ["enemy"]
        }),
        k.body(),
        k.pos(pos),
        k.timer(),
        k.health(10, 10),
        "enemy",
        {
            path: [],
            shooting: false,
            firingSpeed: 3,
            speed: 100
        }
    ]);

    useFlash(k, enemy);

    enemy.on("hurt", () => {
        enemy.flash();
    });

    enemy.on("death", () => {
        enemy.destroy();
    });

    const cols = 15;
    const rows = 15;

    function GridPoint(x, y, passable = true) {
        this.x = x;
        this.y = y;
        this.passable = passable;
        this.g = 0; // Cost from start to this point
        this.h = 0; // Heuristic cost to end point
        this.f = 0; // Total cost (g + h)
        this.parent = null;
        this.neighbors = [];

        this.updateNeighbors = function (grid) {
            const i = this.x;
            const j = this.y;

            const isPassable = (x, y) =>
                x >= 0 && y >= 0 && x < cols && y < rows && grid[x][y].passable;

            // Cardinal directions
            if (isPassable(i + 1, j)) this.neighbors.push(grid[i + 1][j]);
            if (isPassable(i - 1, j)) this.neighbors.push(grid[i - 1][j]);
            if (isPassable(i, j + 1)) this.neighbors.push(grid[i][j + 1]);
            if (isPassable(i, j - 1)) this.neighbors.push(grid[i][j - 1]);

            // Diagonals (only if both adjacent sides are also passable)
            if (isPassable(i + 1, j) && isPassable(i, j + 1) && isPassable(i + 1, j + 1)) {
                this.neighbors.push(grid[i + 1][j + 1]);
            }
            if (isPassable(i - 1, j) && isPassable(i, j + 1) && isPassable(i - 1, j + 1)) {
                this.neighbors.push(grid[i - 1][j + 1]);
            }
            if (isPassable(i + 1, j) && isPassable(i, j - 1) && isPassable(i + 1, j - 1)) {
                this.neighbors.push(grid[i + 1][j - 1]);
            }
            if (isPassable(i - 1, j) && isPassable(i, j - 1) && isPassable(i - 1, j - 1)) {
                this.neighbors.push(grid[i - 1][j - 1]);
            }
        }
    }

    function initGrid(rows, cols) {
        const grid = new Array(15);

        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(rows);
            for (let j = 0; j < rows; j++) {
                const enemyWidth = enemy.area.shape.width * MAP_SCALE;
                const enemyHeight = enemy.area.shape.height * MAP_SCALE;
                const padding = CELL_SIZE;

                const cell = {
                    x: map.pos.x + i * CELL_SIZE - (enemyWidth / 2) - padding,
                    y: map.pos.y + j * CELL_SIZE - (enemyHeight / 2) - padding,
                    width: enemyWidth + padding * 2,
                    height: enemyHeight + padding * 2
                };

                const blockers = k.get("*").filter(obj => obj.has("body") && obj.has("area") && !obj.is("player") && !obj.is("enemy"));
                const blocked = blockers.some(obj => hasOverlap(cell, obj));

                if (blocked) {
                    // k.add([
                    //     k.pos(0, 0),
                    //     {
                    //         draw() {
                    //             k.drawRect({
                    //                 pos: k.vec2(cell.x, cell.y),
                    //                 width: CELL_SIZE,
                    //                 height: CELL_SIZE,
                    //                 color: k.rgb(255, 0, 0, 0.5)
                    //             });
                    //         }
                    //     }
                    // ]);

                }

                grid[i][j] = new GridPoint(i, j, !blocked);

            }
        }

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j].updateNeighbors(grid);
            }
        }

        return grid;
    }

    function findNearestWalkable(grid, target, targetX, targetY) {
        const candidates = [];

        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                const x = targetX + dx;
                const y = targetY + dy;
                const candidatePos = k.vec2(
                    map.pos.x + x * CELL_SIZE, 
                    map.pos.y + y * CELL_SIZE
                );

                if (
                    x >= 0 && x < cols &&
                    y >= 0 && y < rows &&
                    grid[x][y].passable &&
                    hasLineOfSight(candidatePos, target)
                ) {
                    candidates.push(grid[x][y]);
                }
            }
        }

        if (candidates.length === 0) return null;

        // Return the closest candidate to the enemy
        return candidates.sort((a, b) => {
            const aDist = Math.abs(a.x - targetX) + Math.abs(a.y - targetY);
            const bDist = Math.abs(b.x - targetX) + Math.abs(b.y - targetY);
            return aDist - bDist;
        })[0];
    }

    function aStar(startPos, target) {
        const grid = initGrid(rows, cols);
        startPos = { x: startPos.x - map.pos.x, y: startPos.y - map.pos.y };
        const targetPos = { x: target.pos.x - map.pos.x, y: target.pos.y - map.pos.y };
        const start = grid[Math.floor(startPos.x / CELL_SIZE)][Math.floor(startPos.y / CELL_SIZE)];
        let end = grid[Math.floor(targetPos.x / CELL_SIZE)][Math.floor(targetPos.y / CELL_SIZE)];
        if (!end.passable) {
            end = findNearestWalkable(
                grid,
                target.pos, 
                Math.floor(targetPos.x / CELL_SIZE), 
                Math.floor(targetPos.y / CELL_SIZE)
            );
            if (!end) return null;
        }
        const openSet = [start];
        const path = [];
        const closedSet = [];

        function heuristic(pos1, pos2) {
            const dx = Math.abs(pos2.x - pos1.x);
            const dy = Math.abs(pos2.y - pos1.y);

            return dx + dy + (1.41 - 2) * Math.min(dx, dy);
        }

        while (openSet.length > 0) {
            let lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }

            const current = openSet[lowestIndex];

            if (current.x === end.x && current.y === end.y) {
                let temp = current;
                path.push(temp);
                while (temp.parent) {
                    path.unshift(temp.parent);
                    temp = temp.parent;
                }

                return path.map(e => k.vec2(
                    map.pos.x + e.x * CELL_SIZE,
                    map.pos.y + e.y * CELL_SIZE
                ));
            }

            openSet.splice(lowestIndex, 1);
            closedSet.push(current);

            let neighbors = current.neighbors;
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];

                if (!closedSet.includes(neighbor)) {
                    const possibleG = current.g + (
                        (neighbor.x !== current.x && neighbor.y !== current.y) ? 1.41 : 1
                    );

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    } else if (possibleG >= neighbor.g) {
                        continue;
                    }

                    neighbor.g = possibleG;
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = current;
                }
            }
        }

        return null;
    }

    function hasOverlap(obj1, obj2, type = "rect") {
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

    function hasLineOfSight(from, to) {
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

    function hasClearShot(from, to) {
        // 1. first, point‑based LOS
        if (!hasLineOfSight(from, to)) return false;

        // 2. test bullet body at launch point
        const dir = to.sub(from).unit();
        const launch = from.add(dir.scale(20));    // 20 == bullet radius
        return hasLineOfSight(launch, to);
    }

    let pathTimer = 0;
    let shootDistance = k.rand(100, 500);
    let shootCd = 0;

    // shooting player
    // enemy.loop(3, () => {
    //     if (hasClearShot(enemy.pos, k.get("player")[0].pos)) {
    //         makeProjectile(
    //             k, 
    //             { 
    //                 pos: enemy.pos, 
    //                 damage: 1, 
    //                 projectileSpeed: 200,
    //             }, 
    //             { 
    //                 name: "enemyProjectile", 
    //                 friendly: false,
    //                 lifespan: 5  
    //             }
    //         );
    //     }
    // });

    enemy.onUpdate(() => {
        const player = k.get("player")[0];
        shootCd -= k.dt();
        pathTimer -= k.dt();

        if (
            pathTimer <= 0 &&
            (enemy.pos.dist(player.pos) > shootDistance || !hasLineOfSight(enemy.pos, player.pos))
        ) {
            enemy.path = aStar(enemy.path?.length ? enemy.path[0] : enemy.pos, player);
            pathTimer = k.rand(0.5, 1.5);

            // k.add([
            //     k.pos(0, 0),
            //     {
            //         draw() {
            //             for (const p of enemy.path ?? []) {
            //                 k.drawCircle({
            //                     pos: p,
            //                     radius: 3,
            //                     color: k.rgb(0, 255, 0)
            //                 });
            //             }
            //         }
            //     }
            // ]);
        }

        if (
            enemy.path?.length > 0 && (
                !hasLineOfSight(enemy.pos, player.pos) ||
                enemy.pos.dist(player.pos) > shootDistance
            )
        ) {
            if (enemy.path?.length > 0) {
                if (enemy.pos.dist(enemy.path[0]) < 4) {
                    enemy.path.shift();
                }
            
                if (enemy.path.length > 0) {
                    const dir = enemy.path[0].sub(enemy.pos).unit();
                    enemy.move(dir.scale(enemy.speed));
                }
            }
        }

        /*  shooting  */
        if (shootCd <= 0 && hasLineOfSight(enemy.pos, player.pos)) {
            shootDistance = k.rand(100, 500);
            makeProjectile(k, {
                pos: enemy.pos,
                damage: 1,
                projectileSpeed: 200
            }, {
                name: "enemyProjectile",
                friendly: false,
                lifespan: 5
            });
            shootCd = 3;
        }

    });

    return enemy;
}