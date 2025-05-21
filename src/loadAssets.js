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

    k.loadSprite("smg", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 88,
            "firing": { from: 88, to: 90, loop: false, speed: GUNS["smg"].animSpeed }
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

    // projectiles
    k.loadSprite("bullet", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 4
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

    k.loadSprite("enemyProjectile", "./sprites/projectile.png", {
        sliceX: 1,
        slicey: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("crosshair", "./sprites/crosshairs.png", {
        sliceX: 12,
        sliceY: 1,
        anims: {
            "idle": 0
        }
    });

    // objects
    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "bed": {
            x: 240,
            y: 0,
            width: 48,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "chair": {
            x: 224,
            y: 0,
            width: 16,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "desk": {
            x: 208,
            y: 0,
            width: 16,
            height: 32
        }
    });

    k.loadSpriteAtlas("./sprites/Tileset.png", {
        "pullup bar": {
            x: 320,
            y: 224,
            width: 32,
            height: 16
        }
    });

    k.loadSpriteAtlas("./sprites/Tileset.png", {
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

    k.loadSprite("birdboss", "./sprites/bird-boss.png", {
        sliceX: 4,
        sliceY: 2,
        anims: {
            "fly": { from: 0, to: 3, loop: true, speed: 7 },
            "dying": { from: 4, to: 7, loop: false, speed: 5 }
        }
    });

    k.loadSprite("warning", "./sprites/warning.png", {
        sliceX: 1,
        sliceY: 1,
        anims: {
            "idle": 0
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

    // tiles
    k.loadSprite("level1Ground", "./sprites/level1.png");
    k.loadSprite("level1BossGround", "./sprites/1-boss.png");

    const tiles = [
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

    tiles.forEach(({ layer, index }) => {
        k.loadSprite(`${layer}${index}`, "./sprites/rocky-tileset.png", {
            sliceX: 9,
            sliceY: 12,
            anims: {
                idle: index - 1, // Tiled's first GID is 1
            },
        });
    });
}

