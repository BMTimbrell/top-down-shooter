import {
    store,
    mainMenuAtom,
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
import makePlayer from '../entities/player';
import makeGameState from '../makeGameState';
import { makeBookReadButton, makeGamePlayButton } from '../utils/productOnClick';
import { BOOKS } from '../constants';

export default function mainMenu(k) {
    k.scene("main menu", ({ player, gameState }) => {
        k.setCursor("default");

        store.set(popupAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(dialogueAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(promptAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(shopAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(engineeringAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(geneLabAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(psiLabAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(holorangeAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(gymAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(gardenAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(gameMenuAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(bookMenuAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(mainMenuAtom, {
            visible: true,
            buttons: [
                {
                    name: "Continue",
                    onClick: () => {
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

                        store.set(mainMenuAtom, prev => ({
                            ...prev,
                            visible: false
                        }));

                        k.go("room", { player, gameState });
                    },
                    disabled: !localStorage.getItem("saveData")
                },
                {
                    name: "New Game",
                    onClick: () => {
                        const player = makePlayer(k, k.vec2(0));
                        const gameState = makeGameState(k, { player });

                        store.set(mainMenuAtom, prev => ({
                            ...prev,
                            visible: false
                        }));

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

                        k.go("level1", { player, gameState });
                    },
                    disabled: false
                }
            ]
        });

    });
}