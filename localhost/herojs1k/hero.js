function dp(v,w){return v.x*w.x+v.y*w.y}
function md(v){return Math.sqrt(dp(v,v))}
function sq(x){return x*x}
function ad(v,w){return{x:v.x+w.x,y:v.y+w.y}}
function sm(v,s){return{x:v.x*s,y:v.y*s}}
function mi(v,w){return ad(v,sm(w,-1))}
function pr(v,w){return sm(v,dp(v,w)/sq(md(w)||1))}
function sc(v,l){return sm(sm(v,1/md(v)),l)}


var count = 2000;
var stepSize = 16;

var opacity = 0.5;

var fadeRate = 0.9;
var winH, winW;
var drawArea;
var ctx;

var unit = [];

var started = 0;

function point() {
    this.x;
    this.y;
    this.nx;
    this.ny;
    this.hero;
    this.villain;
}

function polar() {
    this.rad;
    this.an;
}

function start() {
    makeUnits();
    assign();
    play();

}
function _start() {
    _makeUnits();
    _assign();
    _play();
}
function makeUnits() {
    
    var wdiv = 1/sprWidth;
    var hdiv = 1/sprHeight;

    for (var i=0;i<count;i++) {
        unit[i] = new point();
        unit[i].x = Math.random() * winW/wdiv + winW/2 - winW/(2*wdiv);
        unit[i].y = Math.random() * winH/hdiv + winH/2 - winH/(2*hdiv);
        unit[i].hero = i;
        unit[i].villain = i;
    }
}

function _makeUnits() {
    for(var i=0;i<count;i++) {
        unit[i]={x:Math.random()*winW,y:Math.random()*winH};
    }
}

function clear() {
    c.fillStyle = "rgba(0, 0, 0, "+fadeRate+")";
    c.beginPath();
    c.fillRect(0, 0, winW, winH);
    c.fill();
}

function drawUnits() {
    
    c.fillStyle="rgba(255, 255, 255, "+opacity+")";
    c.beginPath();

    for (var i=0;i<count;i++) {
        c.fillRect(unit[i].x-size/2, unit[i].y-size/2, size, size);
    }

    c.fill();
}
function _drawUnits() {
    ctx.fillStyle="rgba(255, 255, 255, "+opacity+")";
    cx.beginPath();
    unit.map(function(q){ctx.fillRect(q.x,q.y,1,1)});
    c.fill();
}   

function assign() {
    
    for (var i=0;i<count;i++) {
        
        if (oneHero) {
            unit[i].hero = 0;
        }
        while (unit[i].hero == i || (oneVillain && unit[i].hero == 1)) {
            unit[i].hero = Math.floor(Math.random()*count);
            if (hInj) {
                if (unit[unit[i].hero].villain != unit[i].hero) {
                    unit[i].villain = unit[unit[i].hero].villain;
                }
            }
        }

        if (hvd) {
            unit[unit[i].hero].villain = i;
        }
        if (hhd) {
            unit[unit[i].hero].hero = i;
        }

        if (oneVillain) {
            unit[i].villain = 1;
        }
        while (unit[i].villain == i || unit[i].villain == unit[i].hero) {
            unit[i].villain = Math.floor(Math.random()*count);
            if (vInj) {
                if (unit[unit[i].villain].hero != unit[i].villain) {
                    unit[i].hero = unit[unit[i].villain].hero;
                }
            }
        }
        if (vhd) {
            unit[unit[i].villain].hero = i;
        }
        if (vvd) {
            unit[unit[i].villain].villain = i;
        }

    }
}

function _assign() {
    for(var i in unit){
        while(!unit[i].hero)
            unit[i].hero = unit[Math.floor(Math.random()*count)];
        unit[i].hero.villain = unit[i];
        while(!unit[i].villain)
            unit[i].villain = unit[Math.floor(Math.random()*count)];
        unit[i].villain.hero = unit[i];
    }
}


function showHV() {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle="rgba(0, 100, 255, 0.5)";
    for (var i=0;i<count;i++) {
        ctx.moveTo(unit[unit[i].hero].x, unit[unit[i].hero].y);
        ctx.lineTo(unit[i].x, unit[i].y);
    }

    ctx.stroke();

    ctx.beginPath();
    
    ctx.lineWidth = 1;
    ctx.strokeStyle="rgba(200, 50, 0, 0.5";
    for (var i=0;i<count;i++) {
        ctx.moveTo(unit[i].x, unit[i].y);
    ctx.strokeStyle="red";
        ctx.lineTo(unit[unit[i].villain].x, unit[unit[i].villain].y);
    }

    ctx.stroke();
}

function play() {

    
    var eq = 1;
    clear();
    drawUnits();
    //showHV();
    
    for (var i=0;i<count;i++) {
        if ((i!=1 || !follow) && step(i) == 1) {
            eq = 0;
        }
    }
    for (var i=0;i<count;i++) {
        applyStep(i);
    }

    if (eq && (!follow)) {
        clearTimeout(t);
    } else {
        t=setTimeout(play, 1);
    }

}

function _play() {
    clear();
    _drawUnits();
    unit.map(_step);
    unit.map(_applyStep);
    setTimeout(_play,1);
}

