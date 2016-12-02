
var captureMousePos = function (ev) {
    if (!ev.touches.length)
        return;
    var touch = ev.touches[0];
    ev.button = 0;
    ev.clientX = touch.clientX;
    ev.clientY = touch.clientY;
    return 1;
}

function Grapher(canvas) {
    this.mCanvas = canvas;
    this.initSize();
    this.mContext = this.mCanvas.getContext('2d');

    this.mXres = this.mCanvas.width = this.mCanvas.clientWidth;
    this.mYres = this.mCanvas.height = this.mCanvas.clientHeight;

    this.mMouseFunction = 0;

    // ripped from Ed Mackey
    this.blackList = ["=", "[", "]", "'", ";", "new", "ml", "$", ").", "alert", "ook", "ipt", "doc",
        "win", "set", "get", "tim", "net", "post", "black", "z"];

    this.mCx = 0.0;
    this.mCy = 0.0;
    this.mRx = 12.0;
    this.mRy = this.mRx * this.mYres / this.mXres;
    this.mRangeType = 2; // free
    this.mShowAxes = true;
    this.mShowGuides = true;

    this.formula = "x";
    this.draw();
}

Grapher.prototype.toggleShowGuides = function () {
    this.mShowGuides = !this.mShowGuides;
    this.draw();
}

Grapher.prototype.toggleShowAxes = function () {
    this.mShowAxes = !this.mShowAxes;
    this.draw();
}

Grapher.prototype.setRange = function (val) {

    if (val == 0) {
        this.mCx = 0.5;
        this.mCy = 0.5;
        this.mRx = 0.5;
        this.mRy = 0.5;
    }
    else if (val == 1) {
        this.mCx = 0.0;
        this.mCy = 0.0;
        this.mRx = 1.0;
        this.mRy = 1.0;
    }
    else {
        this.mCx = 0.0;
        this.mCy = 0.0;
        this.mRx = 12.0;
        this.mRy = this.mRx * this.mYres / this.mXres;
    }

    this.mRangeType = val;
    this.draw();
}

Grapher.prototype.setSize = function (val) {
    var xres = 640;
    var yres = 480;

    if (val == 0) {
        xres = 640;
        yres = 480;
    }
    else if (val == 1) {
        xres = 960;
        yres = 720;
    }
    else {
        xres = 1280;
        yres = 960;
    }

    this.mXres = xres;
    this.mYres = yres;
    this.mCanvas.width = xres;
    this.mCanvas.height = yres;

    this.draw();
}

Grapher.prototype.notOnBlackList = function (formula) {
    if (formula.length > 256) {
        alert("Formula is too long...");
        return false;
    }

    var lowFormula = formula.toLowerCase();
    for (var n = 0; n < this.blackList.length; n++) {
        if (lowFormula.indexOf(this.blackList[n]) != -1) {
            alert("Syntax error");
            return false;
        }
    }
    return true;
}

// number of decimals chosen to match pixel precission
Grapher.prototype.getPrecision = function () {
    return 1 + Math.floor(Math.log(this.mXres / (this.mRx * 2.0)) / Math.log(10.0));
}

Grapher.prototype.drawGraph = function (formula, mycolor) {
    this.mContext.strokeStyle = mycolor;
    this.mContext.lineWidth = 1.5;

    var oldBadNum = true;

    this.mContext.beginPath();
    for (var i = 0; i < this.mXres; i++) {
        var x = this.mCx + this.mRx * (-1.0 + 2.0 * i / this.mXres);
        var y = 0.0;

        with (Math) { eval("y = " + formula); }

        var badNum = isNaN(y) || (y == Number.NEGATIVE_INFINITY) || (y == Number.POSITIVE_INFINITY) || (Math.abs(y) > 1e6); // || (!isFinite(y))

        if (!badNum) {
            var j = this.mYres * (0.5 + 0.5 * (this.mCy - y) / this.mRy);
            if (oldBadNum)
                this.mContext.moveTo(i, j);
            else
                this.mContext.lineTo(i, j);
        }
        oldBadNum = badNum;
    }
    this.mContext.stroke();
    this.mContext.closePath();
}

