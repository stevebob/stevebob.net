
document.onkeydown = keyPressHandle;
document.onmousemove = updateMousePos;


var count = 512;

var winH, winW;
var drawArea;
var ctx;

var t;

var mouseX;
var mouseY;

var accuracy = 8;
var jump = 4;

var dot = [];

var shape = 1;

function point() {
    this.x;
    this.y;

    this.size;
}

function pointList() {
    this.p = [];
    this.count;
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

function makeDots() {


    for (var i=0;i<count;i++) {
        dot[i] = new point();
        dot[i].x = Math.random() * winW - winW/2;
        dot[i].y = Math.random() * winH - winH/2;
        dot[i].size = 2;
    }

}

function moveAll(speed) {
    for (var j = 0;j<speed;j++) {

        for (var i = 0;i<count;i++) {
            var tmp = new point();
            tmp = guess(dot[i]);
            dot[i].x = tmp.x;
            dot[i].y = tmp.y;
        }
    }
}

function guess(p) {
    var guesses = new pointList();
    guesses.count = accuracy;
    for (var i = 0;i<accuracy;i++) {
        var an = Math.random() * Math.PI * 2;
        guesses.p[i] = new point;
        guesses.p[i].x = jump * Math.cos(an) + p.x;
        guesses.p[i].y = jump * Math.sin(an) + p.y;
    }

    return guesses.p[bestGuess(guesses)];
}

function bestGuess(g) {
    var min = 0;
    var best = -1;

    for (var i = 0;i<g.count;i++) {
        var dist = shapeDist(g.p[i], shape);
     if (dist < min || best == -i) {
            min = dist;
            best = i;
        }
    }
    return best;
}

function randomChange() {
    shape = Math.floor(Math.random()*3);
}


function shapeDist(p, s) {
    var dist = 0;

    if (s==1) {
        dist = Math.abs(power((power(p.x, 2) + power(p.y, 2) - 10000), 3) - 100*power(p.x, 2)*power(p.y, 3));
    } else if (s==2) {
        dist = Math.abs(power(p.x, 2) + power(p.y, 2)-10000);
    }

    return dist;
}

function power(base, index) {
    var answer = 1;
    for (var i = 0;i<index;i++) {
        answer *= base;
    }
    return answer;
}

function drawDots() {
    
    ctx.fillStyle="rgba(255, 255, 255, "+1+")";

    ctx.beginPath();
    
    for (var i=0;i<count;i++) {
        //alert(winH/2-dot[i].y);
        ctx.arc(dot[i].x + winW/2, winH/2 - dot[i].y, dot[i].size, 0, Math.PI*2, true);
        ctx.closePath();

    }
    
    ctx.fill();

}

function moveDots() {
    clear();
    drawDots();
    moveAll(1);

    t = setTimeout(moveDots, 1);

}


function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    
    updateDimensions();
    makeDots();

    moveDots();
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

function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
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

