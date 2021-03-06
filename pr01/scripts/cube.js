/****************** For SliderBar Parameter ******************/
var mouseFlag = 0;// 0 : moving ; 1: stop
var currentLight = 0;
var lightNum = 1;

var mouseXY = [];
mouseXY[0] = [0.3, -0.3];     //default light

var lightsPosition = 0;
var lightsOnly = 0;

var lightColor = [];
lightColor[0] = [1.0, 1.0, 1.0];

var lightIntensity = [];
lightIntensity[0] = 1.0;

var pointLightDis = [];
pointLightDis[0] = 0.5;

var pointLightDecay = [];
pointLightDecay[0] = 0.1;

var pointLightSpec = 1.0;
// pointLightSpec[0] = 1.0;

var showDiffuse = [];
showDiffuse[0] = 1;

var showSpec = [];
showSpec[0] = 1;


var styleBright,
    styleDark;

var reflectNoise;

var alphaR;
var alphaG;
var alphaB;

var logIOR5;//[-1, 1]
var BGdis;

var FGdis;

var reflMap;//1: plane; 2:hemisphere

var FGshiftX0;
var FGshiftY;
var FGscaleX;
var FGscaleY;

var fresnelIntensity;
var fresnelB; //cos = 0.95
var fresnelC; //cos = 0.7
var checkFresnel;
var checkFake;
var checkRs;

function initParameters() {
    lightColor[0] = [1.0, 1.0, 1.0];
    //baseColor = [0.0, 0.1, 0.0];
    lightIntensity[0] = 1.0;
    pointLightDis[0] = 0.5;
    pointLightDecay[0] = 0.0;
    pointLightSpec = 1.0;

    showDiffuse[0] = 1;
    showSpec[0] = 1;

    //style section parameters
    styleBright = 0;
    styleDark = 1;

    reflectNoise = 0;

    //highlight parameters
    //highlightA = 0.5;
    //highlightB = 0.25;

    //Diffuse Alpha parameters
    alphaR = 0.5;
    alphaG = 0.5;
    alphaB = 0.5;

    //refraction parameters
    logIOR = 0.25;//[-1, 1]
    BGdis = 0.6;

    //reflection parameters
    FGdis = 0.2;
    reflMap = 1;//1: plane; 2:hemisphere
    FGshiftX = 0;
    FGshiftY = 0;
    FGscaleX = 0.5;
    FGscaleY = 0.5;

    //Fresnel parameters
    fresnelIntensity = 0.0;
    fresnelB = 0.3; //cos = 0.95
    fresnelC = 0.6; //cos = 0.7
    checkFresnel = 0;
    checkFake = 0;
    checkRs = 0;
    // Height Light parameters
    //hLightDistance = 1.0;
    //hLightIntensity = 1.0;
    //hLightBack = 0.05;
    //useEnvMap = 0;
}


//Locs

var currentLightLoc;
var lightNumLoc;
var mouseLoc;

var lightsOnlyLoc;
var lightColorLoc;
var lightIntensityLoc;
var pointLightDisLoc;
var pointLightDecayLoc;
var pointLightSpecLoc;

var showDiffuseLoc;
var showSpecLoc;

var styleBrightLoc, styleDarkLoc;
var reflectNoiseLoc;


var alphaRLoc, alphaGLoc, alphaBLoc;
var logIORLoc, BGdisLoc;
var FGdisLoc;
var reflMapLoc;
var FGshiftXLoc, FGshiftYLoc, FGscaleXLoc, FGscaleXLoc;

var fresnelIntensityLoc;
var fresnelBLoc, fresnelCLoc;
var checkFresnelLoc;
var checkFakeLoc;
var checkRsLoc;


/****************** For Basic shader ******************/

var gl;
var points = [];
var colors = [];
var normals = [];
var texCoords = [];

var numVertices = 36;

var color0Loc;
var color1Loc;

