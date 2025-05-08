export function useFlash(k, entity) {
    let flashAmount = 0;

    k.loadShader(
        "flash",
        null,
        `
            uniform float u_flash;
            uniform float u_opacity;
    
            vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
                vec4 texColor = texture2D(tex, uv);
                // blend texture with white based on flash, then apply opacity
                vec4 blended = mix(texColor, vec4(1.0, 1.0, 1.0, texColor.a), u_flash);
                blended.a *= u_opacity;
                return blended;
            }
        `
    );

    entity.use(k.shader("flash", () => ({
        u_flash: flashAmount,
        u_opacity: entity.opacity
    })));


    entity.flash = (duration = 0.1) => {
        flashAmount = 1;
        k.tween(flashAmount, 0, duration, (val) => {
            flashAmount = val;
        }, k.easings.easeOutQuad);
    };
}