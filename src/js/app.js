/* eslint no-console:0 consistent-return:0 */
'use strict';

// Create a shader
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// Combine vertex shader and fragment shader
// to form a program
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function createRectangle(x, y, length, breadth) {
    let positions = [
        x,
        y, // bl
        x + length,
        y, // br
        x,
        y + breadth, // tl

        x,
        x + breadth, // tl
        x + length,
        y + breadth, // tr
        x + length,
        y, // br
    ];
    return positions;
}

function setGeometry(gl, geometry) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry), gl.STATIC_DRAW);
}

// Sets the buffer data
function setBuffer(gl, geometry) {
    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    setGeometry(gl, geometry);
}

function setUniform(gl, program, uniform, data) {
    let resolutionUniformLocation = gl.getUniformLocation(program, uniform);
    gl.uniform2f(resolutionUniformLocation, ...data);
}

function setAttribute(gl, program, attribute, options) {
    let attribLocation = gl.getAttribLocation(program, attribute);
    gl.enableVertexAttribArray(attribLocation);
    const {
        size,
        type,
        normalize,
        offset,
        stride
    } = options;
    gl.vertexAttribPointer(attribLocation, size, type, normalize, stride, offset);
}

function drawScene(gl) {
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 6;
    gl.drawArrays(primitiveType, 0, count);
}

function setViewport(gl) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}


function main() {
    // Get A WebGL context
    var canvas = document.querySelector('#canvas');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        return;
    }

    // Get the strings for our GLSL shaders
    // var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    // var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
    let vertexShaderSource = `
        attribute vec2 a_position;
        uniform   vec2 u_resolution;
        varying   vec4 v_color;

        void main() {
            vec2 zeroToOne = a_position / u_resolution;
            vec2 clipSpace = zeroToOne*2.0 - 1.0;
            gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            v_color = gl_Position * 0.5 + 0.5;
        }
    `;

    let fragmentShaderSource = `
        precision mediump float;
        uniform vec4 u_color;
        varying vec4 v_color;
        void main() {
            gl_FragColor = v_color;
        }
    `;

    /**
     * VertexShader + UniformShader = Program
     * Attributes - Set from buffers
     * Uniforms - Constant accross vertices
     * Varying - pass data from vertex shader to fragment shader
     */
    // Create shaders and program and set buffer
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    // var colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    // gl.uniform4f(colorUniformLocation, 245 / 255, 176 / 255, 65 / 255, 1);
    setBuffer(gl, createRectangle(50, 50, 200, 200));
    setViewport(gl)
    setAttribute(gl, program, 'a_position', {
        size: 2,
        type: gl.FLOAT,
        normalize: false,
        stride: 0,
        offset: 0
    });
    setUniform(gl, program, 'u_resolution', [gl.canvas.width, gl.canvas.height]);
    drawScene(gl);
}

main();
