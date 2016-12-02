

var formulaList = {
    template:'#tmpl_formula_list',
    data:function(){
        return {
            formulas:['2*x','sin(x)']
        }
    },
    methods:{
        test:function(){
            console.log('test work');    
        }
    }
};

module.exports = formulaList;
