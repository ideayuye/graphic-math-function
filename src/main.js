
var grapher = null;
var canvas = document.getElementById('mainCanvas');
var ctx = canvas.getContext('2d');

function myInit() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.setAttribute('width', w);
    canvas.setAttribute('height', h);
    grapher = new Grapher();

    var app = new Vue({
        el: '#input-panel',
        data: {
            formula: '',
            focusIndex:0,
            left:50,
            ishide : true,
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
            },
            funcBtnClick : function(e){
                var symbolText = e.target.innerText;
                this.formula += symbolText;
                var focusIndex = this.focusIndex;
                this.formula.slice(0,focusIndex) + symbolText + this.formula.slice(focusIndex);
                this.focusIndex += symbolText.length;
                ctx.font = "12px sans-serif";
                var txtWidth = ctx.measureText(this.formula).width;
                this.left = 50 + parseInt(txtWidth) + 1;
                
                /*
                *1.计算光标位置 o
                *2.展示/隐藏光标 是否获得焦点
                */

                //刷新图形
                this.changeFormula();
            },
            virInputClick:function(e){
                console.log('end',e);
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

