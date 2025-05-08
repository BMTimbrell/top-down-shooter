export const PALETTE = {

};

export const MAP_SCALE = 4;

export const TILE_SIZE = 16;

export const CELL_SIZE = TILE_SIZE * MAP_SCALE;

export const GUN_OFFSET = 5;

export const DROP_OFFSET = 50;

export const GUNS = {
    pistol: {
        damage: 2,
        firingInterval: 5,
        animSpeed: 10,
        maxAmmo: 300,
        clipSize: 8,
        pelletSpread: 5,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 0 }
    },

    smg: {
        damage: 1.5,
        firingInterval: 0,
        animSpeed: 20,
        maxAmmo: 200,
        clipSize: 20,
        pelletSpread: 8,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 2400 }
    },

    shotgun: {
        damage: 2,
        firingInterval: 0,
        animSpeed: 12,
        clipSize: 6,
        maxAmmo: 100,
        pelletCount: 5,
        pelletSpread: 17,
        pelletSpeedVariation: 100,
        projectileLifespan: 0.75,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 960 }
    },

    "assault rifle": {
        damage: 1.5,
        firingInterval: 0,
        animSpeed: 20,
        clipSize: 30,
        maxAmmo: 200,
        pelletSpread: 6,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 2016 }
    },
};

export const ENEMIES = {
    bird: {
        health: 10,
        speed: 100,
        damage: 1,
        firingSpeed: 3,
        projectileCount: 1
      },
      redbird: {
        health: 15,
        speed: 100,
        damage: 1,
        firingSpeed: 3,
        projectileCount: 3
      }
};