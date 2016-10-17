
var grapher = null;
function myInit() {
    grapher = new Grapher();
    var canvas = document.getElementById('mainCanvas');
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.setAttribute('width',w);
    canvas.setAttribute('height',h);
    
}
myInit();
grapher.drawGraph("sin(x)", '#ffc040');
