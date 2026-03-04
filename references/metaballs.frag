#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // moving points 
    vec2 p1 = vec2(0.3 * sin(iTime), 0.3 * cos(iTime * 0.7));
    vec2 p2 = vec2(0.3 * cos(iTime * 0.8), 0.3 * sin(iTime * 1.1));
    vec2 p3 = vec2(0.2 * sin(iTime * 1.3), 0.2 * cos(iTime * 0.9));

    // Metaballs : sum of 1/distance^2
    float strength = 0.0;
    strength += 0.02 / length(uv - p1);
    strength += 0.02 / length(uv - p2);
    strength += 0.015 / length(uv - p3);

    float shape = smoothstep(0.99, 1.0, strength);

    vec3 col = vec3(strength * 0.5, strength * 0.3, strength);
    col = mix(vec3(0.1), col, shape);

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}