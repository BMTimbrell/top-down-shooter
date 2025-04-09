import { DIAGONAL_FACTOR } from "../constants";
import { GUNS } from '../constants';
import { gameInfoAtom, menuAtom, playerInfoAtom, store } from "../store";
import makeGun from "./gun";

export default function makePlayer(k, posVec2) {

    const player = k.make([
        k.sprite("player", { anim: "idle" }),
        k.scale(5),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0, 10), 10, 10)
        }),
        k.body(),
        k.pos(posVec2),
        k.timer(),
        "player",
        {
            speed: 200,
            direction: k.vec2(0),
            directionVector: k.vec2(0),
            isDashing: false,
            dashCd: 3,
            reloadCd: 2,
            dashOnCd: false,
            dashLength: 400,
            onMission: false,
            inDialogue: false,
            reloading: false,
            guns: [
                { name: "pistol", ammo: GUNS.pistol.maxAmmo, ...GUNS.pistol, clip: GUNS.pistol.clipSize },
                { name: "smg", ammo: GUNS.smg.maxAmmo, ...GUNS.smg, clip: GUNS.smg.clipSize },
                { name: "shotgun", ammo: GUNS.shotgun.maxAmmo, ...GUNS.shotgun, clip: GUNS.shotgun.clipSize }
            ],
            gunIndex: 0,
            maxGuns: 3,
            mind: { level: 1, exp: 25, maxExp: 50 },
            body: { level: 1, exp: 5, maxExp: 50 },
            weaponLvl: { level: 1, exp: 0, maxExp: 50 }
        }
    ]);

    store.set(playerInfoAtom, prev => ({
        ...prev,
        data: {
            ...prev.data,
            guns: player.guns,
            gunIndex: player.gunIndex
        }
    }));

    function setOnMission(onMission = false) {
        if (onMission) {
            player.onMission = true;
            store.set(gameInfoAtom, prev => ({ ...prev, onMission: true }));
        }
    }

    function setPlayerDashing(isDashing) {
        if (isDashing) {
            player.play("dash");
            player.isDashing = true;
            player.dashOnCd = true;
            store.set(gameInfoAtom, prev => ({ ...prev, cooldwns: { ...prev.cooldwns, dash: 0 } }));

            player.wait(player.dashCd, () => {
                player.dashOnCd = false;
            });

            // every 0.1s update cd progress for ui
            const interval = 0.1;
            player.loop(interval, () => {
                store.set(gameInfoAtom, prev => ({
                    ...prev,
                    cooldwns: {
                        ...prev.cooldwns,
                        dash: prev.cooldwns.dash + interval / player.dashCd
                    }
                }));
            }, player.dashCd / interval);
        }
    }

    function equipGun(index = 0) {
        // reset reload when changing guns
        if (player.reloading) {
            player.reloading = false;
            store.set(gameInfoAtom, prev => ({
                ...prev,
                reloading: false,
            }));

            reloadWait.cancel();
            reloadLoop.cancel();
        }

        if (index >= player.guns.length) index = 0;
        if (index < 0) index = player.guns.length - 1;

        player.gunIndex = index;
        const gun = player.guns[index];
        store.set(
            gameInfoAtom,
            prev => ({
                ...prev,
                cooldwns: { ...prev.cooldwns, reload: gun.clip / gun.clipSize }
            })
        );

        makeGun(k, player, player.guns[index]);

        store.set(gameInfoAtom, prev => ({
            ...prev,
            gunIndex: player.gunIndex
        }));
    }

    function addGun(gun) {
        if (player.guns.length < player.maxGuns) {
            player.guns.push(gun);
            store.set(playerInfoAtom, prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    guns: player.guns
                }
            }));
            return gun;
        }

        return null;
    }

    function loseAmmo() {
        const gun = player.guns[player.gunIndex];
        gun.ammo--;
        gun.clip--;
        store.set(playerInfoAtom, prev => ({
            ...prev,
            data: {
                ...prev.data,
                guns: player.guns
            }
        }));

        store.set(
            gameInfoAtom,
            prev => ({
                ...prev,
                cooldwns: { ...prev.cooldwns, reload: gun.clip / gun.clipSize }
            })
        );
    }

    let reloadLoop = null;
    let reloadWait = null;

    function reload() {
        const gun = player.guns[player.gunIndex];
        if (gun.ammo <= 0 || gun.clip === gun.clipSize) return;

        store.set(gameInfoAtom, prev => ({ ...prev, cooldwns: { ...prev.cooldwns, reload: 0 } }));

        player.reloading = true;
        store.set(gameInfoAtom, prev => ({
            ...prev,
            reloading: true,
        }));

        reloadWait = player.wait(player.reloadCd, () => {
           gun.clip = Math.min(
                gun.ammo,
                gun.clipSize
            );

            player.reloading = false;
            store.set(gameInfoAtom, prev => ({
                ...prev,
                reloading: false,
            }));

            store.set(playerInfoAtom, prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    guns: player.guns
                },
            }));
        });

        // every 0.1s update cd progress for ui
        const interval = 0.1;
        reloadLoop = player.loop(interval, () => {
            store.set(gameInfoAtom, prev => ({
                ...prev,
                cooldwns: {
                    ...prev.cooldwns,
                    reload: prev.cooldwns.reload + interval / player.reloadCd
                }
            }));
        }, player.reloadCd / interval);

    }

    player.use({ setOnMission, setPlayerDashing, equipGun, addGun, loseAmmo, reload });

    player.setOnMission(true);

    let mWheel = '';

    document.addEventListener('wheel', event => {
        if (player.inDialogue || store.get(menuAtom).visible) return;
        if (event.deltaY > 0) {
            mWheel = 'down';
        } else if (event.deltaY < 0) {
            mWheel = 'up';
        }
    });

    player.onUpdate(() => {
        const worldMousePos = k.toWorld(k.mousePos());
        player.direction = worldMousePos.sub(player.pos).unit();

        if (!k.getCamPos().eq(player.pos)) {
            k.tween(
                k.getCamPos(),
                player.pos,
                0.2,
                newPos => k.setCamPos(newPos),
                k.easings.linear
            );
        }

        if (player.reloading) {
            store.set(gameInfoAtom, prev => ({
                ...prev,
                rBarPos: {
                    x: player.screenPos().x,
                    y: player.screenPos().y - 20
                }
            }));
        }

        // don't do anything while showing dialogue box
        if (player.inDialogue) return;

        // dashing
        if (k.isMouseDown("right") && !player.isDashing && !player.dashOnCd) {
            if (!player.directionVector.eq(k.vec2(0))) {
                if (player.directionVector.x < 0) player.flipX = true;
                else player.flipX = false;
            }

            player.setPlayerDashing(true);
        }

        if (player.isDashing) {
            // dash direction facing if not moving
            if (player.directionVector.eq(k.vec2(0))) {
                if (player.flipX) {
                    player.move(k.vec2(-1, 0).scale(player.dashLength));
                } else {
                    player.move(k.vec2(1, 0).scale(player.dashLength));
                }
            }
            // move same speed diagonally as horizontal and vertically
            if (player.directionVector.x && player.directionVector.y) {
                player.move(player.directionVector.scale(DIAGONAL_FACTOR * player.dashLength));
            } else {
                player.move(player.directionVector.scale(player.dashLength));
            }
            player.onAnimEnd(() => {
                player.isDashing = false;
            });
            return;
        }

        // change weapon
        if (k.isKeyPressed(['1', '2', '3', '4', '5'])) {
            const keyDown = k.isKeyPressed('1') ? 1 :
                k.isKeyPressed('2') ? 2 :
                    k.isKeyPressed('3') ? 3 :
                        k.isKeyPressed('4') ? 4 : 5;
            player.equipGun(keyDown - 1);
        }
        if (mWheel === 'down') {
            player.equipGun(player.gunIndex + 1);
        } else if (mWheel === 'up') {
            player.equipGun(player.gunIndex - 1);
        }
        mWheel = '';

        // reload
        if (k.isKeyPressed("r")) {
            player.reload();
        }

        // movement
        player.directionVector = k.vec2(0);
        if (k.isKeyDown("a")) player.directionVector.x = -1;
        if (k.isKeyDown("d")) player.directionVector.x = 1;
        if (k.isKeyDown("w")) player.directionVector.y = -1;
        if (k.isKeyDown("s")) player.directionVector.y = 1;

        // face direction of mouse
        if (player.direction.x < 0) {
            player.flipX = true;
        } else {
            player.flipX = false;
        }

        if (!player.isDashing) {
            if (
                k.isKeyDown("a") ||
                k.isKeyDown("d") ||
                k.isKeyDown("w") ||
                k.isKeyDown("s")
            ) {
                if (!player.onMission && player?.getCurAnim()?.name !== "walk") player.play("walk");
                else if (player.onMission && player?.getCurAnim()?.name !== "walk2") player.play("walk2");
            } else {
                player.play("idle");
            }
        }

        // move same speed diagonally as horizontal and vertically
        if (player.directionVector.x && player.directionVector.y) {
            player.move(player.directionVector.scale(DIAGONAL_FACTOR * player.speed));
            return;
        }

        player.move(player.directionVector.scale(player.speed));
    });

    return player;
}