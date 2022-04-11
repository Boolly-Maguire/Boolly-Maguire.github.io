var image1, image2;
// init vars
var $container1 = $('#container1'),
    $container2 = $('#container2');


UPLOADinit = function () {
    /******************* Initial Maps *********************/

    image1 = new Image();
    image2 = new Image();

    initParameters();

    image1.src = "images/lightning.jpg"; //dark
    image2.src = "images/moon.jpg"
    //load default images in thumb

    initDefaultThumbImgSize(image1);
    initDefaultThumbImgSize(image2);

    //canvas size based on Normal map

    $("#container1image").append(image1);
    $("#container2image").append(image2);

    //$("#container7image").append(image3);
    //updateCanvasSizeandStyle(image3)
    initDefaultCanvasSize(image1);
    //key function
    addEventListeners();
}

function initDefaultThumbImgSize(_image) {
    _image.addEventListener('load', function () {
        //set thumb image size
        setThumbImgSize(_image);
    });

}

function initDefaultCanvasSize(_image) {
    _image.addEventListener('load', function () {
        //update gl-canvas width and height
        updateCanvasSizeandStyle(_image);
    });

}

function addEventListeners() {
    // container1 DnD event
    var container1 = $container1[0];
    container1.addEventListener('dragover', cancel, false);
    container1.addEventListener('dragenter', cancel, false);
    container1.addEventListener('dragexit', cancel, false);
    container1.addEventListener('drop', dropFile, false);


    var container2 = $container2[0];
    container2.addEventListener('dragover', cancel, false);
    container2.addEventListener('dragenter', cancel, false);
    container2.addEventListener('dragexit', cancel, false);
    container2.addEventListener('drop', dropFile, false);

}


/*
 * Handles when a file is dropped by
 * the user onto the container1
 */
function dropFile(event) {
    var eventCaller = event.target.parentNode.parentNode.id;
    //from ".btn-file input" to ".btn-file" to "imgThumb_container", result is "#container1 2 3 4 5"
    //alert(event);

    // stop the browser doing
    // it's normal thing of going
    // to the item
    event.stopPropagation();
    event.preventDefault();

    // query what was dropped
    var files = event.dataTransfer.files;

    // if we have something
    if (files.length) {
        handleDropFile(files[0], eventCaller);
    }

    return false;
}

/**
 * Handles the uploaded file (drop file and selected file)
 */
function handleDropFile(file, eventCaller) {
    var fileReader = new FileReader();
    //fileReader.onloadend	= fileUploaded;
    fileReader.onloadend = function (event) {
        if (event.target.result.match(/^data:image/)) {
            return fileUploaded.call(this, event, eventCaller);
        } else {
            // time to whinge
            alert("Umm, images only? ... Yeah");
        }
    }
    fileReader.readAsDataURL(file);
}

/************* Selected file to upload (not drag and drop) -start**************/
//load selected file to container
function handleSelectedFile(fileSelected, container) {
    var fileToLoad = fileSelected[0];
    if (fileToLoad.type.match("image.*")) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            return fileUploaded.call(this, event, container);
        };
    } else {
        alert("Umm, images only? ... Yeah");
    }
    fileReader.readAsDataURL(fileToLoad);
}

/************* Selected file to upload (not drag and drop) - end **************/


/**
 * File upload handled
 */
function fileUploaded(event, elemName) {
    var image;
    var container = $('#' + elemName);
    // check it's an image

    container.addClass('live');

    if (elemName === "container1") {
        image1 = new Image();
        image1.src = event.target.result;

        image = image1;
        //set thumb image size
        setThumbImgSize(image1);

        // Update WebGL texture.
        darkImage.src = image1.src;
    } else if (elemName === "container2") {
        image2 = new Image();
        image2.src = event.target.result;
        image = image2;

        //set thumb image size
        setThumbImgSize(image2);

        // Update WebGL texture.
        defaultImage.src = image2.src;
    }

    // create the image object
    imageManip(elemName, image);

}


function cancel(event) {
    if (event.preventDefault)
        event.preventDefault();

    return false;
}

function imageManip(elemName, image) {
    $('#' + elemName + 'image').empty();
    $('#' + elemName + 'image').append(image);
}

function setThumbImgSize(_image) {
    _image.style.width = "auto";
    _image.style.height = "auto";

    if (_image.width >= _image.height) {
        _image.style.width = "100px";
    } else {
        _image.style.height = "100px";
    }
}


function updateCanvasSizeandStyle(_image) {
    var canvas = document.getElementById("gl-canvas");
    var canvasContainer = $('.canvas_container');
    var ratioImage = _image.width / _image.height;
    var ratioContainer = canvasContainer.width() / canvasContainer.height();

    var lightPostionContainer = $('#lightPosition_container');

    if (ratioImage >= ratioContainer) {
        canvas.width = canvasContainer.width();
        canvas.height = canvas.width * _image.height / _image.width;
        canvas.style.width = "100%";
        canvas.style.height = "auto";
        $(lightPostionContainer).css("width", "100%");
        $(lightPostionContainer).css("height", "auto");


    } else {
        canvas.height = canvasContainer.height();
        canvas.width = canvas.height * _image.width / _image.height;
        canvas.style.height = "100%";
        canvas.style.width = "auto";
        $(lightPostionContainer).css("height", "100%");
        $(lightPostionContainer).css("width", "auto");

    }

    $(lightPostionContainer).attr("width", canvas.width);
    $(lightPostionContainer).attr("height", canvas.height);
    var viewbox = "0 0 " + canvas.width + " " + canvas.height;
    $(lightPostionContainer).attr("viewBox", viewbox);

    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.05, 0.05, 0.05, 1.0);

}


/************* Selected file to upload (not drag and drop) set listener**************/
/************* and drag and drop UPLOADinit **************/


//hover image with image name label show up
$(document).on('change', '.btn-file :file', function () {
    var input = $(this);
    var label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [label]);
});

$(document).ready(function () {

    UPLOADinit();

    $('.btn-file :file').on('fileselect', function (event) {
        var elemName = event.target.id;
        var containerName = event.target.parentNode.parentNode.id;
        var filesSelected = document.getElementById(elemName).files;
        handleSelectedFile(filesSelected, containerName);
    });
});
