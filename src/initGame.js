import makeKaplayCtx from './kaplayCtx';
import makePlayer from './entities/player';

export default function initGame() {
    const k = makeKaplayCtx();
    k.loadSprite("player", "./sprites/player2.png", {
        sliceX: 8,
        sliceY: 30,
        anims: {
            "idle": 113,
            "walk": { from: 112, to: 115, loop: true, speed: 6 },
            "dash": { from: 152, to: 157, speed: 10 }
        }
    });

    k.loadSprite("pistol", "./sprites/weapons1.png", {
        sliceX: 8,
        sliceY: 25,
        anims: {
            "idle": 0,
            "firing": { from: 0, to: 2, loop: true }
        }
    });

    k.loadSprite("bullet", "./sprites/bullets3.png", {
        sliceX: 25,
        sliceY: 1,
        anims: {
            "idle": 4
        }
    });

    makePlayer(k, k.vec2(k.center()));
}