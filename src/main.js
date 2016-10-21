
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
var ci = 0,pi= 0;
var hammer = new Hammer(canvas);
    hammer.get('pinch').set({enable:true});

/*hammer.on('pan',function(ev){
    console.log(ev);
    $input.val('pan'+ ci++);
});*/

/*hammer.on('pinch',function(){
    console.log('pinch');
    $input.val('pinch'+ pi++);
});*/

/*hammer.on('pinchstart',function(ev){
    console.log('pinchstart');
    $input.val('pinchstart'+ pi++);
});*/

var px = 0;
hammer.on('pinchin',function(ev){
    console.log('pinchin');
    var scale = 1;
    scale = ev.originalEvent.gesture.scale;
    $input.val('pinchin'+ px++ +":"+ scale);
});



