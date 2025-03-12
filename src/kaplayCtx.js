import kaplay from "kaplay";

export default function makeKaplayCtx() {
    return kaplay({
        global: false,
        pixelDensity: 2,
        debug: true, //TODO: set to false in production
        canvas: document.getElementById("game")
    });
}