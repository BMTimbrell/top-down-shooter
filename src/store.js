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

export const gardenAtom = atom({
    visible: false,
    options: [],
    harvestReady: false,
    handleClose: null
});

export const gymAtom = atom({
    visible: false,
    options: [],
    handleClose: null
});

export const holorangeAtom = atom({
    visible: false,
    options: [],
    handleClose: null
});

export const engineeringAtom = atom({
    visible: false,
    screen: "main",
    options: [],
    guns: [],
    armour: [],
    handleClose: null,
    gunModal: false,
    showArmour: {
        "Predator Armour": true,
        "Titan Armour": false
    }
});

export const psiLabAtom = atom({
    visible: false,
    options: [],
    handleClose: null,
    skills: [
        { 
            name: "Psi Beam",
            description: "Fire a concentrated beam of psionic energy at the enemy.",
            level: 1 
        },
        { 
            name: "Force Field",
            description: "Generate a shield that protects you for a short time.",
            level: 2 
        },
        { 
            name: "Stronger Psi Beam",
            description: "Increase damage of Psi Beam.",
            level: 2 
        },
        { 
            name: "Freeze Time", 
            description: "Freeze time for everyone but yourself.",
            level: 3 
        }
    ]
});

export const geneLabAtom = atom({
    visible: false,
    options: [],
    handleClose: null,
    skills: [
        { 
            name: "Faster Movement",
            description: "Increase movement speed by 25%.",
            level: 1 
        },
        { 
            name: "Increased Slide Damage",
            description: "Sliding into enemies deals 100% more damage.",
            level: 2 
        },
        { 
            name: "Improved Sleep",
            description: "Wake up earlier, gaining an extra time slot.",
            level: 2 
        },
        { 
            name: "Improved Slide",
            description: "Sliding reflects projectiles.",
            level: 3 
        },
        { 
            name: "Rapid Recovery", 
            description: "33% chance to gain back health after clearing a room.",
            level: 3 
        }
    ]
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
        },
        abilities: []
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
    daysUntilMission: 0,
    gunIndex: 0,
    maxGuns: 3,
    reloading: false,
    rBarPos: {
        x: 0,
        y: 0
    }
});

export const store = createStore();