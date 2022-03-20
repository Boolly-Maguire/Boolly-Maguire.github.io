"use strict";

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");

    // lookup uniforms
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var pe = gl.getUniformLocation(program, "pe");
    var r = gl.getUniformLocation(program, "r");
    var bright = gl.getUniformLocation(program, "bright");
    var dark = gl.getUniformLocation(program, "dark");
    var sharp = gl.getUniformLocation(program, "sharp");
    var lightColor = gl.getUniformLocation(program, "color");


    // Create a buffer to put positions in
    var positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Put geometry data into buffer
    setGeometry(gl);

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // set the uniforms
    var color = [0, 0, 0, 1];
    gl.uniform4fv(colorLocation, color);
    gl.uniform3fv(pe, [0.0, 0.0, 1.0]);   //default camera position
    gl.uniform1f(r, 0.2);             //default radius of sphere
    gl.uniform1f(bright, 0.8);             //default radius of sphere
    gl.uniform1f(dark, 0.2);             //default radius of sphere
    gl.uniform1f(sharp, 0.2);             //default radius of sphere
    gl.uniform3fv(lightColor, [1.0, 1.0, 1.0]);   //default camera position


    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);

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
        gl.uniform3fv(pe, [x_slider.value, y_slider.value, z_slider.value]);
        gl.uniform1f(r, r_slider.value);
        gl.uniform1f(bright, bright_slider.value);
        gl.uniform1f(dark, dark_slider.value);
        gl.uniform1f(sharp, sharp_slider.value);

        var rgb = hexToRgb(color_picker.value)
        gl.uniform3fv(lightColor, [rgb.r / 255.0, rgb.g / 255.0, rgb.b / 255.0]);

        gl.drawArrays(primitiveType, offset, count);
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


// Fill the canvas with black.
function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            // left column front
            1, -1, 0,
            -1, 1, 0,
            1, 1, 0,
            -1, -1, 0,
            -1, 1, 0,
            1, -1, 0]),
        gl.STATIC_DRAW);
}

main();
