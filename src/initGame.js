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
import boss1 from './scenes/1-boss';
import timeTransition from './scenes/timeTransition';
import holorange from './scenes/holorange';
import level2 from './scenes/level2';
import boss2 from './scenes/2-boss';
import level3 from './scenes/level3';
import makeGameState from './makeGameState';
import mainMenu from './scenes/mainMenu';
import boss3 from './scenes/3-boss';

export default function initGame() {
    // focus back on canvas when clicking on html elements
    window.addEventListener("click", () => document.getElementById('game').focus());

    const k = makeKaplayCtx();

    loadAssets(k);

    k.setBackground(k.Color.fromHex("#131313"));

    mainMenu(k);

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

    level3(k);

    boss3(k);

    const player = makePlayer(k, k.vec2(0));

    const gameState = makeGameState(k, { player });

    k.go("level1", { player, gameState });
}