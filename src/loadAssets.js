import { GUNS } from './constants';

export default function loadAssets(k) {
    // k.loadSprite("player", "./sprites/playertest.png", {
    //     sliceX: 11,
    //     sliceY: 12,
    //     anims: {
    //         "idle": 11,
    //         "walk": { from: 11, to: 14, loop: true, speed: 6 },
    //         "walk2": { from: 112, to: 115, loop: true, speed: 6 },
    //         "dash": { from: 152, to: 157, speed: 10 }
    //     }
    // });

    // k.loadSprite("player", "./sprites/player.png", {
    //     sliceX: 8,
    //     sliceY: 30,
    //     anims: {
    //         "idle": 32,
    //         "walk": { from: 104, to: 107, loop: true, speed: 6 },
    //         "walk2": { from: 112, to: 115, loop: true, speed: 6 },
    //         "dash": { from: 152, to: 157, speed: 10 }
    //     }
    // });
    k.loadFont("dogicabold", "./fonts/dogicabold.ttf", {
        size: 16
    });

    k.loadSprite("coin", "./sprites/coin2.png", {
        sliceX: 1,
        sliceY: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("heart", "./sprites/heart.png", {
        sliceX: 1,
        sliceY: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("player", "./sprites/playertest2.png", {
        sliceX: 8,
        sliceY: 30,
        anims: {
            "idle": 56,
            "idle2": 32,
            "walk": { from: 104, to: 107, loop: true, speed: 6 },
            "walk2": { from: 112, to: 115, loop: true, speed: 6 },
            "dash": { from: 152, to: 157, speed: 10 }
        }
    });

    // guns
    k.loadSprite("pistol", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 0,
            "firing": { from: 0, to: 2, loop: false, speed: GUNS["pistol"].animSpeed }
        }
    });

    k.loadSprite("SMG", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 88,
            "firing": { from: 88, to: 90, loop: false, speed: GUNS["SMG"].animSpeed }
        }
    });

    k.loadSprite("shotgun", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 208,
            "firing": { from: 208, to: 215, loop: false, speed: GUNS["shotgun"].animSpeed }
        }
    });

    k.loadSprite("assault rifle", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 120,
            "firing": { from: 120, to: 122, loop: false, speed: GUNS["assault rifle"].animSpeed }
        }
    });

    k.loadSprite("sniper rifle", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 160,
            "firing": { from: 160, to: 163, loop: false, speed: GUNS["sniper rifle"].animSpeed }
        }
    });

    k.loadSprite("RPG", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 184,
            "firing": { from: 184, to: 188, loop: false, speed: GUNS["RPG"].animSpeed }
        }
    });

    k.loadSprite("minigun", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 200,
            "firing": { from: 200, to: 202, loop: false, speed: GUNS.minigun.animSpeed }
        }
    });

    k.loadSprite("laser pistol", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 8,
            "firing": { from: 8, to: 10, loop: false, speed: GUNS["laser pistol"].animSpeed }
        }
    });

    k.loadSprite("laser SMG", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 24,
            "firing": { from: 24, to: 26, loop: false, speed: GUNS["laser SMG"].animSpeed }
        }
    });

    k.loadSprite("laser rifle", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 16,
            "firing": { from: 16, to: 18, loop: false, speed: GUNS["laser rifle"].animSpeed }
        }
    });

    k.loadSprite("laser shotgun", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 32,
            "firing": { from: 32, to: 37, loop: false, speed: GUNS["laser shotgun"].animSpeed }
        }
    });

    k.loadSprite("laser sniper rifle", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 40,
            "firing": { from: 40, to: 43, loop: false, speed: GUNS["laser sniper rifle"].animSpeed }
        }
    });

    k.loadSprite("laser minigun", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 48,
            "firing": { from: 48, to: 50, loop: false, speed: GUNS["laser minigun"].animSpeed }
        }
    });

    k.loadSprite("blaster launcher", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 56,
            "firing": { from: 56, to: 60, loop: false, speed: GUNS["blaster launcher"].animSpeed }
        }
    });

    k.loadSprite("laser sword", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 64,
            "firing": { from: 64, to: 67, loop: false, speed: GUNS["laser sword"].animSpeed },
            "no ammo": 68
        }
    });

    k.loadSprite("plasma pistol", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 72,
            "firing": { from: 72, to: 74, loop: false, speed: GUNS["plasma pistol"].animSpeed }
        }
    });

    k.loadSprite("plasma SMG", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 80,
            "firing": { from: 80, to: 82, loop: false, speed: GUNS["plasma SMG"].animSpeed }
        }
    });

    k.loadSprite("plasma rifle", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 96,
            "firing": { from: 96, to: 98, loop: false, speed: GUNS["plasma rifle"].animSpeed }
        }
    });

    k.loadSprite("plasma shotgun", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 104,
            "firing": { from: 104, to: 109, loop: false, speed: GUNS["plasma shotgun"].animSpeed }
        }
    });

    k.loadSprite("plasma sniper rifle", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 112,
            "firing": { from: 112, to: 115, loop: false, speed: GUNS["plasma sniper rifle"].animSpeed }
        }
    });

    k.loadSprite("plasma blaster", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 128,
            "firing": { from: 128, to: 132, loop: false, speed: GUNS["plasma blaster"].animSpeed }
        }
    });

    k.loadSprite("plasma minigun", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 136,
            "firing": { from: 136, to: 138, loop: false, speed: GUNS["plasma minigun"].animSpeed }
        }
    });

    k.loadSprite("magic sceptre", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 144,
            "firing": { from: 144, to: 147, loop: false, speed: GUNS["magic sceptre"].animSpeed }
        }
    });

    // projectiles
    k.loadSprite("bullet", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 4
        }
    });

    k.loadSprite("laser", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("plasma", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 1
        }
    });

    k.loadSprite("plasma beam", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 5
        }
    });

    k.loadSprite("blaster", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 3
        }
    });

    k.loadSprite("plasma orb", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 2
        }
    });

    k.loadSprite("magic orb", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 8
        }
    });

    k.loadSprite("psi-beam", "./sprites/psi-beam.png");
    k.loadSprite("force-field", "./sprites/shield.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "idle": 0,
            "fade": { from: 0, to: 3, loop: false, speed: 7 }
        }
    });

    k.loadSprite("rocket", "./sprites/rocket.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "idle": { from: 0, to: 3, loop: true, speed: 10 }
        }
    });

    k.loadSprite("explosion", "./sprites/explosion.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "explode": { from: 0, to: 3, loop: false, speed: 10 }
        }
    });

    k.loadSprite("blast", "./sprites/blast.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "explode": { from: 0, to: 3, loop: false, speed: 10 }
        }
    });

    k.loadSprite("plasma blast", "./sprites/plasma-blast.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "explode": { from: 0, to: 3, loop: false, speed: 10 }
        }
    });

    k.loadSprite("enemyProjectile", "./sprites/projectile.png", {
        sliceX: 1,
        slicey: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("woolProjectile", "./sprites/wool-projectile.png", {
        sliceX: 1,
        slicey: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("wool", "./sprites/wool.png");

    k.loadSprite("crosshair", "./sprites/crosshairs.png", {
        sliceX: 12,
        sliceY: 1,
        anims: {
            "idle": 0
        }
    });

    // objects
    k.loadSpriteAtlas("./sprites/ship-tileset.png", {
        "bed": {
            x: 240,
            y: 0,
            width: 48,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/ship-tileset.png", {
        "chair": {
            x: 224,
            y: 0,
            width: 16,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/ship-tileset.png", {
        "desk": {
            x: 208,
            y: 0,
            width: 16,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/ship-tileset.png", {
        "pullup bar": {
            x: 320,
            y: 224,
            width: 32,
            height: 16
        }
    });

    k.loadSprite("VR Headset", "./sprites/vr-headset.png");

    k.loadSpriteAtlas("./sprites/ship-tileset.png", {
        "door": {
            x: 256,
            y: 96,
            width: 32,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/rocky-tileset.png", {
        "boulder": {
            x: 48,
            y: 144,
            width: 32,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/cave-tileset.png", {
        "caveBoulder": {
            x: 48,
            y: 96,
            width: 32,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/forest-tileset.png", {
        "mossyBoulder": {
            x: 16,
            y: 32,
            width: 32,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/rocky-tileset.png", {
        "greenPlant": {
            x: 64,
            y: 64,
            width: 32,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/rocky-tileset.png", {
        "redPlant": {
            x: 32,
            y: 48,
            width: 32,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/cave-tileset.png", {
        "cavePlant": {
            x: 80,
            y: 80,
            width: 16,
            height: 16
        }
    });

    k.loadSpriteAtlas("./sprites/forest-tileset.png", {
        "tree": {
            x: 32,
            y: 0,
            width: 32,
            height: 32
        }
    });

    // npcs
    k.loadSprite("npc1", "./sprites/npc1.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "idle": 0,
            "talk": { from: 1, to: 3, loop: true, speed: 5 }
        }
    });

    k.loadSprite("npc2", "./sprites/npc2.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "idle": 0,
            "talk": { from: 1, to: 3, loop: true, speed: 5 }
        }
    });

    k.loadSprite("npc3", "./sprites/npc3.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "idle": 0,
            "talk": { from: 1, to: 3, loop: true, speed: 5 }
        }
    });

    k.loadSprite("robotnpc", "./sprites/robot.png", {
        sliceX: 5,
        sliceY: 1,
        anims: {
            "broken": 0,
            "idle": 1,
            "talk": { from: 2, to: 4, loop: true, speed: 5 }
        }
    });

    // enemies
    k.loadSprite("bird", "./sprites/bird-sheet2.png", {
        sliceX: 8,
        sliceY: 2,
        anims: {
            "walk": { from: 0, to: 7, loop: true, speed: 7 },
            "dying": { from: 8, to: 10, loop: false, speed: 5 }
        }
    });

    k.loadSprite("redbird", "./sprites/red-bird-sheet.png", {
        sliceX: 8,
        sliceY: 2,
        anims: {
            "walk": { from: 0, to: 7, loop: true, speed: 7 },
            "dying": { from: 8, to: 10, loop: false, speed: 5 }
        }
    });

    k.loadSprite("mole", "./sprites/alien_mole-sheet.png", {
        sliceX: 4,
        sliceY: 4,
        anims: {
            "walk": { from: 0, to: 3, loop: true, speed: 7 },
            "rotate": { from: 4, to: 7, loop: false, speed: 7 },
            "dig": { from: 8, to: 11, loop: true, speed: 20 },
            "dying": { from: 12, to: 15, loop: false, speed: 6 }
        }
    });

    k.loadSprite("wisp", "./sprites/wisp.png", {
        sliceX: 11,
        sliceY: 4,
        anims: {
            "walk": { from: 0, to: 3, loop: true, speed: 6 },
            "angry": { from: 11, to: 17, loop: false, speed: 6 },
            "attack": { from: 22, to: 23, loop: true, speed: 8 },
            "dying": { from: 33, to: 43, loop: false, speed: 9 }
        }
    });

    k.loadSprite("bluewisp", "./sprites/blue-wisp.png", {
        sliceX: 11,
        sliceY: 4,
        anims: {
            "walk": { from: 0, to: 3, loop: true, speed: 6 },
            "angry": { from: 11, to: 17, loop: false, speed: 6 },
            "attack": { from: 22, to: 23, loop: true, speed: 8 },
            "dying": { from: 33, to: 43, loop: false, speed: 9 }
        }
    });

    k.loadSprite("birdboss", "./sprites/bird-boss.png", {
        sliceX: 4,
        sliceY: 2,
        anims: {
            "fly": { from: 0, to: 3, loop: true, speed: 7 },
            "dying": { from: 4, to: 7, loop: false, speed: 5 }
        }
    });

    k.loadSprite("bat", "./sprites/bat-sheet.png", {
        sliceX: 4,
        sliceY: 2,
        anims: {
            "walk": { from: 0, to: 3, loop: true, speed: 7 },
            "dying": { from: 4, to: 7, loop: false, speed: 6 }
        }
    });

    k.loadSprite("redbat", "./sprites/red-bat-sheet.png", {
        sliceX: 4,
        sliceY: 2,
        anims: {
            "walk": { from: 0, to: 3, loop: true, speed: 7 },
            "dying": { from: 4, to: 7, loop: false, speed: 6 }
        }
    });

    k.loadSprite("redmole", "./sprites/red-Alien_mole-sheet.png", {
        sliceX: 4,
        sliceY: 4,
        anims: {
            "walk": { from: 0, to: 3, loop: true, speed: 7 },
            "rotate": { from: 4, to: 7, loop: false, speed: 7 },
            "dig": { from: 8, to: 11, loop: true, speed: 20 },
            "dying": { from: 12, to: 15, loop: false, speed: 6 }
        }
    });

    k.loadSprite("tortoise", "./sprites/tortoise-sheet.png", {
        sliceX: 6,
        sliceY: 3,
        anims: {
            "walk": { from: 0, to: 1, loop: true, speed: 3 },
            "hide": { from: 6, to: 10, loop: false, speed: 10 },
            "dying": { from: 12, to: 17, loop: false, speed: 6 }
        }
    });

    k.loadSprite("bluetortoise", "./sprites/blue-tortoise-sheet.png", {
        sliceX: 6,
        sliceY: 3,
        anims: {
            "walk": { from: 0, to: 1, loop: true, speed: 3 },
            "hide": { from: 6, to: 10, loop: false, speed: 10 },
            "dying": { from: 12, to: 17, loop: false, speed: 6 }
        }
    });

    k.loadSprite("moleboss", "./sprites/mole-boss.png", {
        sliceX: 4,
        sliceY: 4,
        anims: {
            "walk": { from: 0, to: 3, loop: true, speed: 7 },
            "crouch": { from: 4, to: 5, loop: false, speed: 5 },
            "dig": { from: 8, to: 9, loop: true, speed: 7 },
            "dying": { from: 12, to: 15, loop: false, speed: 5 }
        }
    });

    k.loadSprite("wolf", "./sprites/wolf-sheet.png", {
        sliceX: 4,
        sliceY: 3,
        anims: {
            "walk": { from: 0, to: 2, loop: true, speed: 6 },
            "attack": 8,
            "dying": { from: 4, to: 7, loop: false, speed: 6 }
        }
    });

    k.loadSprite("bluewolf", "./sprites/blue-wolf-sheet.png", {
        sliceX: 4,
        sliceY: 3,
        anims: {
            "walk": { from: 0, to: 2, loop: true, speed: 6 },
            "attack": 8,
            "dying": { from: 4, to: 7, loop: false, speed: 6 }
        }
    });

    k.loadSprite("sheepboss", "./sprites/sheep-boss.png", {
        sliceX: 5,
        sliceY: 6,
        anims: {
            "walk": { from: 0, to: 1, loop: true, speed: 6 }
        }
    });

    k.loadSprite("sheepbossDamaged", "./sprites/sheep-boss.png", {
        sliceX: 5,
        sliceY: 6,
        anims: {
            "walk": { from: 5, to: 6, loop: true, speed: 6 },
            "remove clothes": { from: 10, to: 14, loop: false, speed: 6 }
        }
    });

    k.loadSprite("wolfBoss", "./sprites/sheep-boss.png", {
        sliceX: 5,
        sliceY: 6,
        anims: {
            "idle": { from: 15, to: 16, loop: true, speed: 3 },
            "run": { from: 20, to: 21, loop: true, speed: 6 },
            "dying": { from: 25, to: 28, loop: false, speed: 6 }
        }
    });

    k.loadSprite("floatingrock", "./sprites/floatingRock.png", {
        sliceX: 7,
        sliceY: 2,
        anims: {
            "walk": { from: 0, to: 3, loop: true, speed: 6 },
            "dying": { from: 7, to: 13, loop: false, speed: 10 }
        }
    });

    k.loadSprite("warning", "./sprites/warning.png", {
        sliceX: 1,
        sliceY: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("healing", "./sprites/healing.png", {
        sliceX: 7,
        sliceY: 1,
        anims: {
            "heal": { from: 0, to: 6, loop: false, speed: 10 }
        }
    });

    k.loadSprite("falling boulder", "./sprites/boulder.png", {
        sliceX: 19,
        sliceY: 1,
        anims: {
            "idle": 0,
            "fall":  { from: 0, to: 18, loop: false, speed: 50 }
        }
    });

    k.loadSprite("portal", "./sprites/portal.png", {
        sliceX: 6,
        sliceY: 1,
        anims: {
            "idle": { from: 0, to: 5, loop: true, speed: 8 }
        }
    });

    k.loadSprite("dirtPuff", "./sprites/dirtpuff.png", {
        sliceX: 7,
        sliceY: 1,
        anims: {
            "puff": { from: 0, to: 6, loop: true, speed: 10 }
        }
    });

    k.loadSprite("crack", "./sprites/crack.png", {
        sliceX: 4,
        sliceY: 1,
        anims: {
            "idle": 0,
            "crack": { from: 0, to: 3, loop: false, speed: 10 }
        }
    });

    // maps
    k.loadSprite("level1Ground", "./sprites/level1.png");
    k.loadSprite("level1BossGround", "./sprites/1-boss.png");
    k.loadSprite("room", "./sprites/room.png");
    k.loadSprite("mainLobby", "./sprites/main-lobby.png");
    k.loadSprite("shop", "./sprites/shop.png");
    k.loadSprite("garden", "./sprites/garden.png");
    k.loadSprite("gym", "./sprites/gym.png");
    k.loadSprite("holorange", "./sprites/holorange.png");
    k.loadSprite("engineering", "./sprites/engineering.png");
    k.loadSprite("psi-lab", "./sprites/psi-lab.png");
    k.loadSprite("gene-lab", "./sprites/gene-lab.png");
    k.loadSprite("level2Ground", "./sprites/level2.png");
    k.loadSprite("level2BossGround", "./sprites/2-boss.png");
    k.loadSprite("level3Ground", "./sprites/level3.png");
    k.loadSprite("level3BossGround", "./sprites/3-boss.png");
    k.loadSprite("level4Ground", "./sprites/level4.png");

    // tiles
    const rockyTiles = [
        { layer: "ground", index: 78 },
        { layer: "ground", index: 59 },
        { layer: "ground", index: 60 },
        { layer: "ground", index: 68 },
        { layer: "ground", index: 69 },

        { layer: "walls", index: 73 },
        { layer: "walls", index: 74 },
        { layer: "walls", index: 75 },
        { layer: "walls", index: 82 },
        { layer: "walls", index: 84 },
        { layer: "walls", index: 92 },
        { layer: "walls", index: 93 },
        { layer: "walls", index: 91 },
        { layer: "walls", index: 105 },
        { layer: "walls", index: 106 },
        { layer: "walls", index: 103 },
        { layer: "walls", index: 101 },
        { layer: "walls", index: 100 },
        { layer: "walls", index: 102 },
        { layer: "walls", index: 104 },
        { layer: "walls", index: 97 },
        { layer: "walls", index: 98 },
        { layer: "walls", index: 96 },
        { layer: "walls", index: 87 },
        { layer: "walls", index: 88 },
        { layer: "walls", index: 99 },
        { layer: "walls", index: 108 },
        { layer: "walls", index: 89 },
        { layer: "walls", index: 90 },
        { layer: "walls", index: 107 },

        { layer: "props", index: 46 },
        { layer: "props", index: 56 },
        { layer: "props", index: 55 },
        { layer: "props", index: 49 },
        { layer: "props", index: 58 },
        { layer: "props", index: 57 },
        { layer: "props", index: 64 },
        { layer: "props", index: 65 },
        { layer: "props", index: 66 },
        { layer: "props", index: 67 },
    ];

    rockyTiles.forEach(({ layer, index }) => {
        k.loadSprite(`rocky-tileset${layer}${index}`, "./sprites/rocky-tileset.png", {
            sliceX: 9,
            sliceY: 12,
            anims: {
                idle: index - 1, // Tiled's first GID is 1
            },
        });
    });

    const shipTiles = [
        { layer: "ground", index: 179 },

        { layer: "walls", index: 116 },
        { layer: "walls", index: 117 },
        { layer: "walls", index: 118 },
        { layer: "walls", index: 147 },
        { layer: "walls", index: 148 },
        { layer: "walls", index: 149 },
        { layer: "walls", index: 178 },
        { layer: "walls", index: 180 },
        { layer: "walls", index: 209 },
        { layer: "walls", index: 210 },
        { layer: "walls", index: 211 },
        { layer: "walls", index: 241 },

        { layer: "props", index: 85 },
    ];

    shipTiles.forEach(({ layer, index }) => {
        k.loadSprite(`ship-tileset${layer}${index}`, "./sprites/ship-tileset.png", {
            sliceX: 31,
            sliceY: 16,
            anims: {
                idle: index - 1, // Convert Tiled GID (starting at 1) to 0-based frame index
            },
        });
    });

    const caveTiles = [
        { layer: "walls", index: 2 },
        { layer: "walls", index: 3 },
        { layer: "walls", index: 8 },
        { layer: "walls", index: 9 },
        { layer: "walls", index: 15 },
        { layer: "walls", index: 7 },
        { layer: "walls", index: 13 },
        { layer: "walls", index: 14 },
        { layer: "walls", index: 19 },
        { layer: "walls", index: 20 },
        { layer: "walls", index: 25 },
        { layer: "walls", index: 29 },
        { layer: "walls", index: 31 },
        { layer: "walls", index: 32 },
        { layer: "walls", index: 33 },
        { layer: "walls", index: 34 },
        { layer: "walls", index: 35 },
        { layer: "props", index: 50 },
        { layer: "props", index: 37 },
        { layer: "props", index: 43 },
        { layer: "props", index: 51 },
        { layer: "props", index: 44 },
        { layer: "props", index: 45 },
        { layer: "props", index: 49 },
        { layer: "props", index: 53 },
        { layer: "props", index: 38 },
        { layer: "props", index: 39 },
        { layer: "props", index: 52 },
        { layer: "props", index: 54 },
        { layer: "props", index: 5 },
        { layer: "props", index: 6 },
        { layer: "props", index: 11 },
        { layer: "props", index: 12 },

    ];

    caveTiles.forEach(({ layer, index }) => {
        k.loadSprite(`cave-tileset${layer}${index}`, "./sprites/cave-tileset.png", {
            sliceX: 6,
            sliceY: 9,
            anims: {
                idle: index - 1, // Convert Tiled GID (starting at 1) to 0-based frame index
            },
        });
    });

    // const forestTiles = [
    //     { layer: "walls", index: 3 },
    //     { layer: "walls", index: 4 },
    //     { layer: "walls", index: 7 },
    //     { layer: "walls", index: 8 }
    // ];

    // forestTiles.forEach(({ layer, index }) => {
    //     k.loadSprite(`forest-tileset${layer}${index}`, "./sprites/forest-tileset.png", {
    //         sliceX: 4,
    //         sliceY: 4,
    //         anims: {
    //             idle: index - 1, // Convert Tiled GID (starting at 1) to 0-based frame index
    //         },
    //     });
    // });


}

