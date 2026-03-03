#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;

// SDF for circle 
float sdCircle(vec2 p, float r )
{
    return length(p) - r;
}

// SDF for box 
float sdBox(vec2 p, vec2 b)
{
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // circle 
    float circleDist = sdCircle(uv - vec2(-0.3, 0.0), 0.2);

    // box
    float boxDist = sdBox(uv - vec2(0.3, 0.0), vec2(0.15, 0.2));

    // operations on 2 SDFs
    // - min : union
    // - max : intersection
    // - max(s1, -s2) : substraction
    float shape = max(circleDist, -boxDist);

    vec3 col = vec3(shape);

    fragColor = vec4(col, 1.0);
}




void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}
