
var grapher = null;
var canvas = document.getElementById('mainCanvas');
function myInit() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    grapher = new Grapher();

    /*Vue.component('help', {
        template: "<div class='help' v-bind:class=\"{'hide':ishide}\">help conponent {{ishide}}</div>",
        props:['ishide']
    });*/

    var app = new Vue({
        el: '#input-panel',
        data: {
            formula: '',
            ishide : true,
            funcBtns: [
                { message: '*' },
                { message: '/' },
                { message: '+' },
                { message: '-' },
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
                { message: 'acos' },
                { message: 'atan' }
            ]
        },
        methods: {
            changeFormula: function () {
                var formula = this.formula;
                if (!grapher.notOnBlackList(formula))
                    return;
                var x = 1.1, y = 0, isError = 0;
                try {
                    with (Math) { eval("y = " + formula); }
                } catch (e) {
                    isError = 1;
                }
                if (!isError) {
                    grapher.formula = formula;
                    grapher.draw();
                }
            },
            helpClick :function(e){
                e.stopPropagation();
                this.ishide = !this.ishide;
            }
        }
    });

    document.onclick = function(e){
        var help = document.querySelector('.help');
        if(!help.contains(e.target))
            app.ishide = true;
    }
}

myInit();
grapher.formula = "sin(x)";
grapher.draw();

//hammer test
var hammer = new Hammer(canvas);
hammer.get('pinch').set({ enable: true });

hammer.on('pan', function (ev) {
    grapher.mPan(ev);
});

hammer.on('pinchstart', function (ev) {
    grapher.mScaleStart();
});

hammer.on('pinch', function (ev) {
    grapher.mScale(ev);
});

