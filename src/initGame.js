import makeKaplayCtx from './kaplayCtx';
import makePlayer from './entities/player';
import loadAssets from './loadAssets';
import room from './scenes/room';
import mainLobby from './scenes/mainLobby';
import level1 from './scenes/level1';

import { menuAtom, playerInfoAtom, infoBoxAtom, store } from "./store";

export default function initGame() {
    // focus back on canvas when clicking on html elements
    window.addEventListener("click", () => document.getElementById('game').focus());

    const k = makeKaplayCtx();

    loadAssets(k);

    k.setBackground(k.Color.fromHex("#131313"));

    room(k);

    mainLobby(k);

    level1(k);

    const player = makePlayer(k, k.vec2(0));

    const gameState = k.make([
        "gameState",
        {
            day: 1,
            time: 1,
            firstScene: {
                "room": true,
                "main lobby": true,
                "level1": true
            },
            reinforcements: [],
            pendingSpawns: []
        }
    ]);

    gameState.onUpdate(() => {
        if (k.isKeyPressed("escape") && !player.inDialogue) {
            // set data to show in menu
            if (!store.get(menuAtom).visible) {
                store.set(
                    menuAtom,
                    prev => ({
                        ...prev,
                        buttons: [
                            {
                                name: "Resume", 
                                onClick: () => {
                                    store.set(menuAtom, prev => ({ ...prev, visible: false }));
                                    k.query({
                                        include: "*",
                                        exclude: "gameState"
                                    }).forEach(e => e.paused = false);
                                }
                            },
                            {
                                name: "Player Info",
                                onClick: () => store.set(playerInfoAtom, {
                                    visible: true,
                                    data: {
                                        guns: player.guns,
                                        exp: {
                                            mind: player.mind,
                                            body: player.body,
                                            weaponLvl: player.weaponLvl
                                        }
                                    }
                                })
                            },
                            { name: "Exit to Main Menu" }
                        ]
                    })
                );
            } else {
                // reset menu after closing
                store.set(playerInfoAtom, prev => ({
                    ...prev,
                    visible: false
                }));
            }

            // toggle game pause and menu visibility
            store.set(menuAtom, prev => ({ ...prev, visible: !store.get(menuAtom).visible }));
        }

        if (store.get(menuAtom).visible || store.get(infoBoxAtom).visible) {
            k.query([]).forEach(e => {
                if (!e.is("gameState") && !e.is("crosshair")) {
                    e.paused = true;
                }
            });
        } else {
            k.query([]).forEach(e => e.paused = false);
        }
    });

    k.go("level1", { player, gameState });
}