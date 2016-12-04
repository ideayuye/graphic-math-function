
var Vue = require('./../vue.min.js');
var Vuex = require('vuex');

Vue.use(Vuex);

var store = new Vuex.Store({
    state:{
        formulas:['2*x','sin(x)'],
        selected: -1
    },
    mutations:{
        remove:function(state,data){
            var index = state.formulas.indexOf(data.formula);
            index != -1 &&state.formulas.splice(index,1);
        },
        selected:function(state,data){
            state.selected = data.selectedIdnex;
        },
        edit:function(state,data){
            if(state.selected != -1)
                state.formulas[state.selected] = data.formula;
        }
    }

});

module.exports = store;

