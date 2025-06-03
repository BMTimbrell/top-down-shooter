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

export const infoBoxAtom = atom({
    visible: false,
    text: ""
});

export const victoryScreenAtom = atom({
    visible: false,
    rewards: []
});

export const promptAtom = atom({
    visible: false,
    text: "",
    handleYes: null,
    handleNo: null
});

export const bookMenuAtom = atom({
    visible: false,
    books: [],
    handleClose: null
});

export const gameMenuAtom = atom({
    visible: false,
    games: [],
    handleClose: null
});


export const shopAtom = atom({
    visible: false,
    products: [],
    handleClose: null
});


export const menuAtom = atom({
    visible: false,
    buttons: []
});

export const playerInfoAtom = atom({
    visible: false,
    data: {
        guns: [],
        exp: {
            mind: { level: 1, exp: 0, maxExp: 50 },
            body: { level: 1, exp: 0, maxExp: 50 },
            weapon: { level: 1, exp: 0, maxExp: 50 }
        }
    }
});

export const gameInfoAtom = atom({
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
    gunIndex: 0,
    maxGuns: 3,
    reloading: false,
    rBarPos: {
        x: 0,
        y: 0
    }
});

export const store = createStore();