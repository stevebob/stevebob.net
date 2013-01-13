
document.onkeydown = keyPressHandle;
document.onmousemove = updateMousePos;


var count = 256;
var maxWt = 100;


var winH, winW;
var drawArea;
var ctx;

var t;

var mouseX;
var mouseY;

var part = [];

var gCon = 20000;

var zoom = 1;
var psZoom = 1;

var centreX = 0;
var centreY = 0;

function point() {
    this.x;
    this.y;
    this.wt;
    this.exists;

    this.xVel;
    this.yVel;
}

function polar() {
    this.rad;
    this.an;
}

function clear() {
    ctx.fillStyle = "rgba(0, 0, 0, "+1+")";
    ctx.beginPath();
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}

function makeParts() {


    for (var i=0;i<count;i++) {
        part[i] = new point();
        part[i].x = (Math.random() * winW - winW/2)*2;
        part[i].y = (Math.random() * winH - winH/2)*2;
        part[i].wt = Math.random()*1;
        part[i].exists = 1;
        part[i].xVel = 0;
        part[i].yVel = 0;
    }

}


function updateVels() {
    for (var i = 0;i<count - 1;i++) {
        if (part[i].exists) {
            for (var j = i+1;j<count;j++) {
                if (part[j].exists) {
                    var pol = new polar();

                    pol = polarAtoB(part[i], part[j]);

                    var xTmp = gCon * Math.cos(pol.an)/(pol.rad*pol.rad);
                    var yTmp = gCon * Math.sin(pol.an)/(pol.rad*pol.rad);
                    part[i].xVel += xTmp*part[j].wt;
                    part[i].yVel += yTmp*part[j].wt;
                    
                    //alert(part[0].xVel);
                    part[j].xVel -= xTmp*part[i].wt;
                    part[j].yVel -= yTmp*part[i].wt;
                }
            }
        }
    }
}

function moveAll() {
    for (var i=0;i<count;i++) {
        if (part[i].exists) {
            part[i].x += part[i].xVel;
            part[i].y += part[i].yVel;
        }
    }

}

function phy() {

    joins();
    updateVels();   
    moveAll();
    
    clear();
    drawUnits();
    
    t=setTimeout(phy, 1);

}


function polarAtoB(a, b) {

    var pair = new polar();

    var dx = a.x - b.x;
    var dy = a.y - b.y;

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


function touching(a, b) {
    var dist = Math.sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));

    return (Math.sqrt(a.wt) + Math.sqrt(b.wt)) >= dist;
}

function joins() {

    for (var i=0;i<count-1;i++) {
        if (part[i].exists) {
            for (var j = i+1;j<count;j++) {
                if (part[j].exists) {
                    if (touching(part[i], part[j])) {
                        var tmp = part[i].wt + part[j].wt;
                        part[i].xVel = tmp*(part[i].xVel/part[i].wt + part[j].xVel/part[j].wt);
                        part[i].yVel = tmp*(part[i].yVel/part[i].wt + part[j].yVel/part[j].wt);
                        part[i].wt = tmp;
                        part[j].exists = 0;
                    }
                }
            }
        }
    }

}

function grow() {
    
    var stopped = 1;

    for (var i = 0;i<count-1;i++) {
        //if (!part[i].done) {
            for (var j = i+1;j<count;j++) {
                if (touching(part[i], part[j])) {
                    part[i].done = 1;
                    part[j].done = 1;
                }
            }
        //}
    }

    for (var i = 0;i<count;i++) {
        if (!part[i].done) {
            part[i].wt++;
            stopped = 0;
        }
    }
    clear();
    drawUnits();

    //t=setTimeout(grow, 10);

    return stopped;

}

function growAll() {
    var stopped = 0;

    while (stopped == 0) {
        stopped = grow();
    }
}


function drawUnits() {
    
    ctx.fillStyle="rgba(255, 255, 255, "+1+")";

    for (var i=0;i<count;i++) {
if (part[i].exists) {
    ctx.beginPath();
        ctx.arc(part[i].x*zoom + winW/2 - centreX, part[i].y*zoom + winH/2 - centreY, Math.sqrt(part[i].wt)*zoom*psZoom, 0, Math.PI*2, true);
        ctx.closePath();

    ctx.fill();
}
    }

}


function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == 188 || keyID == 87) {
        centreY-=50;
    } else if (keyID == 79 || keyID == 83) {
        centreY+=50;
    } else if (keyID == 68 || keyID == 69) {
        centreX+=50;
    } else if (keyID ==65) {
        centreX-=50;
    } else if (keyID == 38) {
        zoom *= 1.5;
        centreX*=1.5;
        centreY*=1.5;
    } else if (keyID == 40) {
        zoom *= 0.75;
        centreX*=0.75;
        centreY*=0.75;
    } else if (keyID == 37) {
        psZoom*=0.75;
    } else if (keyID == 39) {
        psZoom*=1.5;
    }

}


function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    
    updateDimensions();
    makeParts();

    phy();
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

}

function updateMousePos() {
    var mousePos = getPosition();

    mouseX = mousePos.x;
    mouseY = mousePos.y;

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

