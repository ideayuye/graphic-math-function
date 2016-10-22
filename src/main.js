
var grapher = null;
var canvas = document.getElementById('mainCanvas');
function myInit() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.setAttribute('width',w);
    canvas.setAttribute('height',h);
    grapher = new Grapher();
    var $input = $('#input-panel input');
    $input.change(function(){
        var formula = $(this).val().trim();
        if(!grapher.notOnBlackList(formula))
            return;
        var x = 1.1,y=0,isError = 0;
        try{
            with( Math ) { eval("y = " + formula); }
        }catch(e){
            isError = 1;
        }
        if(!isError){
            grapher.formula = formula;
            grapher.draw();
        }
    });
}
myInit();
grapher.formula = "sin(x)";
grapher.draw();

//hammer test
var $input = $('#input-panel input');
var hammer = new Hammer(canvas);
    hammer.get('pinch').set({enable:true});

hammer.on('pan',function(ev){
    grapher.mPan(ev);
});

hammer.on('pinchstart',function(ev){
    grapher.mScaleStart();RTCStatsProvider
});

hammer.on('pinch',function(ev){
    grapher.mScale(ev);
});




