import { CELL_SIZE } from "../constants";
import { useFlash } from '../utils';

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
        k.health(3, 3),
        "enemy",
        {
            path: [],
            shooting: false,
            firingSpeed: 3
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
                const enemyWidth = enemy.area.shape.width * 4;
                const enemyHeight = enemy.area.shape.height * 4;
                const padding = CELL_SIZE;

                const cell = {
                    x: map.pos.x + i * CELL_SIZE - (enemyWidth / 2) - padding,
                    y: map.pos.y + j * CELL_SIZE - (enemyHeight / 2) - padding,
                    width: enemyWidth + padding * 2,
                    height: enemyHeight + padding * 2
                };

                const blockers = k.get("*").filter(obj => obj.has("body") && obj.has("area") && !obj.is("player") && !obj.is("enemy"));
                const blocked = blockers.some(obj => hasOverlap(cell, obj, "rect"));

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

    function findNearestWalkable(grid, targetX, targetY) {
        const candidates = [];

        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                const x = targetX + dx;
                const y = targetY + dy;
                if (
                    x >= 0 && x < cols &&
                    y >= 0 && y < rows &&
                    grid[x][y].passable
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

    function aStar(target) {
        const grid = initGrid(rows, cols);
        const enemyPos = { x: enemy.pos.x - map.pos.x, y: enemy.pos.y - map.pos.y };
        const targetPos = { x: target.pos.x - map.pos.x, y: target.pos.y - map.pos.y };
        const start = grid[Math.floor(enemyPos.x / CELL_SIZE)][Math.floor(enemyPos.y / CELL_SIZE)];
        let end = grid[Math.floor(targetPos.x / CELL_SIZE)][Math.floor(targetPos.y / CELL_SIZE)];
        if (!end.passable) {
            end = findNearestWalkable(grid, Math.floor(targetPos.x / CELL_SIZE), Math.floor(targetPos.y / CELL_SIZE));
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

    function hasOverlap(obj1, obj2, type = "point") {
        const rect2 = { width: obj2.area.shape.width, height: obj2.area.shape.height };

        if (type === "point") {
            return (
                obj1.x >= obj2.pos.x &&
                obj1.x <= obj2.pos.x + rect2.width &&
                obj1.y >= obj2.pos.y &&
                obj1.y <= obj2.pos.y + rect2.height
            );
        }
        if (type === "rect") {
            return (
                obj1.x < obj2.pos.x + rect2.width &&
                obj1.x + obj1.width > obj2.pos.x &&
                obj1.y < obj2.pos.y + rect2.height &&
                obj1.y + obj1.height > obj2.pos.y
            );
        }

        return false;
    }

    function hasLineOfSight(from, to) {
        const blockers = k.get("*").filter(obj => obj.has("body") && obj.has("area") && !obj.is("player") && !obj.is("enemy"));

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const steps = Math.max(Math.abs(dx), Math.abs(dy)) / 4;

        for (let i = 0; i <= steps; i++) {
            const x = from.x + (dx * i) / steps;
            const y = from.y + (dy * i) / steps;

            for (const b of blockers) {
                if (hasOverlap(k.vec2(x, y), b)) {
                    return false;
                }
            }
        }

        return true;
    }

    let pathTimer = k.rand(0, 1);
    let stuckTimer = 0;
    const shootDistance = k.rand(100, 500);

    // let path = [];
    enemy.onUpdate(() => {
        const player = k.get("player")[0];

        // if (hasLineOfSight(enemy.pos, player.pos)) {
        //     enemy.use(k.color("#ff00ff"));
        // } else enemy.unuse("color");

        pathTimer -= k.dt();
        
        if (
            pathTimer <= 0 && 
            (enemy.pos.dist(player.pos) > shootDistance || !hasLineOfSight(enemy.pos, player.pos))
        ) {
            enemy.path = aStar(player);
            pathTimer = k.rand(0, 1);
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
            enemy.path?.length > 1 && 
            (enemy.pos.dist(player.pos) > shootDistance || !hasLineOfSight(enemy.pos, player.pos))
        ) {
            if (enemy.pos.dist(enemy.path[0]) < 100) {
                enemy.path.shift();
            }

            enemy.moveTo(enemy.path[0], 200);
        }

        enemy.loop(enemy.firingSpeed, () => {
            if (hasLineOfSight(enemy.pos, player.pos) && !enemy.shooting) {
                enemy.shooting = true;
                
            }
        })

    });

    return enemy;
}