import {
    store,
    gameOverScreenAtom,
    gameInfoAtom,
    shopAtom,
    engineeringAtom,
    psiLabAtom,
    geneLabAtom,
    gardenAtom,
    holorangeAtom,
    gymAtom,
    dialogueAtom,
    popupAtom,
    promptAtom,
    bookMenuAtom,
    gameMenuAtom
} from '../store';
import { BOOKS } from "../constants";
import makeGameState from "../makeGameState";
import makePlayer from "../entities/player";
import { makeBookReadButton, makeGamePlayButton } from '../utils/productOnClick';

export default function gameOver(k) {
    k.scene("gameOver", ({ player, gameState }) => {
        k.setCursor("default");

        store.set(gameOverScreenAtom, prev => ({
            ...prev,
            visible: true,
            buttons: [
                {
                    text: "Restart Day",
                    onClick: () => {
                        if (gameState.day === 1) {
                            store.set(gameInfoAtom, {
                                day: 1,
                                time: 1,
                                health: 4,
                                maxHealth: 4,
                                gold: 0,
                                cooldwns: {
                                    dash: 1,
                                    reload: 1
                                },
                                onMission: false,
                                daysUntilMission: 6,
                                gunIndex: 0,
                                maxGuns: 3,
                                reloading: false,
                                rBarPos: {
                                    x: 0,
                                    y: 0
                                }
                            });

                            player = makePlayer(k, k.vec2(0));
                            gameState = makeGameState(k, { player });

                            store.set(gameOverScreenAtom, prev => ({ ...prev, visible: false }));
                            k.go("level1", { player, gameState: gameState });
                        } else {
                            store.set(gameOverScreenAtom, prev => ({ ...prev, visible: false }));

                            const saveData = JSON.parse(localStorage.getItem("saveData"));

                            store.set(gameInfoAtom, saveData.gameInfo);
                            store.set(shopAtom, saveData.shop);
                            store.set(engineeringAtom, saveData.engineering);
                            store.set(psiLabAtom, saveData.psiLab);
                            store.set(geneLabAtom, saveData.geneLab);
                            store.set(gardenAtom, saveData.garden);

                            player = makePlayer(k, k.vec2(0), { saveData: saveData.player });
                            gameState = makeGameState(k, { saveData: saveData.gameState, player });

                            player.books.forEach(book => {
                                const bRef = BOOKS.find(b => b.title === book.title);
                                if (bRef.action) book.action = () => bRef.action(player);

                                makeBookReadButton(k, { book, player, gameState });
                            });

                            player.electronics.forEach(e => {
                                if (e.name !== "VR Headset") {
                                    makeGamePlayButton(k, { game: e, player, gameState });
                                }
                            });

                            k.go("room", { player, gameState });
                        }

                    }
                },
                {
                    text: "Main Menu",
                    onClick: () => {
                        store.set(gameOverScreenAtom, prev => ({ ...prev, visible: false }));
                        k.go("main menu", { player, gameState: k.get("gameState")[0] });
                    }
                }
            ]
        }));

    });
}