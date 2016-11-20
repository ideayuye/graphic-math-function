
var Hammer = require('./hammer.min.js');
var Vue = require('./vue.min.js');
var detector = require('./libs/detector.js');
var Grapher = require('./grapher.js');
require('./libs/Keyboard.js');


var grapher = null;
var canvas = document.getElementById('mainCanvas');
//判断平台
var isMobile = detector.isMobile;

//二分查找算法
function binarySearch($array, $val) {
    var $count = $array.length;
    var $low = 0;
    var $high = $count - 1;
    while ($low <= $high) {//跳出条件
        $mid = parseInt(($low + $high) / 2);
        if ($array[$mid] <= $val && $array[$mid+1]>$val ) {
            return $mid;
        }
        if ($array[$mid] < $val) {
            $low = $mid + 1;
        } else {
            $high = $mid - 1;
        }
    }
    return false;
}

//测量文本的宽度
var cavsMeasure = document.createElement('canvas');
var ctx = cavsMeasure.getContext('2d');
function measureText(text){
    var inputc = document.querySelector('.v-content');
    // ctx.font = "12px sans-serif";
    ctx.font = window.getComputedStyle(inputc).font;
    return ctx.measureText(text).width;
}


function myInit () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    grapher = new Grapher();

    var app = new Vue({
        el: '#input-panel',
        data: {
            formula: '',
            focusIndex:0,
            left:50,
            textWidths:[0],//每个长度对应的字符宽度
            notfocus:1, //虚拟框是否获得焦点
            keyboardShow:0,
            helpShow:0,
            helpStyle:{
                "margin-top":"0px"
            },
            helpFix:0,
        },
        methods: {
            changeFormula: function () {
                var formula = this.formula;
                if (!grapher.notOnBlackList(formula))
                    return;
                var x = 1.1, y = 0, isError = 0;
                try {
                    with (Math) { eval("y = " + formula); }
                } catch (e) {
                    isError = 1;
                }
                if (!isError && !isNaN(y)) {
                    grapher.formula = formula;
                    grapher.draw();
                }
            },
            fixCursor:function(){
                this.left = 40 + this.textWidths[this.focusIndex];
            },
            virInputClick:function(e){
                e.stopPropagation();
                var touch = e.touches[0];
                var dom = e.target;
                var pageX = touch.pageX,
                    pageY = touch.pageY;
                var boundRect = dom.getBoundingClientRect();
                var dx = pageX - boundRect.left;
                //计算光标位置
                var current = binarySearch(this.textWidths,dx);
                current = current === false? this.formula.length:current;
                this.focusIndex = current;
                this.notfocus = 0;
                this.fixCursor();
                this.keyboardShow = 1;
            },
            'virEnter':function(symbolText){
                if(this.notfocus )
                    return;
                var focusIndex = this.focusIndex;
                this.formula = this.formula.slice(0,focusIndex) + symbolText + this.formula.slice(focusIndex);
                this.focusIndex += symbolText.length;
                
                //计算每个字符对应的宽度
                this.textWidths=[0];
                for(var i=1;i<=this.formula.length;i++){
                    var txtWidth = measureText(this.formula.slice(0,i));
                    this.textWidths.push(txtWidth);
                }

                this.fixCursor();
                //刷新图形
                this.changeFormula();
            },
            'virBackspace':function(){
                var focusIndex = this.focusIndex;
                this.formula = this.formula.slice(0,focusIndex-1) + this.formula.slice(focusIndex);
                this.focusIndex--;
                this.fixCursor();
            },
            'virBack':function(){
                this.notfocus = 1;
                this.keyboardShow = 0;
            },
            'helpClick':function(){
                this.keyboardShow = 0;
                this.helpShow = 1;
                this.notfocus = 1;
                
                if(!this.helpFix){
                    this.$nextTick(function(){
                        var h = this.$el.querySelector('.help').getBoundingClientRect().height;
                        this.helpStyle["margin-top"] = -h*0.5+"px";
                        this.helpFix = 1;
                    });
                }
            }
        }
    });

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
        app.notfocus = 1;
        app.keyboardShow = 0;
        app.helpShow = 0;
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
    myInit();
    bindMouseEvent();
    grapher.formula = "sin(x)";
    grapher.draw();
}();


