$(document).ready(function () {


    /**********************offcanvas.lib********************/
    $('[data-toggle="offcanvas"]').click(function () {
        $('.row-offcanvas').toggleClass('active')
    });



    var Z_slider = $("#Z_slider");
    var coord_Z = $("#coord_Z");
    Z_slider.attr("data-slider-min", -1).attr("data-slider-max", 1).attr("data-slider-step", 0.01).attr("data-slider-value", coordZ).attr("data-slider-tooltip", "hide").slider({});
    bindSliderValParam(Z_slider, coord_Z, "coordZ");

    // var Y_slider = $("#Y_slider");
    // var coord_Y = $("#coord_Y");
    // Y_slider.attr("data-slider-min", -1).attr("data-slider-max", 1).attr("data-slider-step", 0.01).attr("data-slider-value", coordY).attr("data-slider-tooltip", "hide").slider({});
    // bindSliderValParam(Y_slider, coord_Y, "coordY");
    //
    // var X_slider = $("#X_slider");
    // var coord_X = $("#coord_X");
    // X_slider.attr("data-slider-min", -1).attr("data-slider-max", 1).attr("data-slider-step", 0.01).attr("data-slider-value", coordX).attr("data-slider-tooltip", "hide").slider({});
    // bindSliderValParam(X_slider, coord_X, "coordX");

    /**********************SliderBar********************************/

    /**Basic Image**/
    $("#styleControl_slider").slider({min: 0, max: 1, value: [styleBright, styleDark], step: 0.01, focus: true});
    $("#styleControl_slider").on("slide", function (slideEvt) {
        styleBright = slideEvt.value[0];
        styleDark = slideEvt.value[1];
    });

    $("#specSharpness_slider").slider({min: 0.01, max: 0.1, value: sharpness, step: 0.001, focus: true});
    $("#specSharpness_slider").on("slide", function (slideEvt) {
        sharpness = slideEvt.value;
    });

});//end of $(document).ready


////////////////functions/////////////

function setupLightFunctions(i) {
    /////switch multiple lights - light on events
    var lightPanelName = '#lightPanel' + i;
    $(lightPanelName).on('shown.bs.collapse', function () {
        currentLight = i;
        console.log("current: " + currentLight);
    }).on('hidden.bs.collapse', function () {
        currentLight = null;
    })


    ////init colorPicker & add events
    var colorPickerName = "#lightPanel" + i + " .colorPicker";
    var colorString = color2hex(lightColor[i]);
    $(colorPickerName).attr("value", colorString);

    $(colorPickerName).minicolors({
        position: 'bottom right',
        theme: 'bootstrap',
        //defaultValue: colorString,
        change: function (value) {
            if (!value) return;
            if (typeof console === 'object') {
                var rgbObject = $(this).minicolors('rgbObject');
                for (var i = 0; i < lightNum; i++) {
                    if (currentLight == i) {
                        lightColor[i] = [rgbObject.r / 255, rgbObject.g / 255, rgbObject.b / 255];
                        setLightMarkFill(i); //function in addLights.lib
                    }
                }
                //add event: add border if it is white#ffffff;
                var addBorderElem = $(this).parent().find(".minicolors-swatch-color");
                if (value == "#ffffff") {
                    addBorderElem.addClass('colorPickerBorder');
                } else {
                    addBorderElem.removeClass('colorPickerBorder');
                }
            }
        },
    });

    //init: add border if it is white#ffffff;
    if (colorString == "#ffffff") {
        $(colorPickerName).parent().find(".minicolors-swatch-color").addClass('colorPickerBorder');
    }
}


function initCheckbox(param, elem) {
    if (param == 1) {
        elem.prop('checked', true);
    } else {
        elem.prop('checked', false);
    }
}

//for lights
function bindSliderValParamIndex(slider, val, param, index) {
    //init textarea
    val.val(window[param][index]);

    //update textarea when in slide
    slider.on("slide", function (slideEvt) {
        window[param][index] = slideEvt.value;
        val.val(window[param][index]);
    });

    //update slider when textarea change
    val.on("change", function () {
        window[param][index] = Number($(this).val());
        slider.slider("destroy").attr("data-slider-value", window[param][index]).attr("data-value", window[param][index]).attr("value", window[param][index]);
        slider.slider({});
        slider.on("slide", function (slideEvt) {
            window[param][index] = slideEvt.value;
            val.val(window[param][index]);
        });
    });

    //textarea allSelected when on focus;
    val.focus(function () {
        var $this = $(this);
        $this.select();

        // Work around Chrome's little problem
        $this.mouseup(function () {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });

    //textarea restrict only input number
    val.keydown(function (e) {
        onlyNumber(e)
    });
}

//for others except lights
function bindSliderValParam(slider, val, param) {
    //init textarea
    val.val(window[param]);

    //update textarea when in slide
    slider.on("slide", function (slideEvt) {
        window[param] = slideEvt.value;
        val.val(window[param]);
    });

    //update slider when textarea change
    val.on("change", function () {
        window[param] = Number($(this).val());
        slider.slider("destroy").attr("data-slider-value", window[param]).attr("data-value", window[param]).attr("value", window[param]);
        slider.slider({});
        slider.on("slide", function (slideEvt) {
            window[param] = slideEvt.value;
            val.val(window[param]);
        });
    });

    //textarea allSelected when on focus;
    val.focus(function () {
        var $this = $(this);
        $this.select();

        // Work around Chrome's little problem
        $this.mouseup(function () {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });

    //textarea restrict only input number
    val.keydown(function (e) {
        onlyNumber(e)
    });
}

function onlyNumber(e) {
    var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
    var code = e.keyCode || e.which;
    // Allow: delete, backspace, enter, leftarrow, rightarrow, "." and "-"s
    if (($.inArray(code, [46, 8, 13, 37, 39, 190, 173, 189]) !== -1) ||
        // Allow: Ctrl+A
        (code == 65 && ctrlDown === true) ||
        // Allow: Ctrl+C
        (code == 67 && ctrlDown === true) ||
        // Allow: Ctrl+V
        (code == 86 && ctrlDown === true) ||
        // Allow: Ctrl+X
        (code == 88 && ctrlDown === true) ||
        // Allow: home, end, left, right
        (code >= 35 && code <= 39)) {
        // let it happen, don't do anything
        return;
    }
    ;
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}

// Converts an color array to a hex string
function color2hex(color) {
    var hex = [
        (Math.round(color[0] * 255)).toString(16),
        (Math.round(color[1] * 255)).toString(16),
        (Math.round(color[2] * 255)).toString(16)
    ];
    $.each(hex, function (nr, val) {
        if (val.length === 1) hex[nr] = '0' + val;
    });
    return '#' + hex.join('');
}




