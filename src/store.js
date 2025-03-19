import { atom, createStore } from "jotai";

export const isPopupVisibleAtom = atom(false);
export const popupTextAtom = atom({ action: "", name: "", key: "e" });
export const dialogueAtom = atom({
    visible: false,
    text: [],
    index: 0,
    skip: false
});

export const store = createStore();