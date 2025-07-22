import { store, gameInfoAtom, shopAtom, engineeringAtom, psiLabAtom, geneLabAtom, gardenAtom } from '../store';

export function spendTime(gameState, player) {
    player.inDialogue = false;

    if (gameState.time < 3) {
        gameState.time++;
        store.set(gameInfoAtom, prev => ({
            ...prev,
            time: gameState.time
        }));
    } else {
        gameState.day++;
        gameState.time = player.passives["Improved Sleep"] ? 0 : 1;
        store.set(gameInfoAtom, prev => ({
            ...prev,
            daysUntilMission: prev.daysUntilMission - 1,
            day: gameState.day,
            time: gameState.time
        }));

        localStorage.setItem("saveData", JSON.stringify({
            player: {
                health: player.hp(),
                maxHealth: player.maxHP(),
                speed: player.speed,
                reloadCd: player.reloadCd,
                dashDamage: player.dashDamage,
                guns: player.guns,
                maxGuns: player.maxGuns,
                mind: player.mind,
                body: player.body,
                weapon: player.weapon,
                books: player.books,
                electronics: player.electronics,
                passives: player.passives,
                abilities: player.abilities,
                improvedWorkouts: player.improvedWorkouts,
                discount: player.discount
            },
            gameState: {
                shop: gameState.shop,
                robot: gameState.robot,
                day: gameState.day,
                time: gameState.time,
                events: gameState.events
            },
            gameInfo: store.get(gameInfoAtom),
            shop: store.get(shopAtom),
            engineering: store.get(engineeringAtom),
            psiLab: store.get(psiLabAtom),
            geneLab: store.get(geneLabAtom),
            garden: store.get(gardenAtom)
        }));
    }

}