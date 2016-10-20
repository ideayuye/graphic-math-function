
var captureMousePos = function(ev){
        if(!ev.touches.length)
            return;
        var touch  = ev.touches[0];
        ev.button = 0;
        ev.clientX = touch.clientX;
        ev.clientY = touch.clientY;
        return 1;
}

function Grapher()
{
    this.mCanvas = document.getElementById('mainCanvas');
    this.mContext = this.mCanvas.getContext('2d');

    this.mXres = this.mCanvas.width = this.mCanvas.clientWidth;
    this.mYres = this.mCanvas.height = this.mCanvas.clientHeight;

    this.mMouseFunction = 0;

    // ripped from Ed Mackey
    this.blackList = ["=","[","]","'",";", "new", "ml", "$", ").", "alert", "ook", "ipt", "doc", 
    "win", "set", "get", "tim", "net", "post", "black", "z"];

    this.mCx = 0.0;
    this.mCy = 0.0;
    this.mRx = 12.0;
    this.mRy = this.mRx*this.mYres/this.mXres;
    this.mRangeType = 2; // free

    this.mShowAxes = true;
    this.mShowGuides = true;

    var me = this;
    // 桌面端
    this.mCanvas.onmousedown = function(ev) { me.mouseDown(ev); }
    this.mCanvas.onmousemove = function(ev) { me.mouseMove(ev); }
    this.mCanvas.onmouseup   = function(ev) { me.mouseUp(ev); }
    this.mCanvas.onmouseout  = function(ev) { me.mouseUp(ev); }
    // 适配移动端
    var $mCanvas = $(this.mCanvas);
    $mCanvas.on('touchstart' ,function(ev) { captureMousePos(ev) && me.mouseDown(ev); });
    $mCanvas.on('touchmove', function (ev) {
        ev.preventDefault();
        captureMousePos(ev) && me.mouseMove(ev);
    });
    $mCanvas.on('touchend' ,function(ev) { captureMousePos(ev) && me.mouseUp(ev);});

    this.formula = "x";
    this.draw();
}



Grapher.prototype.toggleShowGuides = function()
{
    this.mShowGuides = !this.mShowGuides;
    this.draw();
}

Grapher.prototype.toggleShowAxes = function()
{
    this.mShowAxes = !this.mShowAxes;
    this.draw();
}

Grapher.prototype.setRange = function(val)
{

    if( val==0 )
    {
      this.mCx = 0.5;
      this.mCy = 0.5;
      this.mRx = 0.5;
      this.mRy = 0.5;
    }
    else if( val==1 )
    {
      this.mCx = 0.0;
      this.mCy = 0.0;
      this.mRx = 1.0;
      this.mRy = 1.0;
    }
    else
    {
      this.mCx = 0.0;
      this.mCy = 0.0;
      this.mRx = 12.0;
      this.mRy = this.mRx*this.mYres/this.mXres;
    }

    this.mRangeType = val;
    this.draw();
}

Grapher.prototype.setSize = function(val)
{
    var xres = 640;
    var yres = 480;

    if( val==0 )
    {
        xres = 640;
        yres = 480;
    }
    else if( val==1 )
    {
        xres = 960;
        yres = 720;
    }
    else
    {
        xres = 1280;
        yres = 960;
    }

    this.mXres = xres;
    this.mYres = yres;
    this.mCanvas.width = xres;
    this.mCanvas.height = yres;

    this.draw();
}

Grapher.prototype.notOnBlackList = function(formula)
{
    if( formula.length > 256 )
    {
        alert("Formula is too long...");
        return false;
    }

    var lowFormula = formula.toLowerCase();
    for( var n=0; n<this.blackList.length; n++ )
    {
        if( lowFormula.indexOf(this.blackList[n]) != -1 )
        {
            alert("Syntax error");
            return false;
        }
    }
    return true;
}

// number of decimals chosen to match pixel precission
Grapher.prototype.getPrecision = function()
{
    return 1+Math.floor(  Math.log(this.mXres/(this.mRx*2.0))/Math.log(10.0) );
}

Grapher.prototype.drawGraph = function(formula,mycolor)
{
    this.mContext.strokeStyle = mycolor;
    this.mContext.lineWidth = 1.5;

    var oldBadNum = true;

    this.mContext.beginPath();
    for( var i = 0; i <this.mXres; i++ )
    {
        var x = this.mCx + this.mRx * (-1.0 + 2.0*i/this.mXres);
        var y = 0.0;

        with( Math ) { eval("y = " + formula); }

        var badNum = isNaN(y) || (y==Number.NEGATIVE_INFINITY) || (y==Number.POSITIVE_INFINITY) || (Math.abs(y)>1e6); // || (!isFinite(y))

        if( !badNum )
        {
            var j = this.mYres*(0.5 + 0.5*(this.mCy-y)/this.mRy);
            if( oldBadNum )
                this.mContext.moveTo(i, j);
            else
                this.mContext.lineTo(i, j);
        }
        oldBadNum = badNum;
    }
    this.mContext.stroke();
    this.mContext.closePath();
}

