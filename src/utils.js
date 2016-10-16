function sign(x)
{
    if( x>0.0 ) x=1.0; else x=-1.0;
    return x;
}
function smoothstep(a,b,x)
{
    if( x<a ) return 0.0;
    if( x>b ) return 1.0;
    var y = (x-a)/(b-a);
    return y*y*(3.0-2.0*y);
}
function clamp(x,a,b)
{
    if( x<a ) return a;
    if( x>b ) return b;
    return x;
}
function radians(degrees)
{
     return degrees*Math.PI/180.0;
}
function inversesqrt(x)
{
     return 1.0/Math.sqrt(x);
}
function degrees(radians)
{
     return radians*180.0/Math.PI;
}

function step(a,x)
{
    if( x<a ) return 0.0;
    else      return 1.0;
}
function mix(a,b,x)
{
    return a + (b-a)*Math.min(Math.max(x,0.0),1.0);
}
function over(x,y)
{
    return 1.0 - (1.0-x)*(1.0-y);
}
function tri(a,x)
{
    x = x / (2.0*Math.PI);
    x = x % 1.0;
    if( x<0.0 ) x = 1.0+x;
    if(x<a) x=x/a; else x=1.0-(x-a)/(1.0-a);
    return -1.0+2.0*x;
}
function sqr(a,x)
{
    if( Math.sin(x)>a ) x=1.0; else x=-1.0;
    return x;
}

function grad(n, x)
{
    n = (n << 13) ^ n;
    n = (n * (n * n * 15731 + 789221) + 1376312589);
    var res = x;
    if( n & 0x20000000 ) res = -x;
    return res;
}

function noise(x)
{
    var i = Math.floor(x);
    var f = x - i;
    var w = f*f*f*(f*(f*6.0-15.0)+10.0);
    var a = grad( i+0, f+0.0 );
    var b = grad( i+1, f-1.0 );
    return a + (b-a)*w;
}

function cellnoise(x)
{
    var n = Math.floor(x);
    n = (n << 13) ^ n;
    n = (n * (n * n * 15731 + 789221) + 1376312589);
    n = (n>>14) & 65535;
    return n/65535.0;
}
function frac(x)
{
    return x - Math.floor(x);
}