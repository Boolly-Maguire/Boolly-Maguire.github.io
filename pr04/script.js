"use strict";

var points = [];

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    cube();

    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // set point data
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    // Turn on the attribute
    var positionLocation = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(positionLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);


    // set properties
    var coordinate = gl.getUniformLocation(program, "coordinate");
    var r = gl.getUniformLocation(program, "r");
    var bright = gl.getUniformLocation(program, "bright");
    var dark = gl.getUniformLocation(program, "dark");
    var sharp = gl.getUniformLocation(program, "sharp");
    var lightColor = gl.getUniformLocation(program, "color");

    // set the uniforms
    gl.uniform3fv(coordinate, [0.0, 0.0, 1.0]);   //default camera position
    gl.uniform1f(r, 0.05);             //default radius of sphere
    gl.uniform1f(bright, 0.8);             //default radius of sphere
    gl.uniform1f(dark, 0.2);             //default radius of sphere
    gl.uniform1f(sharp, 0.2);             //default radius of sphere
    gl.uniform3fv(lightColor, [1.0, 1.0, 1.0]);   //default light position


    // Draw the geometry.
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    // HTML listening
    var x_slider = document.querySelector('#x');
    var y_slider = document.querySelector('#y');
    var z_slider = document.querySelector('#z');
    var r_slider = document.querySelector('#r');
    var bright_slider = document.querySelector('#bright');
    var dark_slider = document.querySelector('#dark');
    var sharp_slider = document.querySelector('#sharp');
    var color_picker = document.querySelector('#color');

    x_slider.addEventListener("input", update);
    y_slider.addEventListener("input", update);
    z_slider.addEventListener("input", update);
    r_slider.addEventListener("input", update);
    bright_slider.addEventListener("input", update);
    dark_slider.addEventListener("input", update);
    sharp_slider.addEventListener("input", update);
    color_picker.addEventListener("input", update);

    function update() {
        gl.uniform3fv(coordinate, [x_slider.value, y_slider.value, z_slider.value]);
        gl.uniform1f(r, r_slider.value);
        gl.uniform1f(bright, bright_slider.value);
        gl.uniform1f(dark, dark_slider.value);
        gl.uniform1f(sharp, sharp_slider.value);

        var rgb = hexToRgb(color_picker.value)
        gl.uniform3fv(lightColor, [rgb.r / 255.0, rgb.g / 255.0, rgb.b / 255.0]);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


function quad(a, b, c, d) {

    var vertices = [
        [-1.0, -1.0, 1.0, 1.0],
        [-1.0, 1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 1.0],
        [1.0, -1.0, 1.0, 1.0],
        [-1.0, -1.0, -1.0, 1.0],
        [-1.0, 1.0, -1.0, 1.0],
        [1.0, 1.0, -1.0, 1.0],
        [1.0, -1.0, -1.0, 1.0]
    ];

    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        points.push(...vertices[indices[i]]);
    }
}

function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}


main();
