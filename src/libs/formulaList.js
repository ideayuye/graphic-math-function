
var Vuex = require('vuex');

var formulaList = {
    template:'#tmpl_formula_list',
    computed:{
        cptFormulas:function(){
            return this.$store.state.formulas;  
        }
    },
    methods:{
        selected:function(selectedIndex){
            this.$store.commit('selected',{selectedIdnex:selectedIndex});
        },
        remove:function(){
            this.$store.commit('remove',{formula:'2*x'})
        }
    }
};

module.exports = formulaList;
