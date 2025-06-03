import { store, shopAtom, popupAtom, gameInfoAtom, bookMenuAtom, gameMenuAtom } from '../store';

function disableButtons(products) {
    products.books.forEach(book => {
        book.button.disabled = book.price > store.get(gameInfoAtom).gold;
    });

    products.electronics.forEach(e => {
        e.button.disabled = e.price > store.get(gameInfoAtom).gold;
    });
}

export default function shop(k) {
    k.scene("shop", async ({ player, gameState }) => {

        disableButtons({ books: gameState.shop.books, electronics: gameState.shop.electronics });

        gameState.shop.books.forEach(book => {
            if (player.discount) book.price *= 0.8;

            book.button.onClick = () => {
                if (book.price <= store.get(gameInfoAtom).gold) {
                    store.set(gameInfoAtom, prev => ({
                        ...prev,
                        gold: prev.gold - book.price
                    }));
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
                        name: "Read"
                    };
                    player.books.push(book);
                    gameState.shop.books = gameState.shop.books.filter(b => b !== book);

                    disableButtons({ books: gameState.shop.books, electronics: gameState.shop.electronics });

                    store.set(shopAtom, prev => ({
                        ...prev,
                        products: gameState.shop
                    }));
                }
            }
        });

        gameState.shop.electronics.forEach(e => {
            if (player.discount) e.price *= 0.8;

            e.button.onClick = () => {
                if (e.price <= store.get(gameInfoAtom).gold) {
                    store.set(gameInfoAtom, prev => ({
                        ...prev,
                        gold: prev.gold - e.price
                    }));

                    player.electronics.push(e);
                    if (e.name === "VR Headset") {
                        player.electronics.push({
                            name: "Bullet Hell Expanse",
                            description: "A chaotic, roguelike bullet hell where every enemy drops random weapon mods mid-combat.",
                            button: {
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
                                                "Enemy wave detected: 73% rage, 12% teeth, 100% hungry.",
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
                                name: "Play"
                            }
                        });

                    } else {
                        e.button = {
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
                            disabled: false
                        }
                    }

                    gameState.shop.electronics = gameState.shop.electronics.filter(el => el !== e);

                    disableButtons({ books: gameState.shop.books, electronics: gameState.shop.electronics });

                    store.set(shopAtom, prev => ({
                        ...prev,
                        products: gameState.shop
                    }));
                }
            }
        });

        store.set(popupAtom, prev => ({
            ...prev,
            visible: false
        }));

        store.set(shopAtom, prev => ({
            ...prev,
            visible: true,
            products: gameState.shop,
            handleExit: () => {
                store.set(shopAtom, prev => ({
                    ...prev,
                    visible: false
                }));
                k.go("main lobby", { gameState, player, prevRoom: "shop" });
            }
        }));


    });
}