
var grapher = null;
function myInit() {
    var canvas = document.getElementById('mainCanvas');
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

