#ifndef BUFFERUTILS_HPP
#define BUFFERUTILS_HPP

#include "emscripten/bind.h"
#include "GLES2/gl2.h"
#include "buffers.h"

class BufferUtils
{
public:
    BufferUtils(){};
    ~BufferUtils(){};

    static Buffer createBuffer(int width, int height);
    static Buffer createTestBuffer(int width, int height, float R, float G, float B);
    static DoubleBuffer createDoubleBuffer(int width, int height);
    static DoubleBuffer swapBuffers(DoubleBuffer& buffers);
    static void clearBuffer(Buffer& buff);
};

EMSCRIPTEN_BINDINGS(BufferBindings) 
{   
    emscripten::class_<BufferUtils>("BufferUtils")
        .constructor<>()
        .class_function("createBuffer", &BufferUtils::createBuffer)
        .class_function("createTestBuffer", &BufferUtils::createTestBuffer)
        .class_function("createDoubleBuffer", &BufferUtils::createDoubleBuffer)
        .class_function("swapBuffers", &BufferUtils::swapBuffers)
        .class_function("clearBuffer", &BufferUtils::clearBuffer);
}


//////////////////////////////////////////////// SOURCE

Buffer BufferUtils::createBuffer(int width, int height)
{
    Buffer buff;

    // create frame buffer
    glGenFramebuffers(1, &buff.fboHandle);
    glBindFramebuffer(GL_FRAMEBUFFER, buff.fboHandle);

    // create the create the texture and allocate the memory
    glGenTextures(1, &buff.texHandle);
    glBindTexture(GL_TEXTURE_2D, buff.texHandle);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    // we use this large texture because webgl doesnt like using smaller ones
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_FLOAT, 0);

    // turn into frame buffer
    GLuint colorbuffer;
    glGenRenderbuffers(1, &colorbuffer);
    glBindRenderbuffer(GL_RENDERBUFFER, colorbuffer);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, buff.texHandle, 0);

    // clear the buffer
    glClearColor(0, 0, 0, 0);
    glClear(GL_COLOR_BUFFER_BIT);
    glBindFramebuffer(GL_FRAMEBUFFER, 0);

    return buff;    
}

Buffer BufferUtils::createTestBuffer(int width, int height, float R, float G, float B)
{
    Buffer buff;

    // create frame buffer
    glGenFramebuffers(1, &buff.fboHandle);
    glBindFramebuffer(GL_FRAMEBUFFER, buff.fboHandle);

    // create the create the texture and allocate the memory
    glGenTextures(1, &buff.texHandle);
    glBindTexture(GL_TEXTURE_2D, buff.texHandle);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    // we use this large texture because webgl doesnt like using smaller ones
    
    //create a image
    std::vector<float> testImage;
    for(int i = 0; i < height; i++)
    {
        for(int j = 0; j < width; j++)
        {   
                testImage.push_back(R); //R
                testImage.push_back(G); //G
                testImage.push_back(B); //B
                testImage.push_back(1.0f); //A
        }
    }

    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_FLOAT, testImage.data());

    // turn into frame buffer
    GLuint colorbuffer;
    glGenRenderbuffers(1, &colorbuffer);
    glBindRenderbuffer(GL_RENDERBUFFER, colorbuffer);
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, buff.texHandle, 0);

    // unbind buffer
    glBindFramebuffer(GL_FRAMEBUFFER, 0);

    return buff;    
}

DoubleBuffer BufferUtils::createDoubleBuffer(int width, int height)
{
    DoubleBuffer buff;

    buff.readBuffer = createBuffer(width, height);
    buff.writeBuffer = createBuffer(width, height);

    return buff;
}

DoubleBuffer BufferUtils::swapBuffers(DoubleBuffer& buffers)
{
    DoubleBuffer buff;

    // swap textures
    buff.writeBuffer.texHandle = buffers.readBuffer.texHandle;
    buff.readBuffer.texHandle = buffers.writeBuffer.texHandle;

    // swap fbos
    buff.writeBuffer.fboHandle = buffers.readBuffer.fboHandle;
    buff.readBuffer.fboHandle = buffers.writeBuffer.fboHandle;

    return buff;
}

void BufferUtils::clearBuffer(Buffer& buff)
{
    glBindFramebuffer(GL_FRAMEBUFFER, buff.fboHandle);

    // clear the buffer
    glClearColor(0, 0, 0, 0);
    glClear(GL_COLOR_BUFFER_BIT);

    // unbind
    glBindFramebuffer(GL_FRAMEBUFFER, 0);
}

#endif