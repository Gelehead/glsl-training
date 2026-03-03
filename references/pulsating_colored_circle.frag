#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.xy;

    float dist = length(uv);
    float radius = 0.3 + 0.1 * sin(iTime);

    float circle = smoothstep(radius + 0.001 , radius, dist);


    // colors 
    vec3 bgColor = vec3(0.1, 0.0, 0.2);
    vec3 circleColor = vec3(1.0, 0.5, 0.0);

    vec3 col = mix(bgColor, circleColor, circle);

    fragColor = vec4(col, 1.0);
}

void main()
{
    mainImage(fragColor, gl_FragCoord.xy);
}