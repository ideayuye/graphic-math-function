
/*
*1.计算光标位置
*2.展示/隐藏光标
*/
Vue.component('virtual-input', {
    template: "#tmpl_virsual_iput",
    data:function(){
        return {
            msg:'hio',
            cursorIndex:0
        }
    },
    props:['instr']
});


