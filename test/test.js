

// var chai = require('chai');
var expect = chai.expect;

describe('t1', function () {
    it('case1', function () {
        expect(1 + 2).to.equal(3);
    });
});

var Vue = require('vue');
var keyboard = require('./../src/libs/Keyboard.js');

describe('mycomponent', () => {
    it('create ok', () => {
        const Ctor = Vue.extend(keyboard)
        const vm = new Ctor({
            show: 1
        }).$mount()

        expect(vm.$el.getAttribute('class'))
            .to.equal('keyboard-panel')
    })
});

