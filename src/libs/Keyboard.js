
/*
*   输入键盘
*/

Vue.component('keyboard', {
    template: "#tmpl_keyboard",
    props:['ishide'],
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
                { message: 'sin' ,value: 'sin'},
                { message: '7' ,value: '7'},
                { message: '8' ,value: '8'},
                { message: '9' ,value: '9'},
                { message: 'cos' ,value: 'cos'},
                /*{ message: 'log' ,value: 'log'},
                { message: 'log2' ,value: 'log2'},
                { message: 'log10' ,value: 'log10'},
                { message: 'abs' ,value: 'abs'},
                { message: 'pow' ,value: 'pow'},
                { message: 'sqrt' ,value: 'sqrt'},
                { message: 'tan' ,value: 'tan'},
                { message: 'asin' ,value: 'asin'},
                { message: 'acos' ,value: 'acos'},
                { message: 'atan' ,value: 'atan'},*/
                { message: '(' ,value: '('},
                { message: '0' ,value: '0'},
                { message: ')' ,value: ')'},
                { message: 'funs' ,value: 'funs'},
            ],
            operators:[
                { message: 'x',value: 'x' },
                { message: '*' ,value: '*'},
                { message: '/' ,value: '/'},
                { message: '+' ,value: '+'},
                { message: '-' ,value: '-'}
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
                    this.$dispatch('vir-backspace');
                    break;
                default:
                    this.$dispatch('vir-enter',symbolText);
            }
        }
    }
});

