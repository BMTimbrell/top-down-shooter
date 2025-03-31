import { GUNS } from './constants';

export default function loadAssets(k) {
    k.loadSprite("player", "./sprites/player.png", {
        sliceX: 8,
        sliceY: 30,
        anims: {
            "idle": 113,
            "walk": { from: 104, to: 107, loop: true, speed: 6 },
            "walk2": { from: 112, to: 115, loop: true, speed: 6 },
            "dash": { from: 152, to: 157, speed: 10 }
        }
    });

    k.loadSprite("pistol", "./sprites/weapons1.png", {
        sliceX: 8,
        sliceY: 25,
        anims: {
            "idle": 0,
            "firing": { from: 0, to: 2, loop: true, speed: GUNS["pistol"].animSpeed }
        }
    });

    k.loadSprite("smg", "./sprites/weapons1.png", {
        sliceX: 8,
        sliceY: 25,
        anims: {
            "idle": 88,
            "firing": { from: 88, to: 90, loop: true, speed: GUNS["smg"].animSpeed }
        }
    });

    k.loadSprite("bullet", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 4
        }
    });

    k.loadSprite("crosshair", "./sprites/crosshairs.png", {
        sliceX: 12,
        sliceY: 1,
        anims: {
            "idle": 0
        }
    });

    k.loadSprite("room", "./sprites/room.png");
    k.loadSprite("main lobby", "./sprites/main-lobby.png");
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
}

