$(function () {

    var data = {
        lastID: 0,
        lights: []
    };


    var octopus = {
        moveLight: function () {
            var times = 0;
            var interval = setInterval(function () {
                times += 1;

                if (times == 1000) {
                    clearInterval(interval);
                }
                //change lightColor[data.lastID]
                var t = times, r, g, b;
                var l1 = 400, l2 = 500, l3 = 750, l4 = 1000;

                if (t >= 0 && t < l1) {
                    r = 21.0 + ((t * 234.0) / l1);
                    g = 40.0 + ((t * 162.0) / l1);
                    b = 82.0 + ((t * 64.0) / l1);
                } else if (t >= l1 && t < l2) {
                    r = 255.0 - (((t - l1) * 11.0) / (l2 - l1));
                    g = 202.0 + (((t - l1) * 17.0) / (l2 - l1));
                    b = 124.0 + (((t - l1) * 11.0) / (l2 - l1));
                } else if (t >= l2 && t <= l3) {
                    r = 244.0 + (((t - l2) * 9.0) / (l3 - l2));
                    g = 219.0 - (((t - l2) * 125.0) / (l3 - l2));
                    b = 135.0 - (((t - l2) * 52.0) / (l3 - l2));
                } else {
                    r = 253.0 - (((t - l3) * 232.0) / (l4 - l3));
                    g = 94.0 - (((t - l3) * 54.0) / (l4 - l3));
                    b = 83.0 - (((t - l3) * 23.0) / (l4 - l3));
                }

                lightColor[data.lastID] = [r / 255.0, g / 255.0, b / 255.0];
                view.render();
            }, "10");
        },

        addLight: function () {
            var thisID = ++data.lastID;

            data.lights.push({
                id: thisID,
                Exist: true
            });

            lightNum++;
            addLightParameters(thisID);


            currentLight = thisID;


            var animation = 1;
            view.render(animation);
            //mouseFlag = 0;

        },

        removeLight: function (light) {
            var clickedLight = data.lights[light.id - 1];
            clickedLight.Exist = false;

            //check exist max id, set to lastID
            if (light.id == data.lastID) {
                var currentID = data.lastID;
                for (var i = currentID; i > 0; i--) {
                    if (data.lights[i - 1].Exist == false) {
                        data.lights.pop();
                        --data.lastID;
                    } else {
                        break;
                    }
                }
            }


            view.render();
        },

        getExistLights: function () {
            var ExistLights = data.lights.filter(function (light) {
                return light.Exist;
            });
            return ExistLights;
        },

        init: function () {
            view.init();
        }
    };


    var view = {
        init: function () {

            // mouse event

            var canvas = document.getElementById("gl-canvas");
            canvas.addEventListener("mousedown", function (evt) {
                mouseFlag = 1;
                evt.preventDefault();
            }, false);
            canvas.addEventListener("touchstart", function (evt) {
                mouseFlag = 1;
            }, false);

            document.addEventListener("mousemove", function (evt) {
                if (mouseFlag === 1) {
                    setMousePos(canvas, evt, 0);//add default light event;
                }
            }, false);
            document.addEventListener("touchmove", function (evt) {
                if (mouseFlag === 1) {
                    setMousePos(canvas, evt, 0);//add default light event;
                }
            }, false);

            document.addEventListener("mouseup", function () {
                mouseFlag = 0;
                //mouseFlag = (mouseFlag ==0)?1:0;
            }, false);
            document.addEventListener("touchend", function () {
                mouseFlag = 0;
                //mouseFlag = (mouseFlag ==0)?1:0;
            }, false);


            // show light Position event

            $('#lightsPositionSelect:checkbox').click(function () {
                var $this = $(this);
                // $this will contain a reference to the checkbox   
                if ($this.is(':checked')) {
                    $('#lightPosition_container').css("display", "block");
                } else {
                    $('#lightPosition_container').css("display", "none");
                }
            });


            // "Add light" button event
            var addLightBtn = $('#btn_addLight');
            addLightBtn.click(function () {
                octopus.addLight();
            });

            var moveLightBtn = $('#btn_moveLight');
            moveLightBtn.click(function () {
                octopus.moveLight();
            });

            // grab elements and html for using in the render function
            this.$lightList = $('ul#accordion_Lights');
            this.defaultLightTemplate = $('script[data-template="defaultLight"]').html();
            this.lightTemplate = $('script[data-template="light"]').html();
            this.$lightMarkList = $('#lightPosition_container');

            // Delegated event to listen for removal clicks
            this.$lightList.on('click', '.myLightsTitle .destroy', function (e) {
                var light = $(this).parents('.panel').data();
                octopus.removeLight(light);
                return false;
            });

            this.render();
        },

        render: function () {
            // Cache vars for use in forEach() callback (performance)
            var $lightList = this.$lightList,
                $lightMarkList = this.$lightMarkList,
                lightTemplate = this.lightTemplate;

            var defaultLightTemplate = lightTemplate.replace(/{{id}}/g, 0).replace("LIGHT0", "DEFAULT LIGHT");

            // Clear and render
            $lightList.html('');
            $lightMarkList.html('');
            $lightList.append(defaultLightTemplate);

            $("#lightPanel0 .destroy").remove();//can not be deleted

            //for default light
            setupLightFunctions(0);

            octopus.getExistLights().forEach(function (light) {

                // Replace template markers with data
                var thisTemplate = lightTemplate.replace(/{{id}}/g, light.id);
                $lightList.append(thisTemplate);
                setupLightFunctions(light.id);
            });


            if (currentLight != null) {

                var lightTitleName = '#lightPanel' + currentLight + ' .myLightsTitle';
                $(lightTitleName).removeClass('collapsed');
                var lightContentName = '#light' + currentLight;
                $(lightContentName).addClass('in');

            }

            //for show lights position 
            //init default point


        }
    };

    octopus.init();
}());


function addLightParameters(index) {
    //init parameter
    lightColor[index] = [Math.random(), Math.random(), Math.random()];

    //mouse 
    var canvas = document.getElementById("gl-canvas");
    document.addEventListener("mousemove", function (evt) {
        if (mouseFlag === 1) {
            setMousePos(canvas, evt, index);
        }
    }, false);
    document.addEventListener("touchmove", function (evt) {
        if (mouseFlag === 1) {
            setMousePos(canvas, evt, index);
        }
    }, false);

}

//mouse functions

function setMousePos(canvas, evt, i) {
    var rect = canvas.getBoundingClientRect();

    if (currentLight == i) {
        coordX = getMousePos(canvas, evt).x;
        coordY = getMousePos(canvas, evt).y;
    }

}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();

    var newX, newY;
    if (evt.type == 'touchstart' || evt.type == 'touchmove' || evt.type == 'touchend' || evt.type == 'touchcancel') {
        var touch = evt.touches[0] || evt.changedTouches[0];
        newX = touch.pageX;
        newY = touch.pageY;
    } else if (evt.type == 'mousedown' || evt.type == 'mouseup' || evt.type == 'mousemove' || evt.type == 'mouseover' || evt.type == 'mouseout' || evt.type == 'mouseenter' || evt.type == 'mouseleave') {
        newX = evt.pageX;
        newY = evt.pageY;
    }

    if (newY < rect.top) newY = rect.top;
    if (newY > rect.bottom) newY = rect.bottom;
    if (newX < rect.left) newX = rect.left;
    if (newX > rect.right) newX = rect.right;


    return {
        x: (newX - rect.left) / (rect.right - rect.left) - 0.5,
        y: (newY - rect.top) / (rect.bottom - rect.top) - 0.5
    };
}

