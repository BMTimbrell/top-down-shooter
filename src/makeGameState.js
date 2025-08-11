import {
    pauseMenuAtom,
    playerInfoAtom,
    infoBoxAtom,
    victoryScreenAtom,
    store
} from "./store";

import { BOOKS, ELECTRONICS } from './constants';

export default function makeGameState(k, { saveData = null, player }) {
    const day = saveData ? saveData.day : 1;
    const time = saveData ? saveData.time : 1;
    const events = saveData ? saveData.events : {
        skillExplanations: {
            overview: true,
            "pullup bar": true,
            bed: true,
            desk: true
        }
    };
    const nextLevel = saveData ? saveData.nextLevel : "level2";

    const shop = saveData ? saveData.shop : {
        books: BOOKS.map(book => {
            return {
                ...book
            };
        }),
        electronics: ELECTRONICS
    };

    const robot = saveData ? saveData.robot : {
        broken: true,
        fixProgress: 0
    };

    const gameState = k.make([
        "gameState",
        {
            day,
            time,
            events,
            reinforcements: [],
            pendingSpawns: [],
            debugTimer: 3,
            shop,
            robot,
            nextLevel
        }
    ]);

    gameState.onUpdate(() => {
        const paused = store.get(pauseMenuAtom).visible ||
            store.get(infoBoxAtom).visible ||
            store.get(victoryScreenAtom).visible;

        if (k.isKeyPressed("escape")) {
            // set data to show in menu
            if (!paused) {
                store.set(
                    pauseMenuAtom,
                    prev => ({
                        ...prev,
                        buttons: [
                            {
                                name: "Resume",
                                onClick: () => {
                                    store.set(pauseMenuAtom, prev => ({ ...prev, visible: false }));
                                    k.query({
                                        include: "*",
                                        exclude: "gameState"
                                    }).forEach(e => e.paused = false);
                                }
                            },
                            {
                                name: "Player Info",
                                onClick: () => store.set(playerInfoAtom, prev => ({
                                    visible: true,
                                    data: {
                                        guns: player.guns,
                                        exp: {
                                            mind: player.mind,
                                            body: player.body,
                                            weapon: player.weapon
                                        },
                                        abilities: prev.data.abilities
                                    }
                                }))
                            },
                            {
                                name: "Exit to Main Menu",
                                onClick: () => {
                                    store.set(pauseMenuAtom, prev => ({ ...prev, visible: false }));
                                    k.query({
                                        include: "*",
                                        exclude: "gameState"
                                    }).forEach(e => e.paused = false);
                                    k.go("main menu", { player, gameState });
                                }
                            }
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

            // toggle menu visibility
            store.set(pauseMenuAtom, prev => ({ ...prev, visible: !store.get(pauseMenuAtom).visible && !paused }));
        }

        k.get(['pausable']).forEach(e => {
            e.paused = paused;
        });
    });

    return gameState;
}
