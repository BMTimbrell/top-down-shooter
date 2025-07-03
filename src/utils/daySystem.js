import { store, gameInfoAtom } from '../store';

export function spendTime(gameState, player) {
    player.inDialogue = false;

    if (gameState.time < 3) gameState.time++;
    else {
        gameState.day++;
        store.set(gameInfoAtom, prev => ({
            ...prev,
            daysUntilMission: prev.daysUntilMission - 1
        }));
        gameState.time = player.passives["Improved Sleep"] ? 0 : 1;
    }

    store.set(gameInfoAtom, prev => ({
        ...prev,
        day: gameState.day,
        time: gameState.time
    }));
}