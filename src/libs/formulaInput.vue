
<template>
    <div id="input-panel">
			<div class="formula-box">
				<label class="l-func">f(x)=</label>
				<!--<input id="input_formula"  type="text" name="" 
				v-model="formula"  placeholder="请输入数学函数" v-on:change="changeFormula" > -->
				<!--虚拟input-->
				<div class="vir-input">
					<i class="v-cursor" v-bind:style="{left:left+'px'}" v-bind:class="{'hide':notfocus}"></i>
					<div class="v-content" v-on:touchstart="virInputClick">{{editVal}}</div>
					<a href="javascript:;" v-show="closeShow" class="v-close" @click="cancelEdit"></a>
				</div>
				
			</div>
			<!--help组件-->
			<div class='help '  v-show="helpShow" v-bind:style="helpStyle" >
				<p>注：系统不能直接识别数学函数表达式，需要把部分运算符、函数替换为可识别函数</p>
				<ul>
					<li>1. 使用"x"代表变量</li>
					<li>2. 3x => 3*x</li>
					<li>3. 自然常数 => E</li>
					<li>4. 2∏x => 2*PI*x</li>
					<li>5. 5ⁿ => pow(5,x)</li>
					<li>6. log₂(x) => log2(x)</li>
				</ul>
			</div>
			<!--输入面板-->
			<keyboard v-bind:show='keyboardShow' 
				v-on:virenter='virEnter'
				v-on:vir-backspace='virBackspace'
				v-on:vir-back='virBack'
				v-on:help='helpClick' ></keyboard>
		</div>
</template>


<script>
    var keyboard = require('./keyboard.vue');
var util = require('./util.js');
var binarySearch = util.binarySearch;
var measureText = util.measureText;
var canvas = document.getElementById('mainCanvas');

//全局页面点击事件
function pageTouch() {
    var me = this;
    me.notfocus = 1;
    me.keyboardShow = 0;
    me.helpShow = 0;
};


var formulaInput = {
    // template: '#tmpl_input_panel',
    name:'formula-input',
    data: function () {
        return {
            editVal: '',
            focusIndex: 0,
            left: 50,
            textWidths: [0], //每个长度对应的字符宽度
            notfocus: 1, //虚拟框是否获得焦点
            keyboardShow: 0,
            helpShow: 0,
            helpStyle: {
                "margin-top": "0px"
            },
            helpFix: 0,
            closeShow:0 //取消编辑按钮是否可见
        }
    },
    components: {
        keyboard: keyboard
    },
    computed: {
        selFormula: function () {
            return this.$store.state.formulas[this.$store.state.selected];
        }
    },
    watch: {
        selFormula: function (val) {
            this.editVal = val?val.content:'';
            if(this.editVal)
                this.closeShow = 1;
            this.calTextWidth();
        }
    },
    methods: {
        changeFormula: function () {
            this.$store.commit('edit', {
                formula: this.editVal
            });
        },
        fixCursor: function () {
            this.left = 40 + this.textWidths[this.focusIndex];
        },
        virInputClick: function (e) {
            e.stopPropagation();
            var touch = e.touches[0];
            var dom = e.target;
            var pageX = touch.pageX,
                pageY = touch.pageY;
            var boundRect = dom.getBoundingClientRect();
            var dx = pageX - boundRect.left;
            //计算光标位置
            var current = binarySearch(this.textWidths, dx);
            current = current === false ? this.editVal.length : current;
            this.focusIndex = current;
            this.notfocus = 0;
            this.fixCursor();
            this.keyboardShow = 1;
        },
        virEnter: function (symbolText) {
            if (this.notfocus)
                return;
            var focusIndex = this.focusIndex;
            this.editVal = this.editVal.slice(0, focusIndex) + symbolText + this.editVal.slice(focusIndex);
            this.focusIndex += symbolText.length;

            //计算每个字符对应的宽度
            this.calTextWidth();

            this.fixCursor();
            //刷新图形
            this.changeFormula();
        },
        calTextWidth: function () {
            //计算每个字符对应的宽度
            this.textWidths = [0];
            for (var i = 1; i <= this.editVal.length; i++) {
                var txtWidth = measureText(this.editVal.slice(0, i));
                this.textWidths.push(txtWidth);
            }
        },
        virBackspace: function () {
            var focusIndex = this.focusIndex;
            this.editVal = this.editVal.slice(0, focusIndex - 1) + this.editVal.slice(focusIndex);
            this.focusIndex--;
            this.fixCursor();
        },
        virBack: function () {
            this.notfocus = 1;
            this.keyboardShow = 0;
        },
        helpClick: function () {
            this.keyboardShow = 0;
            this.helpShow = 1;
            this.notfocus = 1;
            //居中帮助面板
            if (!this.helpFix) {
                this.$nextTick(function () {
                    var h = this.$el.querySelector('.help').getBoundingClientRect().height;
                    this.helpStyle["margin-top"] = -h * 0.5 + "px";
                    this.helpFix = 1;
                });
            }
        },
        pageTouchHandle: function () {
            pageTouch.call(this);
        },
        /*取消编辑事件*/
        cancelEdit:function(){
            this.$store.commit('clearSelected');
            this.closeShow = 0;
        }
    },
    mounted: function () {
        canvas.addEventListener('touchend', this.pageTouchHandle);
    },
    destroyed: function () {
        canvas.removeEventListener('touchend', this.pageTouchHandle);
    }
};

module.exports = formulaInput;
</script>

