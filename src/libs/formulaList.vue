
<template>
    <ul class="formula_list">
        <li v-for="(f,i) in cptFormulas" :style="{color:f.color}" class="f-item">
            <input type="checkbox" v-model="f.visible">
            <div @click="selected(i)" class="content">{{f.content}}</div>
        </li>
    </ul>
</template>

<script>
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
</script>

