#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // Box distance function
    vec2 size = vec2(0.3, 0.2);

    // makes a rectangle
    vec2 d = abs(uv) - size;
    float boxDist = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);

    float box = smoothstep(0.02, 0.0, boxDist);

    vec3 col = vec3(box);

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
