export default function makeHeart(k, pos) {
    const heart = k.add([
        k.sprite("heart", { anim: "idle" }),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0), 10, 10)
        }),
        k.pos(pos),
        k.scale(4),
        k.opacity(1),
        "heart",
        "drop"
    ]);

    return heart;
}