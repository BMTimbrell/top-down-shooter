import { CELL_SIZE, MAP_SCALE } from "../constants";
import { hasOverlap, hasLineOfSight } from './collision';

class GridPoint {
    constructor(x, y, passable = true, { cols, rows }) {
        this.x = x;
        this.y = y;
        this.rows = rows;
        this.cols = cols;
        this.passable = passable;
        this.g = 0; // Cost from start to this point
        this.h = 0; // Heuristic cost to end point
        this.f = 0; // Total cost (g + h)
        this.parent = null;
        this.neighbors = [];
    }

    updateNeighbors(grid) {
        const i = this.x;
        const j = this.y;

        const isPassable = (x, y) =>
            x >= 0 && y >= 0 && x < this.cols && y < this.rows && grid[x][y].passable;

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

export default class PathfindingManager {
    constructor(k, map, enemy) {
        this.k = k;
        this.enemy = enemy;
        this.rows = map.height / CELL_SIZE;
        this.cols = map.width / CELL_SIZE;
        this.map = map;
        this.grid = this.initGrid(this.cols, this.rows);
    }

    initGrid(cols, rows) {
        const k = this.k;
        const grid = new Array(cols);

        for (let i = 0; i < cols; i++) {
            grid[i] = new Array(rows);
            for (let j = 0; j < rows; j++) {
                const enemyWidth = this.enemy.area.shape.width * MAP_SCALE;
                const enemyHeight = this.enemy.area.shape.height * MAP_SCALE;
                const padding = CELL_SIZE;

                // take corners wide to not get stuck
                const cell = {
                    x: this.map.pos.x + i * CELL_SIZE - (enemyWidth / 2) - padding,
                    y: this.map.pos.y + j * CELL_SIZE - (enemyHeight / 2) - padding,
                    width: enemyWidth + padding * 2,
                    height: enemyHeight + padding * 2
                };

                const blockers = k.get("*").filter(
                    obj => 
                        obj.has("body") && 
                        obj.has("area") && 
                        !obj.is("player") && 
                        !obj.is("enemy")
                );

                const blocked = blockers.some(obj => hasOverlap(cell, obj));

                // if (blocked) {
                //     k.add([
                //         k.pos(0, 0),
                //         {
                //             draw() {
                //                 k.drawRect({
                //                     pos: k.vec2(cell.x, cell.y),
                //                     width: CELL_SIZE,
                //                     height: CELL_SIZE,
                //                     color: k.rgb(255, 0, 0, 0.5)
                //                 });
                //             }
                //         }
                //     ]);
        
                // }

                grid[i][j] = new GridPoint(i, j, !blocked, { cols, rows });

            }
        }

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j].updateNeighbors(grid);
            }
        }

        return grid;
    }

    resetGrid() {
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                const p = this.grid[x][y];
                p.g = 0;
                p.h = 0;
                p.f = 0;
                p.parent = null;
            }
        }
    }

    findPath(startPos, target) {
        this.resetGrid();

        const offsetX = this.map.pos.x;
        const offsetY = this.map.pos.y;

        startPos = { x: startPos.x - offsetX, y: startPos.y - offsetY };
        const targetPos = { x: target.x - offsetX, y: target.y - offsetY };
        const start = this.grid[Math.floor(startPos.x / CELL_SIZE)][Math.floor(startPos.y / CELL_SIZE)];
        let end = this.grid[Math.floor(targetPos.x / CELL_SIZE)][Math.floor(targetPos.y / CELL_SIZE)];
        if (!end.passable) {
            end = this.findNearestWalkable(
                target, 
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

                return path.map(e => this.k.vec2(
                    offsetX + e.x * CELL_SIZE,
                    offsetY + e.y * CELL_SIZE
                ));
            }

            openSet.splice(lowestIndex, 1);
            closedSet.push(current);

            for (const neighbor of current.neighbors) {

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

    findNearestWalkable(targetPosVec2, targetX, targetY) {
        const maxRadius = Math.max(this.cols, this.rows);

        for (let radius = 1; radius < maxRadius; radius++) {
            for (let dx = -radius; dx <= radius; dx++) {
                for (let dy = -radius; dy <= radius; dy++) {
                    if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue; // skip inner circle
                    const x = targetX + dx;
                    const y = targetY + dy;
                    const candidatePos = this.k.vec2(
                        this.map.pos.x + x * CELL_SIZE, 
                        this.map.pos.y + y * CELL_SIZE
                    );
    
                    if (
                        x >= 0 && x < this.cols &&
                        y >= 0 && y < this.rows &&
                        this.grid[x][y].passable &&
                        hasLineOfSight(this.k, candidatePos, targetPosVec2)
                    ) {
                        return this.grid[x][y];
                    }
                }
            }
        }
        
        return null;
    }


}