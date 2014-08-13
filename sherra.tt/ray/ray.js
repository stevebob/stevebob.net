document.onmousemove = handleMove;
//document.onmousedown = handlePress;
//document.onmouseup = handleRelease;

document.onkeydown = keyPressHandle;
document.onkeyup = keyUpHandle;


var drawArea;
var ctx;

var winW;
var winH;

var mouseX;
var mouseY;

var world = [];
var lineCount = 0;

var up = 0;
var left = 0;

var xVel = 0;
var yVel = 0;

var lookAn = 0;//getLookAn();

var eye = new point();

var fov = Math.PI/2;

var last = new point();

var init = 1;

var sunLock = 0;

var drawD = 200;

var zombie = [];
var zCount = 0;

var moveT;
var zT;

function zom() {
    this.pt = new point();
    this.st;
    this.xVel;
    this.yVel;
    this.speed = 2;
    this.seen;
}

function point() {
    this.x;
    this.y;
}

function ptPair() {
    this.a = new point();
    this.b = new point();
    this.type;
}

function line() {
    this.a = new point();
    this.b = new point();
}

function polar() {
    this.an;
    this.rad;
}

function rays(centre, max, jump, prec) {
    
    var ltList = [];

    ctx.beginPath();
    ctx.strokeStyle = "rgb(150, 150, 150)";
    ctx.lineWidth = 4;

    ctx.moveTo(eye.x, eye.y);

    for (var i=0;i<prec;i++) {
        var tmp = new ptPair();
        tmp = castRay(centre, max, lookAn - fov/2 + i*(fov/prec), jump);
        
        if (i==0||tmp.type == 0 || tmp.type ==2 ) {
            ctx.moveTo(tmp.b.x, tmp.b.y);
            ltList[i] = new point();
            ltList[i].x = tmp.b.x;
            ltList[i].y = tmp.b.y;
        } else {
            ctx.lineTo(tmp.a.x, tmp.a.y);
            ltList[i] = new point();
            ltList[i].x = tmp.a.x;
            ltList[i].y = tmp.a.y;
        }
    }

    ctx.moveTo(eye.x, eye.y);
    ctx.stroke();
    //ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "rgba(200, 200, 0, 0.5)";
    
    ctx.moveTo(eye.x, eye.y);

    for (var i=0;i<prec;i++) {
        ctx.lineTo(ltList[i].x, ltList[i].y);
    }

    ctx.fill();

}

function castRay(centre, max, angle, jump) {
    
    var pair = new ptPair();
    pair.type = 0;

    var next = new point();
    var end = new point();
    end.x = centre.x;
    end.y = centre.y;
    var xin = jump*Math.cos(angle);
    var yin = jump*Math.sin(angle);
    
    var ict = 0;

    for (var i=0;i<max/jump && !ict;i++) {
        next.x = end.x + xin;
        next.y = end.y + yin;
       //alert();
    /*    ctx.lineWidth=2;
        ctx.strokeStyle="green";
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      */  
        var seg = new line();
        seg.a = end;
        seg.b = next;
        
        ict = checkForIct(seg);
        if (ict == 0) {
            end.x = next.x;
            end.y = next.y;
        } else if (ict == 1) {
            pair.a = end;
            pair.type = 1;
        } else if (ict == 2) {
            pair.a = end;
            pair.type = 2;
        }
    }

    pair.b = end;

    return pair;
}

function checkForIct(p) {
    var ict = 0;
    for (var i=0;i<lineCount && !ict;i++) {
        ict = intersect(p, world[i]);
    }
    
    for (var i = 0;i<zCount && !ict;i++) {
        var dist = Math.sqrt(power(p.b.x - zombie[i].pt.x, 2) + power(p.b.y - zombie[i].pt.y, 2));
        if (dist < 10) {
            ict = 2;
            zombie[i].seen = 1;
        }
    }

    return ict;
}

