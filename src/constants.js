import makeBird from "./entities/bird";
import makeBirdBoss from "./entities/birdBoss";
import makeMole from "./entities/mole";
import makeWisp from "./entities/wisp";
import makeBat from "./entities/bat";
import makeTortoise from "./entities/tortoise";
import makeMoleBoss from "./entities/moleBoss";
import makeWolf from "./entities/wolf";

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
        firingInterval: 0.1,
        animSpeed: 10,
        maxAmmo: 300,
        clipSize: 8,
        pelletSpread: 5,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 0 },
        offset: { x: 0, y: 5 },
        price: 50,
        level: 1
    },

    "SMG": {
        projectile: "bullet",
        damage: 1.5,
        firingInterval: 0,
        animSpeed: 20,
        maxAmmo: 150,
        clipSize: 20,
        pelletSpread: 8,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 2112 },
        offset: { x: 0, y: 5 },
        price: 100,
        level: 1
    },

    shotgun: {
        projectile: "bullet",
        damage: 2,
        firingInterval: 0,
        animSpeed: 12,
        clipSize: 8,
        maxAmmo: 60,
        pelletCount: 5,
        pelletSpread: 17,
        pelletSpeedVariation: 100,
        projectileLifespan: 0.75,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 1728 },
        offset: { x: 0, y: 5 },
        price: 200,
        level: 1
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
        spritePos: { x: 0, y: 2016 },
        offset: { x: 0, y: 5 },
        price: 200,
        level: 1
    },

    "sniper rifle": {
        projectile: "bullet",
        damage: 8,
        firingInterval: 0.5,
        animSpeed: 10,
        clipSize: 6,
        maxAmmo: 50,
        pelletSpread: 0,
        projectileLifespan: 1.5,
        pierce: 3,
        projectileSpeed: 1500,
        spritePos: { x: 0, y: 1920 },
        offset: { x: 0, y: 5 },
        price: 300,
        level: 1
    },

    "RPG": {
        projectile: "rocket",
        damage: 15,
        firingInterval: 0,
        animSpeed: 10,
        clipSize: 1,
        maxAmmo: 25,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        pelletSpread: 8,
        spritePos: { x: 0, y: 1824 },
        pOffset: { x: 0, y: -6 },
        offset: { x: 0, y: 1 },
        price: 300,
        level: 1
    },

    "minigun": {
        projectile: "bullet",
        damage: 1.5,
        firingInterval: 0,
        animSpeed: 25,
        clipSize: 100,
        maxAmmo: 300,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        pelletSpread: 10,
        spritePos: { x: 0, y: 1632 },
        offset: { x: 20, y: 5 },
        price: 600,
        level: 1
    },

    "laser pistol": {
        projectile: "laser",
        damage: 3,
        firingInterval: 0.1,
        animSpeed: 10,
        maxAmmo: 300,
        clipSize: 8,
        pelletSpread: 5,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 1536 },
        pOffset: { x: 0, y: -10 },
        offset: { x: 0, y: 5 },
        price: 150,
        level: 2
    },

    "laser SMG": {
        projectile: "laser",
        damage: 2.25,
        firingInterval: 0,
        animSpeed: 20,
        maxAmmo: 150,
        clipSize: 20,
        pelletSpread: 8,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 1440 },
        offset: { x: 0, y: 5 },
        price: 300,
        level: 2
    },

    "laser shotgun": {
        projectile: "laser",
        firingFrame: 2,
        damage: 3,
        firingInterval: 0,
        animSpeed: 12,
        clipSize: 8,
        maxAmmo: 60,
        pelletCount: 5,
        pelletSpread: 17,
        pelletSpeedVariation: 100,
        projectileLifespan: 0.75,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 1248 },
        offset: { x: 0, y: 5 },
        price: 600,
        level: 2
    },

    "laser rifle": {
        projectile: "laser",
        damage: 2.25,
        firingInterval: 0,
        animSpeed: 20,
        clipSize: 30,
        maxAmmo: 200,
        pelletSpread: 6,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 1344 },
        offset: { x: 0, y: 5 },
        price: 600,
        level: 2
    },

    "laser sniper rifle": {
        projectile: "laser",
        damage: 12,
        firingInterval: 0.5,
        animSpeed: 10,
        clipSize: 6,
        maxAmmo: 50,
        pelletSpread: 0,
        projectileLifespan: 1.5,
        pierce: 4,
        projectileSpeed: 1500,
        spritePos: { x: 0, y: 1152 },
        offset: { x: 0, y: 5 },
        pOffset: { x: 0, y: -10 },
        price: 900,
        level: 2
    },

    "blaster launcher": {
        projectile: "blaster",
        damage: 22.5,
        firingInterval: 0,
        animSpeed: 10,
        clipSize: 1,
        maxAmmo: 25,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        pelletSpread: 3,
        spritePos: { x: 0, y: 1056 },
        pOffset: { x: 0, y: -6 },
        offset: { x: 0, y: 1 },
        price: 900,
        level: 2
    },

    "laser sword": {
        projectile: "blaster",
        damage: 12,
        firingInterval: 0.35,
        animSpeed: 10,
        clipSize: 50,
        maxAmmo: 50,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        pelletSpread: 0,
        spritePos: { x: 0, y: 960 },
        offset: { x: 30, y: 1 },
        price: 900,
        level: 2
    },

    "laser minigun": {
        projectile: "laser",
        damage: 2.25,
        firingInterval: 0,
        animSpeed: 25,
        clipSize: 100,
        maxAmmo: 300,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        pelletSpread: 10,
        spritePos: { x: 0, y: 864 },
        offset: { x: 20, y: 5 },
        price: 1800,
        level: 2
    },

    "plasma pistol": {
        projectile: "plasma",
        damage: 4,
        firingInterval: 0.1,
        animSpeed: 10,
        maxAmmo: 300,
        clipSize: 8,
        pelletSpread: 5,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 768 },
        pOffset: { x: 0, y: -10 },
        offset: { x: 0, y: 5 },
        price: 450,
        level: 3
    },

    "plasma SMG": {
        projectile: "plasma",
        damage: 3,
        firingInterval: 0,
        animSpeed: 20,
        maxAmmo: 150,
        clipSize: 20,
        pelletSpread: 8,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 672 },
        offset: { x: 0, y: 5 },
        price: 900,
        level: 3
    },

    "plasma shotgun": {
        projectile: "plasma",
        firingFrame: 2,
        damage: 4,
        firingInterval: 0,
        animSpeed: 12,
        clipSize: 8,
        maxAmmo: 60,
        pelletCount: 5,
        pelletSpread: 17,
        pelletSpeedVariation: 100,
        projectileLifespan: 0.75,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 480 },
        offset: { x: 0, y: 5 },
        price: 1800,
        level: 3
    },

    "plasma rifle": {
        projectile: "plasma",
        damage: 3,
        firingInterval: 0,
        animSpeed: 20,
        clipSize: 30,
        maxAmmo: 200,
        pelletSpread: 6,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 576 },
        offset: { x: 0, y: 5 },
        price: 1800,
        level: 3
    },

    "plasma sniper rifle": {
        projectile: "plasma beam",
        damage: 16,
        firingInterval: 0.5,
        animSpeed: 10,
        clipSize: 6,
        maxAmmo: 50,
        pelletSpread: 0,
        projectileLifespan: 1.5,
        pierce: 5,
        projectileSpeed: 1500,
        spritePos: { x: 0, y: 384 },
        offset: { x: 0, y: 5 },
        pOffset: { x: 0, y: -10 },
        price: 2500,
        level: 3
    },

    "plasma blaster": {
        projectile: "plasma orb",
        damage: 30,
        firingInterval: 0,
        animSpeed: 10,
        clipSize: 1,
        maxAmmo: 25,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        pelletSpread: 0,
        spritePos: { x: 0, y: 288 },
        pOffset: { x: 0, y: -6 },
        offset: { x: 0, y: 1 },
        price: 2500,
        level: 3
    },

    "magic sceptre": {
        projectile: "magic orb",
        damage: 10,
        firingInterval: 0.1,
        animSpeed: 10,
        maxAmmo: 50,
        clipSize: 50,
        pelletSpread: 5,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        spritePos: { x: 0, y: 192 },
        pOffset: { x: 0, y: -10 },
        offset: { x: 0, y: 5 },
        price: 2500,
        level: 3
    },

    "plasma minigun": {
        projectile: "plasma",
        damage: 3,
        firingInterval: 0,
        animSpeed: 25,
        clipSize: 100,
        maxAmmo: 300,
        projectileLifespan: 1.5,
        projectileSpeed: 700,
        pelletSpread: 10,
        spritePos: { x: 0, y: 96 },
        offset: { x: 20, y: 5 },
        price: 5000,
        level: 3
    }

};

