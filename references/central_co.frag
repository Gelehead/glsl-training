#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.xy;

    float dist = length(uv);

    vec3 col = vec3(dist + 0.1 * sin(4.0*iTime));


    fragColor = vec4(col, 1.0);
}

void main() 
{
    mainImage(fragColor, gl_FragCoord.xy);
}