Grapher.prototype.draw = function(id)
{
    var minx = this.mCx - this.mRx;
    var maxx = this.mCx + this.mRx;
    var miny = this.mCy - this.mRy;
    var maxy = this.mCy + this.mRy;

    // axes
    var ctx = this.mContext;
    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, this.mXres, this.mYres);
    if( this.mShowAxes )
    {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        var xPos = this.mXres*(0-minx)/(this.mRx*2.0);
        var yPos = this.mYres*(1.0-(0-miny)/(this.mRy*2.0));
        ctx.beginPath(); ctx.moveTo(xPos, 0); ctx.lineTo(xPos, this.mYres); ctx.stroke(); ctx.closePath();
        ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(this.mXres,  yPos); ctx.stroke(); ctx.closePath();
    }

    this.drawGraph(this.formula, '#ffc040');

    // graphs
    /*if( document.getElementById('draw1').checked ) { var formula1 = document.getElementById('formula1').value; if (this.notOnBlackList(formula1) == true) this.drawGraph(formula1,'#ffc040'); }
    if( document.getElementById('draw2').checked ) { var formula2 = document.getElementById('formula2').value; if (this.notOnBlackList(formula2) == true) this.drawGraph(formula2,'#ffffa0'); }
    if( document.getElementById('draw3').checked ) { var formula3 = document.getElementById('formula3').value; if (this.notOnBlackList(formula3) == true) this.drawGraph(formula3,'#a0ffc0'); }
    if( document.getElementById('draw4').checked ) { var formula4 = document.getElementById('formula4').value; if (this.notOnBlackList(formula4) == true) this.drawGraph(formula4,'#40c0ff'); }
    if( document.getElementById('draw5').checked ) { var formula5 = document.getElementById('formula5').value; if (this.notOnBlackList(formula5) == true) this.drawGraph(formula5,'#d0a0ff'); }
    if( document.getElementById('draw6').checked ) { var formula6 = document.getElementById('formula6').value; if (this.notOnBlackList(formula6) == true) this.drawGraph(formula6,'#ff80c0'); }
*/
    // guides
    if( this.mShowGuides )
    {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px arial';

        var n = this.getPrecision()
        for( i=0; i<11; i++ )
        {
             var x = minx + 2.0*this.mRx*i/10.0;
             var ix = this.mXres*i/10;
             ctx.beginPath(); ctx.moveTo(ix, this.mYres); ctx.lineTo(ix, this.mYres-12); ctx.stroke(); ctx.closePath();
             ctx.fillText(x.toFixed(n), ix + 4, this.mYres - 2);
        }
        for( i=0; i<11; i++ )
        {
             var y = maxy - 2.0*this.mRy*i/10.0;
             var iy = this.mYres*i/10;
             ctx.beginPath(); ctx.moveTo(0, iy); ctx.lineTo(12, iy); ctx.stroke(); ctx.closePath();
             ctx.fillText(y.toFixed(n), 2, iy + 10 );
        }

    }
}

Grapher.prototype.mouseDown = function(e)
{
    if(!e) var e = window.event;
    if( this.mRangeType!=2 ) return;

    if( (e.button==0) && (e.shiftKey==false) )
        this.mMouseFunction = 1;
    else
        this.mMouseFunction = 2;
    this.mRefCx = this.mCx;
    this.mRefCy = this.mCy;
    this.mRefRx = this.mRx;
    this.mRefRy = this.mRy;
    this.mRefMouseX = e.clientX;
    this.mRefMouseY = e.clientY;
}

Grapher.prototype.mouseUp = function(e)
{
    this.mMouseFunction = 0;
}

Grapher.prototype.mouseMove = function(e)
{
    if(!e) var e = window.event;

    if( this.mMouseFunction==0 )
    {
        var obj = this.mCanvas; var xo = yo = 0; do { xo += obj.offsetLeft; yo += obj.offsetTop; }while (obj = obj.offsetParent);
        var mousex = e.clientX - xo
        var mousey = e.clientY - yo;
        var x = this.mCx + 2.0*this.mRx*((mousex/this.mXres)-0.5);
        var y = this.mCy - 2.0*this.mRy*((mousey/this.mYres)-0.5);
        var n = this.getPrecision()
        document.getElementById('myCoords').innerHTML = '(' + x.toFixed(n) + ', ' + y.toFixed(n) + ')';
    }

    if( this.mRangeType!=2 ) return;

   if( this.mMouseFunction==1 )
    {
        this.mCx = this.mRefCx - (e.clientX - this.mRefMouseX) * 2.0*this.mRx / this.mXres;
        this.mCy = this.mRefCy + (e.clientY - this.mRefMouseY) * 2.0*this.mRy / this.mYres;
        this.draw();
    }
    else if( this.mMouseFunction==2 )
    {
        var scale = Math.pow(0.99, (e.clientX - this.mRefMouseX));
        this.mRx = this.mRefRx * scale;
        this.mRy = this.mRefRy * scale;
        this.draw();
    }
}