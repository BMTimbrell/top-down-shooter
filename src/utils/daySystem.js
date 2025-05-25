import { store, gameInfoAtom } from '../store';

export function spendTime(gameState) {
    if (gameState.time < 3) gameState.time++;
    else {
        gameState.day++;
        gameState.time = 1;
    }

    store.set(gameInfoAtom, prev => ({
        ...prev,
        day: gameState.day,
        time: gameState.time
    }));
}