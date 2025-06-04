export default function makeFloatingText(k, pos, text) {
    const fText = k.add([
        k.pos(pos.x, pos.y - 65),
        k.anchor("center"),
        k.text(text, {
            size: 16,
            font: "dogicabold"
        }),
        k.color(255, 255, 255),
        "text",
        k.z(9999999999),
        k.opacity(1)
    ]);

    fText.onUpdate(() => {
        fText.pos = fText.pos.sub(k.vec2(0, k.dt() * 10));
        fText.opacity -= k.dt() * 2;

        if (fText.opacity <= 0) {
            fText.destroy();
        }
    });

    return fText;
}