var darkTexture, darkImage;
var lightTexture, lightImage;
var normalTexture, normalImage;
var reflectTexture, reflectImage;
var refractTexture, refractImage;
var alphaTexture, alphaImage;

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


    // Vertex normals
    // Load the data into the GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);


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

    normalImage.src = image3.src;
    requestCORSIfNotSameOrigin(normalImage, normalImage.src);
    console.log(normalImage.src);


    lightImage.src = image2.src;
    requestCORSIfNotSameOrigin(lightImage, lightImage.src);
    console.log(lightImage.src);


    darkImage.src = image1.src;
    requestCORSIfNotSameOrigin(darkImage, darkImage.src);
    console.log(this.darkImage.src);


    refractImage.src = image5.src;
    requestCORSIfNotSameOrigin(refractImage, refractImage.src);
    console.log(this.refractImage.src);


    reflectImage.src = image4.src;
    requestCORSIfNotSameOrigin(reflectImage, reflectImage.src);
    console.log(this.refractImage.src);


    alphaImage.src = image6.src;
    requestCORSIfNotSameOrigin(alphaImage, alphaImage.src);
    console.log(this.alphaImage.src);

    normalImage.onload = function () {
        handleTextureLoaded(normalImage, normalTexture);
    }

    lightImage.onload = function () {
        handleTextureLoaded(lightImage, lightTexture);
    }

    darkImage.onload = function () {
        handleTextureLoaded(darkImage, darkTexture);
    }

    refractImage.onload = function () {
        handleTextureLoaded(refractImage, refractTexture);
    }

    reflectImage.onload = function () {
        handleTextureLoaded(reflectImage, reflectTexture);
    }

    alphaImage.onload = function () {
        handleTextureLoaded(alphaImage, alphaTexture);
    }


    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, normalTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerNormal"), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, lightTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerColor1"), 1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, darkTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerColor0"), 2);

    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, refractTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerBackground"), 3);

    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, reflectTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerForeground"), 4);

    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, alphaTexture);
    gl.uniform1i(gl.getUniformLocation(program, "uSamplerAlpha"), 5);


    currentLightLoc = gl.getUniformLocation(program, "currentLight");
    lightNumLoc = gl.getUniformLocation(program, "lightNum");
    mouseLoc = gl.getUniformLocation(program, "mouseXY");

    lightsOnlyLoc = gl.getUniformLocation(program, "lightsOnly");


    lightColorLoc = gl.getUniformLocation(program, "lightColor");
    lightIntensityLoc = gl.getUniformLocation(program, "lightIntensity");
    showDiffuseLoc = gl.getUniformLocation(program, "showDiffuse");
    showSpecLoc = gl.getUniformLocation(program, "showSpec");
    pointLightDisLoc = gl.getUniformLocation(program, "pointLightDis");
    pointLightDecayLoc = gl.getUniformLocation(program, "pointLightDecay");
    pointLightSpecLoc = gl.getUniformLocation(program, "pointLightSpec");


    styleBrightLoc = gl.getUniformLocation(program, "styleBright");
    styleDarkLoc = gl.getUniformLocation(program, "styleDark");
    reflectNoiseLoc = gl.getUniformLocation(program, "reflectNoise");


    alphaRLoc = gl.getUniformLocation(program, "alphaR");
    alphaGLoc = gl.getUniformLocation(program, "alphaG");
    alphaBLoc = gl.getUniformLocation(program, "alphaB");
    logIORLoc = gl.getUniformLocation(program, "logIOR");
    BGdisLoc = gl.getUniformLocation(program, "BGdis");
    FGdisLoc = gl.getUniformLocation(program, "FGdis");
    reflMapLoc = gl.getUniformLocation(program, "reflMap");
    FGshiftXLoc = gl.getUniformLocation(program, "FGshiftX");
    FGshiftYLoc = gl.getUniformLocation(program, "FGshiftY");
    FGscaleXLoc = gl.getUniformLocation(program, "FGscaleX");
    FGscaleYLoc = gl.getUniformLocation(program, "FGscaleY");

    fresnelIntensityLoc = gl.getUniformLocation(program, "fresnelIntensity");
    fresnelBLoc = gl.getUniformLocation(program, "fresnelB");
    fresnelCLoc = gl.getUniformLocation(program, "fresnelC");
    checkFresnelLoc = gl.getUniformLocation(program, "checkFresnel");
    checkFakeLoc = gl.getUniformLocation(program, "checkFake");
    checkRsLoc = gl.getUniformLocation(program, "checkRs");

    render();
};

