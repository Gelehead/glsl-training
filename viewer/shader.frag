#version 300 es
precision highp float;

out vec4 fragColor;
uniform vec2 iResolution;
uniform float iTime;

// 3d sdf for sphere
// \param p is the center of the sphere in 3d space , 
// \param r is the float radius of the sphere
float sdSphere(vec3 p, float r)
{
    return length(p) - r;
}

// Scene function
// returns shortest function to any object defined in the scene
// \param p : origin given by caller 
float scene(vec3 p) 
{
    float sphere = sdSphere(p, 1.0);
    return sphere;
}

// raymarch function
// \param ro ray origin 
// \param rd ray direction 
float raymarch(vec3 ro, vec3 rd)
{
    float t = 0.0; // total distance travelled 

    int MAX_STEPS = 80;
    for (int i = 0; i < MAX_STEPS; i++)
    {
        // current position along ray
        vec3 p = ro + rd * t;

        // distance to nearest object in the scene
        float d = scene(p);

        // march forward this distance
        t += d;

        if ( d < 0.001) { return t; } // HIT, return distance travelled
        if ( t > 100.0) { break; } // too far, stop the march 
    }

    // if failed to find object 
    return -1.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // camera position ( = ray origin )
    vec3 ro = vec3(0, 0, -3);

    // ray direction through pixel 
    vec3 rd = normalize(vec3(uv, 1));

    // in the pixel, shoot the ray
    float t = raymarch(ro, rd);

    // background color
    vec3 col = vec3(0.5, 0.7, 10.0 - uv.y);

    if ( t > 0.0 )
    {
        // whit if we hit something
        col = vec3(1.0);
    }

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}