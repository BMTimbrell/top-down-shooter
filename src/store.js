import { atom, createStore } from "jotai";

export const isPopupVisibleAtom = atom(false);
export const popupTextAtom = atom({ action: "", name: "", key: "e" });
export const isDialogueVisibleAtom = atom(false);
export const dialogueTextAtom = atom("");

export const store = createStore();