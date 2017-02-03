#version 300 es
in mediump vec2 tex;

out highp vec4 FragColor;    

uniform sampler2D Velocity;                          

uniform mediump vec2 Point;                           
uniform mediump float Radius;                         
uniform mediump vec3 FillColor;                       

void main()                                           
{   
    float d = distance(Point, tex);
    
    if (d < Radius) 
    {
        FragColor = vec4(FillColor, 1.0);
        return;
    } 

    FragColor = texture(Velocity, tex);                                                                    
}                                                     