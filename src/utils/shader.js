export function useFlash(k, entity) {
    let flashAmount = 0;

    k.loadShader(
        "flash",
        null,
         `
            uniform float u_flash;
            vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
                vec4 texColor = texture2D(tex, uv);
                // blend the texture with white based on flash
                return mix(texColor, vec4(1.0, 1.0, 1.0, texColor.a), u_flash);
            }
        `,

    );

    entity.use(k.shader("flash", () => ({
        u_flash: flashAmount
    })));


    entity.flash = (duration = 0.1) => {
        flashAmount = 1;
        k.tween(flashAmount, 0, duration, (val) => {
            flashAmount = val;
        }, k.easings.easeOutQuad);
    };
}