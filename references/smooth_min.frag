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

float smin(float a, float b, float k)
{
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    vec2 pos1 = vec2(0.3 * sin(iTime), 0.0);
    vec2 pos2 = vec2(-0.3 * sin(iTime), 0.0);
    vec2 pos3 = vec2(0.0, 0.3);

    float circle1 = sdCircle(uv - pos1, 0.2);
    float circle2 = sdCircle(uv - pos2, 0.2);
    float circle3 = sdCircle(uv - pos3, 0.15);
    
    float dist = smin(smin(circle1, circle2, 0.1), circle3, 0.3);

    float shape = smoothstep(0.001, 0.0, dist);

    vec3 col = vec3(shape);

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}