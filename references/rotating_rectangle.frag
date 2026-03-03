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

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    
    // Rotate the coordinate space
    vec2 uv1 = rotate2D(uv - vec2(-0.3, 0.0), iTime);
    vec2 uv2 = uv - vec2(0.3, 0.0);
    
    // Now draw a box in the rotated space
    float box1 = smoothstep(0.01, 0.0, sdBox(uv2, vec2(0.2, 0.15)));
    float box2 = smoothstep(0.01, 0.0, sdBox(uv1, vec2(0.2, 0.15)));
    
    vec3 col = vec3(max(box1, box2));
    
    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}