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

    k.loadSprite("player", "./sprites/playertest2.png", {
        sliceX: 8,
        sliceY: 30,
        anims: {
            "idle": 56,
            "idle2": 32,
            "walk": { from: 104, to: 107, loop: true, speed: 6 },
            "walk2": { from: 112, to: 115, loop: true, speed: 6 },
            "dash": { from: 152, to: 156, speed: 10 }
        }
    });

    // guns
    k.loadSprite("pistol", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 0,
            "firing": { from: 0, to: 2, loop: true, speed: GUNS["pistol"].animSpeed }
        }
    });

    k.loadSprite("smg", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 88,
            "firing": { from: 88, to: 90, loop: true, speed: GUNS["smg"].animSpeed }
        }
    });

    k.loadSprite("shotgun", "./sprites/weapons.png", {
        sliceX: 8,
        sliceY: 36,
        anims: {
            "idle": 208,
            "firing": { from: 208, to: 215, loop: true, speed: GUNS["shotgun"].animSpeed }
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

    // enemies
    k.loadSprite("bird", "./sprites/bird.png", {
        sliceX: 1,
        sliceY: 1,
        anims: {
            "idle": 0,
            // "walk": { from: 4, to: 7, loop: true, speed: 6 }
        }
    });
}

