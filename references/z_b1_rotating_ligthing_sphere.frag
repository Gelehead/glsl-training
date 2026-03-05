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
    // sphere position
    vec3 spherePos = vec3(10.0 * cos(iTime), 0.0, 2.0 * sin(iTime));

    float sphere = sdSphere( p - spherePos, 1.0);
    return sphere;
}

// \param p is the incident 3d vector
vec3 getNormal(vec3 p)
{
    vec2 e = vec2(0.001, 0);

    return normalize(vec3(
        scene(p + e.xyy) - scene(p - e.xyy),
        scene(p + e.yxy) - scene(p - e.yxy),
        scene(p + e.yyx) - scene(p - e.yyx)
    ));
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

        if ( d < 0.000001) { return t; } // HIT, return distance travelled
        if ( t > 100.0) { break; } // too far, stop the march 
    }

    // if failed to find object 
    return -1.0;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;

    // camera position ( = ray origin )
    vec3 ro = vec3(0.0, 2.0 , -10);

    // ray direction through pixel 
    vec3 rd = normalize(vec3(uv, 1));

    // in the pixel, shoot the ray
    float t = raymarch(ro, rd);

    // background color
    vec3 col = vec3(0.5, 0.7, 10.0 - uv.y);

    if ( t > 0.0 )
    {
        // position of ray hit
        vec3 p =  ro + rd * t;

        // -- handle lighting --
        vec3 normal = getNormal(p);

        // lighting position
        vec3 lightPos = vec3(0,0,0);
        vec3 lightDir = normalize(lightPos - p);

        // angle difference 
        float diff = max(dot(normal, lightDir), 0.0); 

        // ambiant lighting 
        float ambient = 0.5;

        col = vec3(diff + ambient);
    }

    fragColor = vec4(col, 1.0);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}