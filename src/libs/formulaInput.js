

var keyboard = require('./Keyboard.js');
var util = require('./util.js');
var binarySearch = util.binarySearch;
var measureText = util.measureText;

//全局页面点击事件
function pageTouch(){
    var me = this;
    me.notfocus = 1;
    me.keyboardShow = 0;
    me.helpShow = 0;
};

function genComponent(canvas,grapher){
    return {
        template: '#tmpl_input_panel',
        data: function () {
            return {
                editVal: '',
                focusIndex: 0,
                left: 50,
                textWidths: [0],//每个长度对应的字符宽度
                notfocus: 1, //虚拟框是否获得焦点
                keyboardShow: 0,
                helpShow: 0,
                helpStyle: {
                    "margin-top": "0px"
                },
                helpFix: 0
            }
        },
        components:{
            keyboard:keyboard
        },
        computed:{
            selFormula:function(){
                return this.$store.state.formulas[this.$store.state.selected];
            }
        },
        watch:{
            selFormula : function(val){
                this.editVal =  val;
                this.calTextWidth();
            }
        },
        methods: {
            changeFormula: function () {
                var formula = this.editVal;
                if (!grapher.notOnBlackList(formula))
                    return;
                var x = 1.1, y = 0, isError = 0;
                try {
                    with (Math) { eval("y = " + formula); }
                } catch (e) {
                    isError = 1;
                }
                if (!isError && !isNaN(y)) {
                    this.$store.commit('edit',{formula:formula});
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
                current = current === false? this.editVal.length:current;
                this.focusIndex = current;
                this.notfocus = 0;
                this.fixCursor();
                this.keyboardShow = 1;
            },
            virEnter:function(symbolText){
                if(this.notfocus )
                    return;
                var focusIndex = this.focusIndex;
                this.editVal = this.editVal.slice(0,focusIndex) + symbolText + this.editVal.slice(focusIndex);
                this.focusIndex += symbolText.length;
                
                //计算每个字符对应的宽度
                this.calTextWidth();

                this.fixCursor();
                //刷新图形
                this.changeFormula();
            },
            calTextWidth:function(){
                //计算每个字符对应的宽度
                this.textWidths=[0];
                for(var i=1;i<=this.editVal.length;i++){
                    var txtWidth = measureText(this.editVal.slice(0,i));
                    this.textWidths.push(txtWidth);
                }
            },
            virBackspace:function(){
                var focusIndex = this.focusIndex;
                this.editVal = this.editVal.slice(0,focusIndex-1) + this.editVal.slice(focusIndex);
                this.focusIndex--;
                this.fixCursor();
            },
            virBack:function(){
                this.notfocus = 1;
                this.keyboardShow = 0;
            },
            helpClick:function(){
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
            },
            pageTouchHandle :function(){
                pageTouch.call(this);
            }
        },
        mounted:function(){
            canvas.addEventListener('touchend',this.pageTouchHandle);
        },
        destroyed:function(){
            canvas.removeEventListener('touchend',this.pageTouchHandle);
        }
    };
}

module.exports = {
    genComponent:genComponent
};

