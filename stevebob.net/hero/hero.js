
document.onkeydown = keyPressHandle;
document.onkeyup = keyUpHandle;
document.onmousemove = updateMousePos;

//Interface Variables
var settingsVis = 1;
var infoView = 0;

//Environment Variables
var count = 20000;
var size = 1;
var stepSize = 32;

var opacity = 0.5;

var sprWidth = 1;
var sprHeight = 1;

var onScreen = 1;

var oneHero = 0;
var oneVillain = 0;

var hInj = 0;
var vInj = 0;

var hvd = 1;
var vhd = 1;
var hhd = 0;
var vvd = 0;

var advanced = 0;

var fadeRate = 0.9;

var follow = 0;

//Other Globals

var winH, winW;
var drawArea;
var ctx;

var t;

var mouseX;
var mouseY;

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
    readVals();
    writeVals();
    makeUnits();
    assign();
    play();

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

function clear() {
    ctx.fillStyle = "rgba(0, 0, 0, "+fadeRate+")";
    ctx.beginPath();
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}

function drawUnits() {
    
    ctx.fillStyle="rgba(255, 255, 255, "+opacity+")";
    ctx.beginPath();

    for (var i=0;i<count;i++) {
        ctx.fillRect(unit[i].x-size/2, unit[i].y-size/2, size, size);
    }

    ctx.fill();
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


function step(n) {
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

function applyStep(n) {

    if ((unit[n].nx > 0 && unit[n].nx < winW) || onScreen == 0 ) {
        unit[n].x = unit[n].nx;
    }


    if ((unit[n].ny > 0 && unit[n].ny < winH) || onScreen == 0) {
        unit[n].y = unit[n].ny;
    }
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
    var scFact = scaleFactor(n);
    var targ = new point();

    targ.x = unit[unit[n].villain].x + scFact*(unit[unit[n].hero].x - unit[unit[n].villain].x);
    targ.y = unit[unit[n].villain].y + scFact*(unit[unit[n].hero].y - unit[unit[n].villain].y);
    

    return targ;
}
        


function scaleFactor(n) {

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
    writeVals();
    makeUnits();
    assign();
    started = 1;
    play();
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

function updateMousePos() {
    var mousePos = getPosition();

    mouseX = mousePos.x;
    mouseY = mousePos.y;

    if (started && follow) {
        unit[1].x = mouseX;
        unit[1].y = mouseY;
    }
}

function getPosition(e) {
    e = e || window.event;
    var cursor = {x:0, y:0};
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    } 
    else {
        cursor.x = e.clientX + 
            (document.documentElement.scrollLeft || 
            document.body.scrollLeft) - 
            document.documentElement.clientLeft;
        cursor.y = e.clientY + 
            (document.documentElement.scrollTop || 
            document.body.scrollTop) - 
            document.documentElement.clientTop;
    }
    return cursor;
}


//Interface Stuff!!

function writeVals() {
    document.getElementById("dotcount").value = count;
    document.getElementById("dotsize").value = size;
    document.getElementById("accuracy").value = stepSize;
    document.getElementById("dotopacity").value = opacity*100;
    document.getElementById("dotwpercent").value = sprWidth*100;
    document.getElementById("dothpercent").value = sprHeight*100;

    document.getElementById("xborders").checked = onScreen;
    document.getElementById("follow").checked = follow;
    document.getElementById("onehero").checked = oneHero;
    document.getElementById("onevillain").checked = oneVillain;
    document.getElementById("hvd").checked = hvd;
    document.getElementById("vhd").checked = vhd;
    document.getElementById("hhd").checked = hhd;
    document.getElementById("vvd").checked = vvd;
    document.getElementById("hinj").checked = hInj;
    document.getElementById("vinj").checked = vInj;
}

function readVals() {
    
    var tmp;

    
    tmp = parseInt(document.getElementById("dotcount").value);

    if (tmp >= 3 && tmp < 1000000) {
        count = tmp;
    }


    tmp = parseInt(document.getElementById("dotsize").value);

    if (tmp >= 1) {
        size = tmp;
    }

    tmp = parseFloat(document.getElementById("accuracy").value);
    
    if (tmp > 0) {
        stepSize = tmp;
    }
    

    tmp = parseFloat(document.getElementById("dotopacity").value);

    if (tmp >= 0 && tmp <= 100) {
        opacity = tmp/100;
    }

    tmp = parseFloat(document.getElementById("dotwpercent").value);

    if (tmp >= 0 && tmp <= 100) {
        sprWidth = tmp/100;
    }

    tmp = parseFloat(document.getElementById("dothpercent").value);

    if (tmp >= 0 && tmp <= 100) {
        sprHeight = tmp/100;
    }

    onScreen = boolInt(document.getElementById("xborders").checked);
    follow = boolInt(document.getElementById("follow").checked);
    
    
    oneHero = boolInt(document.getElementById("onehero").checked);
    oneVillain = boolInt(document.getElementById("onevillain").checked);
    hvd = boolInt(document.getElementById("hvd").checked);
    vhd = boolInt(document.getElementById("vhd").checked);
    hhd = boolInt(document.getElementById("hhd").checked);
    vvd = boolInt(document.getElementById("vvd").checked);
    hInj = boolInt(document.getElementById("hinj").checked);
    vInj = boolInt(document.getElementById("vinj").checked);
}


function boolInt(bool) {
    if (bool) {
        return 1;
    } else {
        return 0;
    }
}

function shInfo() {

    if (infoView) {
        infoView = 0;
        document.getElementById("desc").style.display = "none";
        document.getElementById("what").innerHTML = "what is this?";
        document.getElementById("ctrlin").style.top = "50px";
    } else {
        infoView = 1;
        document.getElementById("desc").style.display = "";
        document.getElementById("what").innerHTML = "what this is:";
        document.getElementById("ctrlin").style.top = "300px";
    }

}