export const ENEMIES = {
    bird: {
        health: 10,
        speed: 100,
        damage: 5,
        firingSpeed: 3,
        projectileCount: 1,
    },
    redbird: {
        health: 15,
        speed: 100,
        damage: 5,
        firingSpeed: 3,
        projectileCount: 3
    },
    mole: {
        health: 15,
        speed: 50,
        damage: 5,
        firingSpeed: 3,
        projectileCount: 1
    },
    redmole: {
        health: 22.5,
        speed: 50,
        damage: 5,
        firingSpeed: 3,
        projectileCount: 1
    },
    wisp: {
        health: 12,
        speed: 80,
        damage: 5,
        firingSpeed: 0.25,
        projectileCount: 1,
        shootOffset: { x: 0, y: 40 },
        hitbox: { x: 0, y: 0.5, width: 20, height: 15 }
    },
    bluewisp: {
        health: 18,
        speed: 80,
        damage: 5,
        firingSpeed: 0.25,
        projectileCount: 6,
        shootOffset: { x: 0, y: 40 },
        hitbox: { x: 0, y: 0.5, width: 20, height: 15 }
    },
    bat: {
        health: 12,
        speed: 100,
        damage: 5,
        firingSpeed: 3,
        projectileCount: 1
    },
    redbat: {
        health: 18,
        speed: 100,
        damage: 5,
        firingSpeed: 3,
        projectileCount: 3
    },
    tortoise: {
        health: 18,
        speed: 50,
        damage: 5,
        firingSpeed: 3,
        projectileCount: 1,
    },
    bluetortoise: {
        health: 27,
        speed: 50,
        damage: 5,
        firingSpeed: 3,
        projectileCount: 1,
    },
    wolf: {
        health: 15,
        speed: 275,
        damage: 5,
        firingSpeed: 0.25,
        projectileCount: 1,
    },
    bluewolf: {
        health: 22.5,
        speed: 275,
        damage: 5,
        firingSpeed: 0.25,
        projectileCount: 6,
    }
};