function intersect(p, q) {
    
    var intersect = 0;
    var m1 = 0;
    var v1 = 0;
    var v2 = 0;
    if (p.a.x != p.b.x) {
        m1 = (p.a.y - p.b.y)/(p.a.x - p.b.x);
    } else {
        v1 = 1;
    }
    
    var m2 = 0; 
    if (q.a.x != q.b.x) {
        m2 = (q.a.y - q.b.y)/(q.a.x - q.b.x);
    } else {
        v2 = 1;
    }

    var c1 = (p.a.y - m1*p.a.x);
    var c2 = (q.a.y - m2*q.a.x);


    var icp = new point();
    if (m1 != m2 || v1+v2 < 2) {
        if (v1 ==0 && v2==0) {
            icp.x = (c2-c1)/(m1-m2);
            icp.y = m1*icp.x + c1;
        } else if (v1) {
            icp.x = p.a.x;
            icp.y = m2*icp.x + c2;
        } else if (v2) {
            icp.x = q.a.x;
            icp.y = m1*icp.x + c1;
        }

//
//ctx.fillStyle="red";
//ctx.fillRect(icp.x-2, icp.y-2, 4, 4);
//ctx.fill();
//alert(icp.x +", "+ icp.y + ", " + p.a.x + ", " + p.b.x);
        if ((inRange(icp.x, p.a.x, p.b.x) || v1==1) &&
            (inRange(icp.y, p.a.y, p.b.y) || (m1==0 && v1==0)) &&
            (inRange(icp.x, q.a.x, q.b.x) || v2==1) &&
            (inRange(icp.y, q.a.y, q.b.y) || (m2==0 && v2==0))) {
            intersect = 1;
        
        }
    }
    return intersect;
}

function inRange(x, end1, end2) {
    var ret = 0;
    if ((end1 <= end2 && end1 <= x && x <= end2) || (end2 <= end1 && end2 <= x && x <= end1)) {
        ret = 1;
    }
    return ret;
}

function addLine(lineList, ax, ay, bx, by) {

    lineList[lineCount] = new line();
    lineList[lineCount].a.x = ax;
    lineList[lineCount].a.y = ay;
    lineList[lineCount].b.x = bx;
    lineList[lineCount].b.y = by;
    lineCount++;
    
}


function drawEye() {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(eye.x, eye.y, 10, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
}

function test() {
    clear();

    drawEye();
    drawLines(world);
    rays(eye, drawD, 2, 60);
    //castRay(eye, 250, Math.PI/2, 2);
}

function makeWorld() {

    addLine(world, 100, 100, 100, 200);
    addLine(world, 100, 200, 600, 200);
    addLine(world, 600, 200, 600, 400);
    addLine(world, 600, 400, 800, 400);
    addLine(world, 800, 400, 800, 100);
    addLine(world, 800, 100, 100, 100);

}

function drawLines(lineList) {
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.lineWidth=4;
    ctx.beginPath();
    for (var i=0;i<lineCount;i++) {
        ctx.moveTo(lineList[i].a.x, lineList[i].a.y);
        ctx.lineTo(lineList[i].b.x, lineList[i].b.y);
    }
    ctx.stroke();
}

function clear() {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
}


function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    
    updateDimensions();
    makeWorld();
    makeZombies();
    drawAll();
    moveSource();
    zombieControl();
}

function restart() {

    updateDimensions();
    makeWorld();
    makeZombies();
    drawAll();
    moveSource();
    zombieControl();
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

    eye.x = 700;//winW/2;
    eye.y = 300;//winH/2;
    


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

function handleMove() {
    updateMousePos();
    lookAn = getLookAn();
    if (sunLock) {
        eye.x = mouseX;
        eye.y = mouseY;
        drawAll();
    }
}

function handlePress() {
    if (init && !overSun()) {
        init = 0;
    last.x = mouseX;
    last.y = mouseY;
    } else if (!overSun()){
        addLine(world, last.x, last.y, mouseX, mouseY);
        init=1;
        drawAll();
    last.x = mouseX;
    last.y = mouseY;
    } else {
        sunLock = 1;
    }
}

function handleRelease() {
    sunLock = 0;
}

function overSun() {
    return mouseX > eye.x - 10 && mouseX < eye.x + 10 && mouseY > eye.y - 10 && mouseY < eye.y + 10;
}



function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    
    if (keyID == 38 || keyID == 188 || keyID == 87) {
        up = 1;
    } else if (keyID == 40 || keyID == 79 || keyID == 83) {
	up = -1;    
    } else if (keyID == 39 || keyID == 68 || keyID == 69) {
	left = -1;    
    } else if (keyID == 37 || keyID ==65) {
	left = 1;    
    }

}

function keyUpHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    
    if (keyID == 38 || keyID == 188 || keyID == 87) {
        up = 0;
    } else if (keyID == 40 || keyID == 79 || keyID == 83) {
	up = 0;    
    } else if (keyID == 39 || keyID == 68 || keyID == 69) {
	left = 0;    
    } else if (keyID == 37 || keyID ==65) {
	left = 0;    
    }
}


