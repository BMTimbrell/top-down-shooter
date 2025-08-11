import { DISCOUNT, ELECTRONICS } from '../constants';
import {
    store,
    shopAtom,
    popupAtom,
    gameInfoAtom
} from '../store';

import { makeBookReadButton, makeGamePlayButton } from '../utils/productOnClick';
import { BOOKS } from '../constants';
import { makeMap } from '../utils/map';

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

        makeMap(k, "shop", { gameState, spriteName: "shop", center: true });

        disableButtons({ books: gameState.shop.books, electronics: gameState.shop.electronics });

        if (player.discount) {
            gameState.shop.electronics.forEach(e => {
                e.price = ELECTRONICS.find(eRef => eRef.name === e.name).price * (player.discount ? DISCOUNT : 1);
            });
            gameState.shop.books.forEach(book => {
                book.price = BOOKS.find(b => b.title === book.title).price * (player.discount ? DISCOUNT : 1);
            });
        }

        gameState.shop.books.forEach(book => {
            book.button.onClick = () => {

                if (book.price <= store.get(gameInfoAtom).gold) {
                    store.set(gameInfoAtom, prev => ({
                        ...prev,
                        gold: prev.gold - book.price
                    }));

                    makeBookReadButton(k, { book, player, gameState });

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
                            button: makeGamePlayButton(k, { game: e, player, gameState })
                        });

                    } else {
                        makeGamePlayButton(k, { game: e, player, gameState });
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