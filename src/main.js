
var Hammer = require('./hammer.min.js');
var detector = require('./libs/detector.js');
var start = require('./libs/app.js');
var app;
var grapher = null;
var canvas = document.getElementById('mainCanvas');
var isMobile = detector.isMobile;//判断平台

//页面点击事件
function bindGlobalTouch(){
    canvas.ontouchend = function(e){
        /*var help = document.querySelector('.help');
        // if(help&&!help.contains(e.target))
        //     app.ishide = true;
        var inputContent = document.querySelector('.vir-input');
        var keyboard = document.querySelector('.keyboard-panel');
        if(!inputContent.contains(e.target) && keyboard && !keyboard.contains(e.target)){
            app.notfocus = 1;
            app.keyboardShow = 0;
        }*/
        if(app){
            app.notfocus = 1;
            app.keyboardShow = 0;
            app.helpShow = 0;
        }
    }
}

//绑定鼠标事件
function bindMouseEvent() {
    if (isMobile) {
        //hammer
        var hammer = new Hammer(canvas);
        
        hammer.get('pinch').set({ enable: true });

        hammer.on('panstart',function(ev){
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
        canvas.onmousedown = function (ev) { me.mouseDown(ev); }
        canvas.onmousemove = function (ev) { me.mouseMove(ev); }
        canvas.onmouseup = function (ev) { me.mouseUp(ev); }
        canvas.onmouseout = function (ev) { me.mouseUp(ev); }
    }
}

!function(){
    start.initGraph(canvas);
    app = start.initApp();
    bindGlobalTouch();
    bindMouseEvent();
}();


