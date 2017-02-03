#version 300 es
in mediump vec2 tex;

out mediump vec4 FragColor;                                         

uniform sampler2D Pressure;                                                
uniform sampler2D Divergence;                                                                                           

uniform mediump vec2 inverseRes;
uniform mediump float Alpha;                                               

float samplePressure(sampler2D pressure, vec2 coord)
{
    vec2 cellOffset = vec2(0.0, 0.0);

    // more bound checking
    if(coord.x < 0.0)
    {      
        cellOffset.x = 1.0;
    }
    else if(coord.x > 1.0) 
    {
        cellOffset.x = -1.0;
    }

    if(coord.y < 0.0)
    {
        cellOffset.y = 1.0;
    }
    else if(coord.y > 1.0) 
    {
        cellOffset.y = -1.0;
    }

    return texture(pressure, coord + cellOffset * inverseRes).x;
}                                       

void main()                                                                
{                                                                          
    float L = samplePressure(Pressure, tex - vec2(inverseRes.x, 0));
    float R = samplePressure(Pressure, tex + vec2(inverseRes.x, 0));
    float B = samplePressure(Pressure, tex - vec2(0, inverseRes.y));
    float T = samplePressure(Pressure, tex + vec2(0, inverseRes.y));

    float bC = texture(Divergence, tex).x;

    // use 0.25 as rBeta
    FragColor = vec4( (L + R + B + T + Alpha * bC) * 0.25, 0.0f, 0.0f, 1.0f );            
}  