Grapher.prototype.draw = function (id) {
    var minx = this.mCx - this.mRx;
    var maxx = this.mCx + this.mRx;
    var miny = this.mCy - this.mRy;
    var maxy = this.mCy + this.mRy;

    // axes
    var ctx = this.mContext;
    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, this.mXres, this.mYres);
    if (this.mShowAxes) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        var xPos = this.mXres * (0 - minx) / (this.mRx * 2.0);
        var yPos = this.mYres * (1.0 - (0 - miny) / (this.mRy * 2.0));
        ctx.beginPath(); ctx.moveTo(xPos, 0); ctx.lineTo(xPos, this.mYres); ctx.stroke(); ctx.closePath();
        ctx.beginPath(); ctx.moveTo(0, yPos); ctx.lineTo(this.mXres, yPos); ctx.stroke(); ctx.closePath();
    }

    this.drawGraph(this.formula, '#a0ffc0');

    // guides
    if (this.mShowGuides) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '10px arial';
        ctx.textAlign = 'left';

        var n = this.getPrecision()
        for (i = 0; i < 11; i++) {
            var x = minx + 2.0 * this.mRx * i / 10.0;
            var ix = this.mXres * i / 10;
            ctx.beginPath(); ctx.moveTo(ix, this.mYres); ctx.lineTo(ix, this.mYres - 12); ctx.stroke(); ctx.closePath();
            ctx.fillText(x.toFixed(n), ix + 4, this.mYres - 2);
        }

        ctx.textAlign = 'right';
        for (i = 0; i < 11; i++) {
            var y = maxy - 2.0 * this.mRy * i / 10.0;
            var iy = this.mYres * i / 10;
            ctx.beginPath(); ctx.moveTo(this.mXres, iy); ctx.lineTo(this.mXres-12, iy); ctx.stroke(); ctx.closePath();
            ctx.fillText(y.toFixed(n), this.mXres-2, iy + 10);
        }

    }
}

Grapher.prototype.mouseDown = function (e) {
    if (!e) var e = window.event;
    if (this.mRangeType != 2) return;

    if ((e.button == 0) && (e.shiftKey == false))
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

Grapher.prototype.mouseUp = function (e) {
    this.mMouseFunction = 0;
}

Grapher.prototype.mouseMove = function (e) {
    if (!e) var e = window.event;

    if (this.mMouseFunction == 0) {
        var obj = this.mCanvas; var xo = yo = 0;
        do { xo += obj.offsetLeft; yo += obj.offsetTop; }
        while (obj = obj.offsetParent);
        var mousex = e.clientX - xo
        var mousey = e.clientY - yo;
        var x = this.mCx + 2.0 * this.mRx * ((mousex / this.mXres) - 0.5);
        var y = this.mCy - 2.0 * this.mRy * ((mousey / this.mYres) - 0.5);
        var n = this.getPrecision()
        // document.getElementById('myCoords').innerHTML = '(' + x.toFixed(n) + ', ' + y.toFixed(n) + ')';
    }

    if (this.mRangeType != 2) return;

    if (this.mMouseFunction == 1) {
        this.mCx = this.mRefCx - (e.clientX - this.mRefMouseX) * 2.0 * this.mRx / this.mXres;
        this.mCy = this.mRefCy + (e.clientY - this.mRefMouseY) * 2.0 * this.mRy / this.mYres;
        this.draw();
    }
    else if (this.mMouseFunction == 2) {
        var scale = Math.pow(0.99, (e.clientX - this.mRefMouseX));
        this.mRx = this.mRefRx * scale;
        this.mRy = this.mRefRy * scale;
        this.draw();
    }
}

//移动端 pan
Grapher.prototype.touchstart = function(){
    this.mRefCx = this.mCx;
    this.mRefCy = this.mCy;
}
Grapher.prototype.mPan = function(ev){
    var dx = ev.deltaX,dy = ev.deltaY;
    this.mCx = this.mRefCx - dx * 2.0 * this.mRx / this.mXres;
    this.mCy = this.mRefCy + dy * 2.0 * this.mRy / this.mYres;
    this.draw();
}

Grapher.prototype.mScaleStart = function(){
    this.mRefRx = this.mRx;
    this.mRefRy = this.mRy;
};

//移动端 scale
Grapher.prototype.mScale = function(ev){
    var scale = ev.scale;
    this.mRx = this.mRefRx / scale;
    this.mRy = this.mRefRx / scale;
    this.draw();
}

Grapher.prototype.initSize = function(){
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.mCanvas.setAttribute('width', w);
    this.mCanvas.setAttribute('height', h);
}

module.exports = Grapher;

