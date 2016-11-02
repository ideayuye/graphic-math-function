
/*
*1.计算光标位置
*2.展示/隐藏光标
*/
Vue.component('virtual-input', {
    template: "#tmpl_virsual_iput",
    data:function(){
        return {
            msg:'hio',
            cursorIndex:0,
            funcBtns: [
                { message: '*' },
                { message: '/' },
                { message: '+' },
                { message: '-' },
                { message: 'x' },
                { message: 'sin' },
                { message: 'cos' },
                { message: 'log' },
                { message: 'log2' },
                { message: 'log10' },
                { message: 'abs' },
                { message: 'pow' },
                { message: 'sqrt' },
                { message: 'tan' },
                { message: 'asin' },
                { message: 'acos' }
            ]
        }
    },
    methods:{
        funcBtnClick : function(e){
                e.stopPropagation();
                if(this.notfocus )
                    return;
                var symbolText = e.target.innerText;
                this.formula += symbolText;
                var focusIndex = this.focusIndex;
                this.formula.slice(0,focusIndex) + symbolText + this.formula.slice(focusIndex);
                this.focusIndex += symbolText.length;
                
                var txtWidth = measureText(this.formula);
                this.left = 50 + parseInt(txtWidth);

                //计算每个字符对应的宽度
                this.textWidths=[0];
                for(var i=1;i<=this.formula.length;i++){
                    var txtWidth = measureText(this.formula.slice(0,i));
                    this.textWidths.push(txtWidth);
                }
                //触发输入按钮点击事件
                
            }
    }
});


