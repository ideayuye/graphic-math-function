
/*
*   输入键盘
*/

Vue.component('keyboard', {
    template: "#tmpl_keyboard",
    props:['ishide'],
    data:function(){
        return {
            funcBtns: [
                { message: '*' ,value: '*'},
                { message: '/' ,value: '/'},
                { message: '+' ,value: '+'},
                { message: '-' ,value: '-'},
                { message: '<-' ,value: 'backspace'},
                { message: 'x',value: 'x' },
                { message: 'sin' ,value: 'sin'},
                { message: 'cos' ,value: 'cos'},
                { message: 'log' ,value: 'log'},
                { message: 'log2' ,value: 'log2'},
                { message: 'log10' ,value: 'log10'},
                { message: 'abs' ,value: 'abs'},
                { message: 'pow' ,value: 'pow'},
                { message: 'sqrt' ,value: 'sqrt'},
                { message: 'tan' ,value: 'tan'},
                { message: 'asin' ,value: 'asin'},
                { message: 'acos' ,value: 'acos'}
            ]
        }
    },
    methods:{
        funcBtnClick : function(e){
            e.stopPropagation();
            var symbolText = e.target.innerText;
            //触发输入按钮点击事件
            this.$dispatch('vir-enter',symbolText);
        }
    }
});

