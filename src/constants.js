export const PALETTE = {

};

export const MAP_SCALE = 4;

export const TILE_SIZE = 16;

export const CELL_SIZE = TILE_SIZE * MAP_SCALE;

export const DROP_OFFSET = 50;

export const GUNS = {
    pistol: {
        projectile: "bullet",
        damage: 2,
        firingInterval: 5,
        animSpeed: 10,
        maxAmmo: 300,
        clipSize: 8,
        pelletSpread: 5,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 0 },
        offset: { x: 0, y: 5 }
    },

    smg: {
        projectile: "bullet",
        damage: 1.5,
        firingInterval: 0,
        animSpeed: 20,
        maxAmmo: 150,
        clipSize: 20,
        pelletSpread: 8,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 576 },
        offset: { x: 0, y: 5 }
    },

    shotgun: {
        projectile: "bullet",
        damage: 2,
        firingInterval: 0,
        animSpeed: 12,
        clipSize: 8,
        maxAmmo: 80,
        pelletCount: 5,
        pelletSpread: 17,
        pelletSpeedVariation: 100,
        projectileLifespan: 0.75,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 192 },
        offset: { x: 0, y: 5 }
    },

    "assault rifle": {
        projectile: "bullet",
        damage: 1.5,
        firingInterval: 0,
        animSpeed: 20,
        clipSize: 30,
        maxAmmo: 200,
        pelletSpread: 6,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 480 },
        offset: { x: 0, y: 5 }
    },

    "sniper rifle": {
        projectile: "bullet",
        damage: 5,
        firingInterval: 20,
        animSpeed: 10,
        clipSize: 6,
        maxAmmo: 50,
        pelletSpread: 0,
        projectileLifespan: 1.5,
        pierce: 3,
        projectileSpeed: 1500,
        spritePos: { x: 0, y: 384 },
        offset: { x: 0, y: 5 }
    },

    "RPG": {
        projectile: "rocket",
        damage: 10,
        firingInterval: 0,
        animSpeed: 10,
        clipSize: 1,
        maxAmmo: 20,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 288 },
        offset: { x: 0, y: 5 }
    },

    "minigun": {
        projectile: "bullet",
        damage: 2,
        firingInterval: 0,
        animSpeed: 20,
        clipSize: 100,
        maxAmmo: 300,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        pelletSpread: 10,
        spritePos: { x: 0, y: 96 },
        offset: { x: 20, y: 5 }
    }
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
      },
      mole: {
        health: 15,
        speed: 50,
        damage: 1,
        firingSpeed: 3,
        projectileCount: 1
      }
};