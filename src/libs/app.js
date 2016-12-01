
var Vue = require('./../vue.min.js');
var keyboard = require('./Keyboard.js');
var Grapher = require('./grapher.js');

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

function initGraph (canvas) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    grapher = new Grapher();
}

function initApp(){
    return new Vue({
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
            helpFix:0
        },
        components:{
            keyboard:keyboard
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
                //居中帮助面板
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
}

module.exports = {
    initApp:initApp,
    initGraph:initGraph
};
