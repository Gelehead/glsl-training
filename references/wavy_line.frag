#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // horizontal line 
    float lineY = 0.2 * sin(uv.x * 5.0 + 3.0*iTime);
    float dist = abs(uv.y - lineY);
    float thickness = 0.01;

    float line = smoothstep(thickness + 0.005, thickness, dist);

    vec3 col = vec3(line);

    fragColor = vec4(col, 1.0);
}




void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
