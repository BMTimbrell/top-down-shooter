import { atom, createStore } from "jotai";

export const popupAtom = atom({
    visible: false,
    text: {
        action: "",
        name: "",
        key: "E"
    },
    pos: {
        x: 0,
        y: 0
    }
});

export const dialogueAtom = atom({
    visible: false,
    text: [],
    index: 0,
    skip: false
});

export const menuAtom = atom({
    visible: false,
    buttons: [],
    
});

export const playerInfoAtom = atom({
    visible: false,
    data: {
        guns: [],
        exp: {
            mind: { level: 1, exp: 0, maxExp: 50 },
            body: { level: 1, exp: 0, maxExp: 50 },
            weaponLvl: { level: 1, exp: 0, maxExp: 50 }
        }
    }
});

export const gameInfoAtom = atom({
    day: 1,
    time: 1,
    hp: {
        health: 3,
        maxHealth: 3
    },
    gold: 0,
    playerInfo: {
        gun: undefined,
        dashCd: 1
    }
});

export const store = createStore();