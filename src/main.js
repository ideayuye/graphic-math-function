var Vue = require('./vue.min.js');
var Grapher = require('./libs/grapher.js');
var Hammer = require('./hammer.min.js');
var detector = require('./libs/detector.js');
var formula = require('./libs/formulaInput.js');
var formulaList = require('./libs/formulaList.js');
var canvas = document.getElementById('mainCanvas');
var grapher = new Grapher(canvas);
var isMobile = detector.isMobile; //判断平台

//绑定鼠标事件
function bindMouseEvent() {
    if (isMobile) {
        //hammer
        var hammer = new Hammer(canvas);

        hammer.get('pinch').set({
            enable: true
        });

        hammer.on('panstart', function (ev) {
            grapher.touchstart(ev);
        });

        hammer.on('pan', function (ev) {
            grapher.mPan(ev);
        });

        hammer.on('pinchstart', function (ev) {
            grapher.mScaleStart();
        });

        hammer.on('pinch', function (ev) {
            grapher.mScale(ev);
        });
    } else {
        var me = grapher;
        // 桌面端
        canvas.onmousedown = function (ev) {
            me.mouseDown(ev);
        }
        canvas.onmousemove = function (ev) {
            me.mouseMove(ev);
        }
        canvas.onmouseup = function (ev) {
            me.mouseUp(ev);
        }
        canvas.onmouseout = function (ev) {
            me.mouseUp(ev);
        }
    }
}

! function () {
    new Vue({
        el: '#app',
        components: {
            'formula-input': formula.genComponent(canvas, grapher),
            'formula-list': formulaList
        }
    });
    bindMouseEvent();
}();