export default function makeCoin(k, pos) {
    const coin = k.add([
        k.sprite("coin", { anim: "idle" }),
        k.anchor("center"),
        k.area({
            shape: new k.Rect(k.vec2(0), 10, 10)
        }),
        k.pos(pos),
        k.scale(4),
        k.opacity(1),
        "coin",
        "drop"
    ]);

    const amountArr = [50, 75, 100];

    coin.amount = amountArr[k.randi(0, amountArr.length)];

    return coin;
}