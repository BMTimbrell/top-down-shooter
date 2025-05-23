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
            weaponLvl: { level: 1, exp: 0, maxExp: 50 }
        }
    }
});

export const gameInfoAtom = atom({
    day: 1,
    time: 1,
    health: 3,
    maxHealth: 3,
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