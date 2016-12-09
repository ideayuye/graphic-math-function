

describe('t1', function () {
    it('case1', function () {
        expect(1 + 2).toEqual(3);
    });
});

var Vue = require('vue');
var keyboard = require('./../src/libs/keyboard.vue');

describe('mycomponent', () => {
    it('create ok', () => {
        const Ctor = Vue.extend(keyboard)
        const vm = new Ctor({
            show: 1
        }).$mount()

        expect(vm.$el.getAttribute('class'))
            .toEqual('keyboard-panel')
    })
});

