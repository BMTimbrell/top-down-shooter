export const PALETTE = {

};

export const DIAGONAL_FACTOR = 1 / Math.sqrt(2);

export const MAP_SCALE = 4;

export const TILE_SIZE = 16;

export const CELL_SIZE = TILE_SIZE * MAP_SCALE;

export const GUN_OFFSET = 5;

export const GUNS = {
    pistol: {
        damage: 1,
        firingInterval: 5,
        animSpeed: 10,
        maxAmmo: 300,
        clipSize: 8,
        spritePos: { x: 0, y: 0 }
    },

    smg: {
        damage: 1,
        firingInterval: 0,
        animSpeed: 20,
        maxAmmo: 200,
        clipSize: 10,
        spritePos: { x: 0, y: 2400 }
    },

    shotgun: {
        damage: 2,
        firingInterval: 0,
        animSpeed: 10,
        clipSize: 5,
        maxAmmo: 150,
        spritePos: { x: 0, y: 960 }
    },
};