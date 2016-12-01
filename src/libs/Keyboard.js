
/*
*   输入键盘
*/

var Keyboard = {
    template: "#tmpl_keyboard",
    props:['show'],
    data:function(){
        return {
            funcBtns: [
                { message: '1' ,value: '1'},
                { message: '2' ,value: '2'},
                { message: '3' ,value: '3'},
                { message: '<=' ,value: 'backspace'},
                { message: '4' ,value: '4'},
                { message: '5' ,value: '5'},
                { message: '6' ,value: '6'},
                { message: '∏' ,value: 'PI'},
                { message: '7' ,value: '7'},
                { message: '8' ,value: '8'},
                { message: '9' ,value: '9'},
                { message: '*x' ,value: '*x'},
                { message: '(' ,value: '('},
                { message: '0' ,value: '0'},
                { message: ')' ,value: ')'},
                { message: 'x' ,value: 'x'},
            ],
            operators:[
                { message: '.',value: '.' },
                { message: '*' ,value: '*'},
                { message: '/' ,value: '/'},
                { message: '+' ,value: '+'},
                { message: '-' ,value: '-'}
            ],
            numPanelHide:0,
            fxPanelHide:1,
            fxBtns:[
                { message: 'sin' ,value: 'sin'},
                { message: 'cos' ,value: 'cos'},
                { message: 'log' ,value: 'log'},
                { message: 'log2' ,value: 'log2'},
                { message: '<' ,value: 'back'},
                { message: 'log10' ,value: 'log10'},
                { message: 'abs' ,value: 'abs'},
                { message: 'pow' ,value: 'pow'},
                { message: 'sqrt' ,value: 'sqrt'},
                { message: 'tan' ,value: 'tan'},
                { message: 'asin' ,value: 'asin'},
                { message: 'acos' ,value: 'acos'},
                { message: 'atan' ,value: 'atan'},
                { message: '自然数' ,value: 'E'}
            ]
        }
    },
    methods:{
        funcBtnClick : function(e){
            e.stopPropagation();
            var symbolText = e.target.getAttribute('data-value');
            //触发输入按钮点击事件
            switch(symbolText){
                case "backspace":
                    this.$emit('vir-backspace');
                    break;
                case "back":
                    this.numPanelHide = 0;
                    this.fxPanelHide = 1;
                    break;
                default:
                    this.$emit('vir-enter',symbolText);
            }
        },
        mBack:function(){
            this.$emit('vir-back');
        },
        fxClick:function(){
            this.numPanelHide = 1;
            this.fxPanelHide = 0;
        },
        helpClick:function(){
            this.$emit('help');
        }
    }
}

module.exports = Keyboard;

