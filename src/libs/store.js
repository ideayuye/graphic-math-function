var Vue = require('vue');
var Vuex = require('vuex');

Vue.use(Vuex);

var grapher ;

var store = {
    state: {
        formulas: [
            {content:'2*x',visible:1,color:'#a0ffc0'},
            {content:'sin(x)*x',visible:1,color:'#e08031'}
        ],
        selected: -1
    },
    mutations: {
        remove: function (state, data) {
            var index = state.formulas.indexOf(data.formula);
            index != -1 && state.formulas.splice(index, 1);
        },
        selected: function (state, data) {
            state.selected = data.selectedIdnex;
        },
        clearSelected:function(state){
            state.selected = -1;
        },
        edit: function (state, data) {
            if( !grapher.checkFormula(data.formula)) return ;
            if (state.selected != -1)
                state.formulas[state.selected].content = data.formula;
        }
    }
};

module.exports = function (g) {
    var nstore = new Vuex.Store(store);
    grapher = g;
    g.formulas = nstore.state.formulas;
    nstore.watch(function (state) {
        return state.formulas;
    }, function () {
        g.draw();
    }, { deep: true,immediate:true  });
    return nstore;
};