function initTextures() {


    normalTexture = gl.createTexture();
    normalImage = new Image();

    lightTexture = gl.createTexture();
    lightImage = new Image();

    darkTexture = gl.createTexture();
    darkImage = new Image();

    refractTexture = gl.createTexture();
    refractImage = new Image();

    reflectTexture = gl.createTexture();
    reflectImage = new Image();

    alphaTexture = gl.createTexture();
    alphaImage = new Image();


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
    //gl.bindTexture(gl.TEXTURE_2D, 0);

}


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var lightsOnlyElem = $('#lightsOnlySelect:checked');
    lightsOnly = (lightsOnlyElem.val()) ? 1 : 0;

    var checkFresnelElem = $('#checkFresnelSelect:checked');
    checkFresnel = (checkFresnelElem.val()) ? 1 : 0;

    var checkFakeElem = $('#checkFakeSelect:checked');
    checkFake = (checkFakeElem.val()) ? 1 : 0;

    var checkRsElem = $('#checkRsSelect:checked');
    checkRs = (checkRsElem.val()) ? 1 : 0;


    for (var i = 0; i < lightNum; i++) {
        var checkboxName_showDiffuse = '#lightPanel' + i + ' #diffuseSelect:checked';
        var showDiffuseElem = $(checkboxName_showDiffuse);
        showDiffuse[i] = (showDiffuseElem.val()) ? 1 : 0;

        var checkboxName_showSpec = '#lightPanel' + i + ' #specSelect:checked';
        var showSpecElem = $(checkboxName_showSpec);
        showSpec[i] = (showSpecElem.val()) ? 1 : 0;

    }

    gl.uniform1i(currentLightLoc, currentLight);
    gl.uniform1f(lightNumLoc, lightNum);

    gl.uniform2fv(mouseLoc, flatten(mouseXY));//use flatten() to extract data from JS Array, send it to WebGL functions

    gl.uniform1i(lightsOnlyLoc, lightsOnly);
    gl.uniform3fv(lightColorLoc, flatten(lightColor));
    gl.uniform1fv(lightIntensityLoc, lightIntensity);

    gl.uniform1iv(showDiffuseLoc, showDiffuse);
    gl.uniform1iv(showSpecLoc, showSpec);
    gl.uniform1fv(pointLightDisLoc, pointLightDis);
    gl.uniform1fv(pointLightDecayLoc, pointLightDecay);
    gl.uniform1f(pointLightSpecLoc, pointLightSpec);

    gl.uniform1f(styleBrightLoc, styleBright);
    gl.uniform1f(styleDarkLoc, styleDark);
    gl.uniform1f(reflectNoiseLoc, reflectNoise);


    gl.uniform1f(alphaRLoc, alphaR);
    gl.uniform1f(alphaGLoc, alphaG);
    gl.uniform1f(alphaBLoc, alphaB);

    gl.uniform1f(logIORLoc, logIOR);
    gl.uniform1f(BGdisLoc, BGdis);
    gl.uniform1f(FGdisLoc, FGdis);
    gl.uniform1i(reflMapLoc, reflMap);
    gl.uniform1f(FGshiftXLoc, FGshiftX);
    gl.uniform1f(FGshiftYLoc, FGshiftY);
    gl.uniform1f(FGscaleXLoc, FGscaleX);
    gl.uniform1f(FGscaleYLoc, FGscaleY);

    gl.uniform1f(fresnelIntensityLoc, fresnelIntensity);
    gl.uniform1f(fresnelBLoc, fresnelB);
    gl.uniform1f(fresnelCLoc, fresnelC);
    gl.uniform1i(checkFresnelLoc, checkFresnel);

    gl.uniform1i(checkFakeLoc, checkFake);
    gl.uniform1i(checkRsLoc, checkRs);


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

        // for vertex colors use
        //colors.push(vertexColors[indices[i]] );

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
