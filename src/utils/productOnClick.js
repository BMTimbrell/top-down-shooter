import {
    store,
    bookMenuAtom,
    gameMenuAtom
} from '../store';

export function makeBookReadButton(k, { book, player, gameState }) {

    book.button = {
        onClick: () => {
            book.progress.current++;
            book.button.disabled = book.progress.current === book.progress.max;
            store.set(bookMenuAtom, prev => ({
                ...prev,
                visible: false,
                books: player.books
            }));

            let exp = null
            let action = null
            if (book.progress.current === book.progress.max && !book.action) {
                exp = {
                    type: Object.keys(book.exp)[0],
                    amount: book.exp[Object.keys(book.exp)[0]]
                };
            } else if (book.progress.current === book.progress.max) {
                action = book.action;
            }
            k.go("timeTransition", {
                player,
                gameState,
                event: {
                    text: book.text[book.progress.current - 1],
                    exp,
                    action
                },
            });
        },
        disabled: book.progress.current === book.progress.max,
        name: "Read",
        icon: true
    };
}

export function makeGamePlayButton(k, { game, player, gameState }) {
    if (game.name === "Echo Tactica") {
        game.button = {
            onClick: () => {
                store.set(gameMenuAtom, prev => ({
                    ...prev,
                    visible: false
                }));

                const unitSelectionText = [
                    "Specter-Class Operative: Efficient. Disposable.",
                    "Mnemonic Unit: Stores memory. Leaks paranoia.",
                    "Stratafield Walker: Exists in two timelines. Poor conversationalist."
                ];

                const combatText = [
                    "Your move is not just action—it is declaration.",
                    "You anticipated the ambush. Or did they want you to?",
                    "Enemy units adapting. Patterns shifting...",
                    "Plan three moves ahead. Trust none of them.",
                    "Mindfield active. Units suffer clarity loss."
                ];
                const endText = [
                    "Tactical dominance established.",
                    "You fell into the trap you built for them.",
                    "Checkmate. You win this round.",
                    "Error: ego overextension. Back to start."

                ]
                const gameText = [
                    unitSelectionText[k.randi(0, unitSelectionText.length)],
                    combatText[k.randi(0, combatText.length)],
                    endText[k.randi(0, endText.length)]
                ];

                k.go("timeTransition", {
                    player,
                    gameState,
                    event: {
                        text: [
                            "ECHO TACTICA INITIALIZING...",
                            "Simulation integrity: *uncertain*. Proceed with caution.",
                            "You select your units.",
                            ...gameText,
                            "You finish the game and feel like you have a sharper mind."
                        ],
                        exp: {
                            type: "mind",
                            amount: 5
                        }
                    },
                });
            },
            name: "Play",
            disabled: false,
            icon: true
        }
    } else {
        return {
            onClick: () => {
                store.set(gameMenuAtom, prev => ({
                    ...prev,
                    visible: false
                }));

                const combatText = [
                    "Weapon mod acquired: CHAIN-REVOLVER. Safety not included.",
                    "You dodged! …Pure luck. Don't get cocky.",
                    "WARNING: You're out of cover and out of excuses.",
                    "Critical hit! Nice. Bet you didn't plan that."
                ];
                const endText = [
                    "You survived the wave! Please report all physical injuries.",
                    "Congrats! You unlocked the Plasma Corkscrew. What does it do? Nobody knows.",
                    "You live another round. Your enemies are disappointed.",
                    "You died. It wasn't even close. Death Count: too many to be proud of.",
                    "You died. It wasn't even close. Tip: Consider aiming. Occasionally."

                ]
                const gameText = [
                    combatText[k.randi(0, combatText.length)],
                    endText[k.randi(0, endText.length)]
                ];

                k.go("timeTransition", {
                    player,
                    gameState,
                    event: {
                        text: [
                            "WELCOME TO AUTOHELL EXPANSE™. V1.6.6 - PATCH NOTES: NOTHING FIXED.",
                            "Loading chaos... Please remain seated.",
                            "Enemy wave detected: 73% rage, 34% gnashing teeth, 100% hungry.",
                            ...gameText,
                            "You finish the game and feel more confident in your combat skills."
                        ],
                        exp: {
                            type: "weapon",
                            amount: 5
                        }
                    },
                });
            },
            disabled: false,
            name: "Play",
            icon: true
        }
    }

}