function __step(n) {
    var pair = angleToTarget(n);
    var an = pair.an;
    var change;
    if (pair.rad > stepSize) {
        unit[n].nx = unit[n].x + stepSize*Math.cos(an);
        unit[n].ny = unit[n].y + stepSize*Math.sin(an);
        change = 1;
    } else {
        unit[n].nx = unit[n].x;
        unit[n].ny = unit[n].y;
        change = 0;
    }
    return change;
}

function _step(q) {
//    var t=pr(mi(unit[n],unit[unit[n].villain]),
//             mi(unit[unit[n].hero], unit[unit[n].villain]));
    var t=_target(q); // compute (the projection of n-v onto h-v) + v
    var to_t=mi(t,q); // the vector from self to target
    if(md(to_t)>stepSize){ // if the target is further away than the step size
        var move=sc(to_t,stepSize); // vector from where we are to where we'll be
        var dest=ad(q,move); // absolute location of where we'll be
        q.nx=dest.x;
        q.ny=dest.y;
        return 1;
    } else {
        q.nx = q.x;
        q.ny = q.y;
        return 0;
    }
}

function step(n) {
//    var t=pr(mi(unit[n],unit[unit[n].villain]),
//             mi(unit[unit[n].hero], unit[unit[n].villain]));
    var q = unit[n];
    var t=target(n); // compute (the projection of n-v onto h-v) + v
    var to_t=mi(t,q); // the vector from self to target
    if(md(to_t)>stepSize){ // if the target is further away than the step size
        var move=sc(to_t,stepSize); // vector from where we are to where we'll be
        var dest=ad(q,move); // absolute location of where we'll be
        q.nx=dest.x;
        q.ny=dest.y;
        return 1;
    } else {
        q.nx = q.x;
        q.ny = q.y;
        return 0;
    }
}

//function step(n){return _step(unit[n])}

function applyStep(n) {

    if ((unit[n].nx > 0 && unit[n].nx < winW) || onScreen == 0 ) {
        unit[n].x = unit[n].nx;
    }


    if ((unit[n].ny > 0 && unit[n].ny < winH) || onScreen == 0) {
        unit[n].y = unit[n].ny;
    }
}

function _applyStep(q){
    if(q.nx>0&&q.nx<winW)q.x=q.nx;
    if(q.ny>0&&q.ny<winW)q.y=q.ny;
}


function angleToTarget(n) {

    var targ = target(n);


    var pair = new polar();

    var dx = unit[n].x - targ.x;
    var dy = unit[n].y - targ.y;

    var local = Math.atan(Math.abs(dy/dx));

    var ind = dx*dy;

    var locSign;
    var piMul;

    if (ind > 0) {
        locSign = 1;
    } else {
        locSign = -1;
    }

    if (dx > 0) {
        piMul = -1 * locSign;
    } else {
        piMul = 0;
    }
    
    

    pair.an = Math.PI * piMul + local * locSign;
    pair.rad = Math.sqrt(dx*dx + dy*dy);

    return pair;
}

function target(n) {
    return ad(unit[unit[n].villain], sm(mi(unit[unit[n].hero],unit[unit[n].villain]),scaleFactor(n)));
}
function _target(q){
    return ad(q.villain,sm(mi(q.hero,q.villain),_scaleFactor(q)));
}
        
function scaleFactor(n) {
    var a = mi(unit[unit[n].hero],unit[unit[n].villain]);
    var b = mi(unit[n],unit[unit[n].villain]);
    var s = dp(a,b)/dp(a,a);
    var r = md(a);
    r=(r+2)/r;
    return s<r?r:s;
}

function _scaleFactor(q) {
    var h = mi(q.hero,q.villain);
    var n = mi(q,q.villain);
    var s = dp(h,n)/dp(h,h);
    var r = md(h);
    r=(r+2)/r;
    return s<r?r:s;

}

function __scaleFactor(n) {

    var dY = unit[unit[n].hero].y - unit[unit[n].villain].y;
    var dX = unit[unit[n].hero].x - unit[unit[n].villain].x;

    var unitY = unit[n].y - unit[unit[n].villain].y;
    var unitX = unit[n].x - unit[unit[n].villain].x;

    var dot = unitX*dX + unitY*dY;

    var scFact = dot/(dX*dX+dY*dY);

    var r = Math.sqrt(dX*dX + dY*dY);
    var maxDist = 2;
    if (scFact < (r+maxDist)/r) {
        scFact = (r+maxDist)/r;
    }

    return scFact;
}

function shSettings() {
    if (settingsVis == 0) {
        document.getElementById("ctrl").style.display = "none";
    } else {
        document.getElementById("ctrl").style.display = "";
    }
}

function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == 83) {
        settingsVis = 1-settingsVis;
        shSettings();
    } else if (keyID == 82) {
        start();
    }
        

}

function keyUpHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == 38) {
        up = 0;
    } else if (keyID == 40) {
        down = 0;
    }
}

function setUpCanvas() {
    
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }

    updateDimensions();
    _makeUnits();
    _assign();
    started = 1;
    _play();
}


function updateDimensions() {
    if (parseInt(navigator.appVersion)>3) {
        if (navigator.appName=="Netscape") {
            winH = window.innerHeight;
            winW = window.innerWidth;
        }
        if (navigator.appName.indexOf("Microsoft")!=-1) {
            winH = document.body.offsetHeight;
            winW = document.body.offsetWidth;
        }
    }
    
    drawArea.height = winH;
    drawArea.width = winW;

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.beginPath();
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
    if (started) {
        drawUnits();
    }
    
}

