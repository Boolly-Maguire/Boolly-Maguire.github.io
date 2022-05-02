/****************** For SliderBar Parameter ******************/

var coordZ;
var coordY;
var coordX;

var lightX;
var lightY;
var lightZ;

var mouseFlag = 0;// 0 : moving ; 1: stop
var currentLight = 0;
var lightNum = 1;

var lightColor = [];
lightColor[0] = [1.0, 1.0, 1.0];

var styleBright,
    styleDark;

var specSharpness, specBlurriness;

var checkAreaLight;

var lightIntensity;


function initParameters() {
    lightColor[0] = [1.0, 1.0, 1.0];
    lightNum = 1;
    //style section parameters
    styleBright = 0.5;
    styleDark = 1.0;

    coordZ = 1.0;
    coordY = 0.0;
    coordX = 0.0;

    lightX = 1.0;
    lightY = 1.0;
    lightZ = 1.0;

    specSharpness = 1.0;
    specBlurriness = 0.6;

    checkAreaLight = 0;

    lightIntensity = 0.5;
}


//Locs

var currentLightLoc;
var lightNumLoc;

var lightColorLoc;

var styleBrightLoc, styleDarkLoc;
var specSharpnessLoc, specBlurrinessLoc;

var coordZLoc;
var coordYLoc;
var coordXLoc;

var lightXLoc;
var lightYLoc;
var lightZLoc;

var checkAreaLightLoc;

var lightIntensityLoc;

/****************** For Basic shader ******************/

var gl;
var points = [];
var colors = [];
var normals = [];
var texCoords = [];

var numVertices = 36;

var darkTexture, darkImage;

var defaultTexture, defaultImage;


window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }


    var context = canvas.getContext('2d');


    /***************/


    colorCube();

    /////////////////  Configure WebGL  ////////////////////////

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.05, 0.05, 0.05, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //////////////////  Load shaders and initialize attribute buffers  /////////////////

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    /* Vertex colors
    // Load the data into the GPU   
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    */


    // Vertex positions
    // Load the data into the GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW)

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    // Vertex texture coordinates
    // Load the data into the GPU
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vTex = gl.getAttribLocation(program, "texcoord");
    gl.vertexAttribPointer(vTex, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTex);


    initTextures();

    darkImage.src = image1.src;
    requestCORSIfNotSameOrigin(darkImage, darkImage.src);

    defaultImage.src = image2.src;
    requestCORSIfNotSameOrigin(defaultImage, defaultImage.src);

    darkImage.onload = function () {
        handleTextureLoaded(darkImage, darkTexture);
    }

    defaultImage.onload = function () {
        handleTextureLoaded(defaultImage, defaultTexture);
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, darkTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerTexture"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, defaultTexture);
    gl.uniform1i(gl.getUniformLocation(program, "defaultTexture"), 1);

    coordZLoc = gl.getUniformLocation(program, "coordZ");
    coordYLoc = gl.getUniformLocation(program, "coordY");
    coordXLoc = gl.getUniformLocation(program, "coordX");

    lightXLoc = gl.getUniformLocation(program,"lightX");
    lightYLoc = gl.getUniformLocation(program,"lightY");
    lightZLoc = gl.getUniformLocation(program,"lightZ");

    specSharpnessLoc = gl.getUniformLocation(program, "specSharpness");
    specBlurrinessLoc = gl.getUniformLocation(program, "specBlurriness");

    currentLightLoc = gl.getUniformLocation(program, "currentLight");
    lightNumLoc = gl.getUniformLocation(program, "lightNum");

    lightColorLoc = gl.getUniformLocation(program, "lightColor");
    lightIntensityLoc = gl.getUniformLocation(program, "lightIntensity")

    styleBrightLoc = gl.getUniformLocation(program, "styleBright");
    styleDarkLoc = gl.getUniformLocation(program, "styleDark");

    checkAreaLightLoc = gl.getUniformLocation(program, "checkAreaLight");

    render();
};

function initTextures() {
    darkTexture = gl.createTexture();
    defaultTexture = gl.createTexture();
    darkImage = new Image();
    defaultImage = new Image();
}

function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var checkAreaLightElem = $('#checkAreaLightSelect:checked');
    checkAreaLight = (checkAreaLightElem.val()) ? 1 : 0;

    gl.uniform1f(coordZLoc, coordZ);
    gl.uniform1f(coordYLoc, coordY);
    gl.uniform1f(coordXLoc, coordX);
    //light positions
    gl.uniform1f(lightXLoc, lightX);
    gl.uniform1f(lightYLoc, lightY);
    gl.uniform1f(lightZLoc, lightZ);

    gl.uniform1f(specSharpnessLoc, specSharpness);
    gl.uniform1f(specBlurrinessLoc, specBlurriness);

    gl.uniform1i(currentLightLoc, currentLight);
    gl.uniform1f(lightNumLoc, lightNum);

    gl.uniform3fv(lightColorLoc, flatten(lightColor));
    gl.uniform1f(lightIntensityLoc, lightIntensity)

    gl.uniform1f(styleBrightLoc, styleBright);
    gl.uniform1f(styleDarkLoc, styleDark);

    gl.uniform1i(checkAreaLightLoc, checkAreaLight);

    gl.drawArrays(gl.TRIANGLES, 0, numVertices);


    requestAnimFrame(render);
}


function quad(a, b, c, d) {

    var vertices = [
        vec4(-1.0, -1.0, 1.0, 1.0),
        vec4(-1.0, 1.0, 1.0, 1.0),
        vec4(1.0, 1.0, 1.0, 1.0),
        vec4(1.0, -1.0, 1.0, 1.0),
        vec4(-1.0, -1.0, -1.0, 1.0),
        vec4(-1.0, 1.0, -1.0, 1.0),
        vec4(1.0, 1.0, -1.0, 1.0),
        vec4(1.0, -1.0, -1.0, 1.0)
    ];

    var vertexColors = [
        [0.0, 0.0, 0.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.5, 0.5, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 1.0]
    ];

    var faceNormal = cross(subtract(vertices[a], vertices[b]), subtract(vertices[c], vertices[b]));

    var vertexTexCoords = [
        vec2(0.0, 0.0),
        vec2(1.0, 0.0),
        vec2(1.0, 1.0),
        vec2(0.0, 1.0)
    ];

    texCoords.push(vertexTexCoords[0]);
    texCoords.push(vertexTexCoords[3]);
    texCoords.push(vertexTexCoords[2]);
    texCoords.push(vertexTexCoords[0]);
    texCoords.push(vertexTexCoords[2]);
    texCoords.push(vertexTexCoords[1]);

    var indices = [a, b, c, a, c, d];
    for (var i = 0; i < indices.length; ++i) {
        points.push(vertices[indices[i]]);

        // for solid colored faces use
        colors.push(vertexColors[a]);

        normals.push(faceNormal);
    }
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function requestCORSIfNotSameOrigin(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
        img.crossOrigin = "";
    }
}