function moveSource() {

    var inc = 0.4;

if (Math.abs(yVel) < 5) {
    yVel -= up * 1;
}

if (Math.abs(xVel) < 5) {
    xVel -= left * 1;
}
    if (!hitWall()) {
        eye.x += xVel;
        eye.y += yVel;
    }

if (up == 0 && yVel != 0) {
if (Math.abs(yVel) < inc) {
    yVel = 0;
} else {
    yVel -= (inc * yVel/Math.abs(yVel));
}}

if (left == 0 && xVel != 0) {
if (Math.abs(xVel) < inc) {
    xVel = 0;
} else {
    xVel -= (inc * xVel/Math.abs(xVel));
}}
drawAll();
    moveT = setTimeout(moveSource, 10);
}

function getLookAn() {
    var m = new point;
    //updateMousePos();
    
    m.x = mouseX;
    m.y = mouseY;
    
    var mousePol = new polar();
    mousePol = polarAtoB(eye, m);

    return mousePol.an;
}


function hitWall() {
    var tra = new line();
    tra.a.x = eye.x;
    tra.a.y = eye.y;
    tra.b.x = eye.x + xVel;
    tra.b.y = eye.y + yVel;
    var hit = 0;
    for (i=0;i<lineCount && hit == 0;i++) {
        hit = intersect(tra, world[i]);
    }
    return hit;
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



function makeZombies() {
    zombie[0] = new zom();
    zombie[0].pt.x = 150;
    zombie[0].pt.y = 150;
    zombie[0].st = 0;
    zombie[0].xVel = 1;
    zombie[0].yVel = 0;
    zombie[0].seen = 0;
    zCount = 1;
}

function hideZombies() {
    
    for (var i=0;i<zCount;i++) {
        
        zombie[i].seen = 0;

    }
}


function moveZombies() {
    


    for (var i=0;i<zCount;i++) {
        

        if (zLineOfSight(zombie[i])) {
            zombie[i].st = 1;
        } else {
            zombie[i].st = 0;
        }

        if (zombie[i].st == 0) {
        
            
        } else {
            
            var best = -1;
            var choice = 0;
            
            for (var j = 0;j<3;j++) {
                var tmpAn = Math.random()*Math.PI*2;
                var tmpLn = Math.sqrt(power(Math.cos(tmpAn)*zombie[i].speed + zombie[i].pt.x - eye.x, 2) + power(Math.sin(tmpAn)*zombie[i].speed + zombie[i].pt.y - eye.y, 2));
                if (best == -1 || tmpLn < best) {
                    best = tmpLn;
                    choice = tmpAn;
                }

            }
            
            if (!zHitWall(zombie[i], Math.cos(choice)*zombie[i].speed, Math.sin(choice)*zombie[i].speed)) {
                zombie[i].pt.x += Math.cos(choice)*zombie[i].speed;
                zombie[i].pt.y += Math.sin(choice)*zombie[i].speed;
            }

        
        }
    }
}
function power(base, index) {
    var answer = 1;
    for (var i = 0;i<index;i++) {
        answer *= base;
    }
    return answer;
}


function drawZombies() {
    for (var i=0;i<zCount;i++) {
        if (zombie[i].seen) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(zombie[i].pt.x, zombie[i].pt.y, 10, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        }
    }

    hideZombies();
}

function eatCheck() {
    var eat = 0;
    for (var i=0;i<zCount;i++) {
        if (Math.sqrt(power(zombie[i].pt.x - eye.x, 2) + power(zombie[i].pt.y - eye.y, 2))<10) {
            alert("om nom brains");
            eat = 1;
        }

    }
    return eat;
}

function zombieControl() {
    
    moveZombies();
    if (!eatCheck()) {
        zT = setTimeout(zombieControl, 10);
    } else {
        clearTimeout(zT);
        clearTimeout(moveT);
        restart();
    }
}


function drawAll() {
    clear();
    drawZombies();
    drawEye();
    //drawLines(world);
    rays(eye, drawD, 4, 20);
}


function zLineOfSight(z) {
    var sight = new line();
    sight.a.x = eye.x;
    sight.a.y = eye.y;
    sight.b.x = z.pt.x;
    sight.b.y = z.pt.y;
    var los = 0;
    for (i=0;i<lineCount && los == 0;i++) {
        los = intersect(sight, world[i]);
    }
    return !los;
}


function zHitWall(z, xDist, yDist) {
    var tra = new line();
    tra.a.x = z.pt.x;
    tra.a.y = z.pt.y;
    tra.b.x = z.pt.x + xDist;
    tra.b.y = z.pt.y + yDist;
    var hit = 0;
    for (i=0;i<lineCount && hit == 0;i++) {
        hit = intersect(tra, world[i]);
    }
    return hit;
}