export const ENEMY_FACTORIES = {
    "default": makeBird,
    "bird": makeBird,
    "redbird": makeBird,
    "mole": makeMole,
    "redmole": makeMole,
    "wisp": makeWisp,
    "bluewisp": makeWisp,
    "birdboss": makeBirdBoss,
    "bat": makeBat,
    "redbat": makeBat,
    "tortoise": makeTortoise,
    "bluetortoise": makeTortoise,
    "moleboss": makeMoleBoss,
    "wolf": makeWolf,
    "bluewolf": makeWolf
};

export const DISCOUNT = 0.8;

export const BOOKS = [
    {
        title: "Tactical Precision: A Shooter's Manual",
        description: "Learn to breathe, aim, and fire like a pro.",
        text: [
            [
                "A rookie sees the target. A marksman sees the field.",
                "The first rule of tactical shooting is awareness. Every element in the field can help or hinder your shot."
            ],
            [
                "When aiming exhale slowly. A calm breath steadies the hand.",
                "Trigger discipline is not about reaction speed. It's about control.",
                "You finish reading the book, and feel more confident in your combat abilities."
            ]
        ],
        exp: {
            weapon: 25
        },
        progress: {
            current: 0, max: 2
        },
        price: 100,
        button: {
            onClick: null,
            disabled: false,
            name: "Buy"
        }
    },
    {
        title: "Epistemology",
        description: "A book about how we know.",
        text: [
            [
                "All knowledge starts with sense perception.",
                "The senses can't make errors as they make no judgement and are just cause and effect."
            ],
            [
                "We use our minds to integrate data from the senses and form concepts.",
                "Errors can be made on the conceptual level, so make sure you have no logical fallacies.",
                "You finished the book and gained clarity."
            ]
        ],
        exp: {
            mind: 25
        },
        progress: {
            current: 0, max: 2
        },
        price: 120,
        button: {
            onClick: null,
            disabled: false,
            name: "Buy"
        }
    },
    {
        title: "SWEAT",
        description: "A book with special workouts, exercises and advanced techniques.",
        text: [
            [
                "As you read, you see examples of different exercises and workout plans."
            ],
            [
                "You read about different lifting techniques and the value of getting tension on the muscle when it's lengthened.",
                "You now feel like you might be able to get more out of your workouts."
            ]
        ],
        exp: null,
        action(player) {
            player.improvedWorkouts = true;
        },
        progress: {
            current: 0, max: 2
        },
        price: 100,
        button: {
            onClick: null,
            disabled: false,
            name: "Buy"
        }
    },
    {
        title: "Cognitive Warefare and You",
        description: "A guide to defending your thoughts and outmaneuvering manipulative foes.",
        text: [
            [
                "The most effective weapon is the one that convinces you it isn’t a weapon at all",
                "Cognitive threats creep in as subtle suggestions, reframed truths, or emotional triggers designed to bypass logic."
            ],
            [
                "Remember, the mind's greatest defense is intentional thought.",
                "A sharpened mind is a secure one. Train it like you would train a weapon.",
                "You finish the book and gain clarity."
            ]
        ],
        exp: {
            mind: 25
        },
        progress: {
            current: 0, max: 2
        },
        price: 120,
        button: {
            onClick: null,
            disabled: false,
            name: "Buy"
        }
    },
    {
        title: "Smiles, Lies, and Subtle Eyes",
        description: "The Psychology of Persuasion",
        text: [
            [
                'Your body speaks long before your voice enters the conversation.',
                'A confident stance—shoulders relaxed, spine aligned, gaze steady—tells the room, "I am here, and I belong"',
            ],
            [
                "Adjust your expression, your breath, your pace. Let people feel seen without a word.",
                "Never forget: charisma isn't about overpowering the room—it's about anchoring it.",
                "You finish the book and feel like you could use these techniques at shops."
            ]
        ],
        exp: null,
        action(player) {
            player.discount = true;
        },
        progress: {
            current: 0, max: 2
        },
        price: 150,
        button: {
            onClick: null,
            disabled: false,
            name: "Buy"
        }
    }
];

export const ELECTRONICS = [
    {
        name: "VR Headset",
        description: "Comes with a free game.",
        price: 1000,
        button: {
            onClick: null,
            disabled: false,
            name: "Buy"
        }
    },
    {
        name: "Echo Tactica",
        description: "A turn-based tactics game where you command a clone squad.",
        exp: { mind: 5 },
        price: 100,
        button: {
            onClick: null,
            disabled: false,
            name: "Buy"
        }
    }
];