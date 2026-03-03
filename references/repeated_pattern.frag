#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;

// 2D rotation matrix
vec2 rotate2D(vec2 p, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return vec2(
        p.x * c - p.y * s,
        p.x * s + p.y * c
    );
}

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdCircle(vec2 p, float r)
{
    return length(p) - r;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    // scale up coordinates 
    // the bigger the number, the more objects you ll have with fract
    uv *= 10.0;

    // create repeating cells using fract 
    vec2 cellUV = fract(uv) - 0.5;

    // draw circles 
    float circleDist = sdCircle(cellUV, 0.3) + 1.0 * 0.1 * sin(iTime);
    float circle = smoothstep(0.001, 0.0, circleDist);

    // boxes
    float boxDist = sdBox(uv - vec2(0.3, 0.0), vec2(0.15, 0.2));

    vec3 col = vec3(boxDist);
    
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}