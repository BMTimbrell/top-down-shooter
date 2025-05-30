import { store, shopAtom, popupAtom, gameInfoAtom, bookMenuAtom } from '../store';

export default function shop(k) {
    k.scene("shop", async ({ player, gameState }) => {
        gameState.shop.books.forEach(book => {
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
                    gameState.shop.books.forEach(
                        book => book.button.disabled = book.price > store.get(gameInfoAtom).gold
                    );
                    store.set(shopAtom, prev => ({
                        ...prev,
                        products: gameState.shop
                    }));
                }
            }
            book.button.disabled = book.price > store.get(gameInfoAtom).gold;
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