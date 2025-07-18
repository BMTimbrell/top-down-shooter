import makeKaplayCtx from './kaplayCtx';
import makePlayer from './entities/player';
import loadAssets from './loadAssets';
import room from './scenes/room';
import mainLobby from './scenes/mainLobby';
import level1 from './scenes/level1';
import exposition from './scenes/exposition';
import shop from './scenes/shop';
import garden from './scenes/garden';
import gym from './scenes/Gym';
import engineering from './scenes/engineering';
import psiLab from './scenes/psiLab';
import geneLab from './scenes/geneLab';
import {
    menuAtom,
    playerInfoAtom,
    infoBoxAtom,
    victoryScreenAtom,
    store
} from "./store";
import boss1 from './scenes/1-boss';
import timeTransition from './scenes/timeTransition';
import holorange from './scenes/holorange';
import level2 from './scenes/level2';
import boss2 from './scenes/2-boss';

export default function initGame() {
    // focus back on canvas when clicking on html elements
    window.addEventListener("click", () => document.getElementById('game').focus());

    const k = makeKaplayCtx();

    loadAssets(k);

    k.setBackground(k.Color.fromHex("#131313"));

    room(k);

    mainLobby(k);

    level1(k);

    boss1(k);

    exposition(k);

    timeTransition(k);

    shop(k);

    garden(k);

    gym(k);

    holorange(k);

    engineering(k);

    psiLab(k);

    geneLab(k);

    level2(k);

    boss2(k);

    const player = makePlayer(k, k.vec2(0));

    const gameState = k.make([
        "gameState",
        {
            day: 1,
            time: 1,
            events: {
                skillExplanations: {
                    overview: true,
                    "pullup bar": true,
                    bed: true,
                    desk: true
                }


            },
            reinforcements: [],
            pendingSpawns: [],
            debugTimer: 3,
            shop: {
                books: [
                    {
                        title: "Tactical Precision: A Shooter's Manual", 
                        description: "Learn to breathe, aim, and fire like a pro.", 
                        text: [
                            [
                                "A rookie sees the target. A marksman sees the field.",
                                "The first rule of tactical shooting is awareness. Every element in the field can help or hinder your shot."
                            ], 
                            [
                                "When aiming exhale slowly. A calm breath steadies the hand.",
                                "Trigger discipline is not about reaction speed. It's about control.",
                                "You finish reading the book, and feel more confident in your combat abilities."
                            ]
                        ],
                        exp: {
                            weapon: 20
                        }, progress: {
                            current: 0, max: 2
                        },
                        price: 100,
                        button: { 
                            onClick: null, 
                            disabled: false,
                            name: "Buy" 
                        }
                    },
                    {
                        title: "Epistemology", 
                        description: "A book about how we know.", 
                        text: [
                            [
                                "All knowledge starts with sense perception.", 
                                "The senses can't make errors as they make no judgement and are just cause and effect."
                            ],
                            [
                                "We use our minds to integrate data from the senses and form concepts.",
                                "Errors can be made on the conceptual level, so make sure you have no logical fallacies.",
                                "You finished the book and gained clarity."
                            ]
                        ],
                        exp: {
                            mind: 20
                        }, progress: {
                            current: 0, max: 2
                        },
                        price: 120,
                        button: { 
                            onClick: null, 
                            disabled: false,
                            name: "Buy" 
                        }
                    },
                    {
                        title: "SWEAT", 
                        description: "A book with special workouts, exercises and advanced techniques.", 
                        text: [
                            [
                                "As you read, you see examples of different exercises and workout plans."
                            ],
                            [
                                "You read about different lifting techniques and the value of getting tension on the muscle when it's lengthened.",
                                "You now feel like you might be able to get more out of your workouts."
                            ]
                        ],
                        exp: null,
                        action() {
                            player.improvedWorkouts = true;
                        },
                        progress: {
                            current: 0, max: 2
                        },
                        price: 100,
                        button: { 
                            onClick: null, 
                            disabled: false,
                            name: "Buy" 
                        }
                    },
                    {
                        title: "Cognitive Warefare and You", 
                        description: "A guide to defending your thoughts and outmaneuvering manipulative foes.", 
                        text: [
                            [
                                "The most effective weapon is the one that convinces you it isn’t a weapon at all",
                                "Cognitive threats creep in as subtle suggestions, reframed truths, or emotional triggers designed to bypass logic."
                            ],
                            [
                                "Remember, the mind's greatest defense is intentional thought.",
                                "A sharpened mind is a secure one. Train it like you would train a weapon.",
                                "You finish the book and gain clarity."
                            ]
                        ],
                        exp: {
                            mind: 20
                        },
                        progress: {
                            current: 0, max: 2
                        },
                        price: 120,
                        button: { 
                            onClick: null, 
                            disabled: false,
                            name: "Buy" 
                        }
                    },
                    {
                        title: "Smiles, Lies, and Subtle Eyes", 
                        description: "The Psychology of Persuasion", 
                        text: [
                            [
                                'Your body speaks long before your voice enters the conversation.',
                                 'A confident stance—shoulders relaxed, spine aligned, gaze steady—tells the room, "I am here, and I belong"',
                            ],
                            [
                                "Adjust your expression, your breath, your pace. Let people feel seen without a word.",
                                "Never forget: charisma isn't about overpowering the room—it's about anchoring it.",
                                "You finish the book and feel like you could use these techniques at shops."
                            ]
                        ],
                        exp: null,
                        action() {
                            player.discount = true;
                        },
                        progress: {
                            current: 0, max: 2
                        },
                        price: 150,
                        button: { 
                            onClick: null, 
                            disabled: false,
                            name: "Buy" 
                        }
                    },
                ],
                electronics: [
                    {
                        name: "VR Headset",
                        description: "Comes with a free game.",
                        price: 1000,
                        button: { 
                            onClick: null, 
                            disabled: false,
                            name: "Buy" 
                        }
                    },
                    {
                        name: "Echo Tactica",
                        description: "A turn-based tactics game where you command a clone squad.",
                        exp: { mind: 5 },
                        price: 100,
                        button: { 
                            onClick: null, 
                            disabled: false,
                            name: "Buy" 
                        }
                    }
                ]
            },
            robot: {
                broken: true,
                fixProgress: 0
            }
        }
    ]);

    gameState.onUpdate(() => {
        const paused = store.get(menuAtom).visible ||
            store.get(infoBoxAtom).visible ||
            store.get(victoryScreenAtom).visible;
        // gameState.debugTimer -= k.dt();
        // if (gameState.debugTimer <= 0) {
        //     gameState.debugTimer = 3;
        //     console.log(k.get("*").length);
        // }
        if (k.isKeyPressed("escape")) {
            // set data to show in menu
            if (!paused) {
                store.set(
                    menuAtom,
                    prev => ({
                        ...prev,
                        buttons: [
                            {
                                name: "Resume",
                                onClick: () => {
                                    store.set(menuAtom, prev => ({ ...prev, visible: false }));
                                    k.query({
                                        include: "*",
                                        exclude: "gameState"
                                    }).forEach(e => e.paused = false);
                                }
                            },
                            {
                                name: "Player Info",
                                onClick: () => store.set(playerInfoAtom, prev => ({
                                    visible: true,
                                    data: {
                                        guns: player.guns,
                                        exp: {
                                            mind: player.mind,
                                            body: player.body,
                                            weapon: player.weapon
                                        },
                                        abilities: prev.data.abilities
                                    }
                                }))
                            },
                            { name: "Exit to Main Menu" }
                        ]
                    })
                );
            } else {
                // reset menu after closing
                store.set(playerInfoAtom, prev => ({
                    ...prev,
                    visible: false
                }));
            }

            // toggle menu visibility
            store.set(menuAtom, prev => ({ ...prev, visible: !store.get(menuAtom).visible && !paused }));
        }

        k.get(['pausable']).forEach(e => {
            e.paused = paused;
        });
    });

    k.go("level1", { player, gameState });
}