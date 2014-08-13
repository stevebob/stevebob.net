document.onmousemove = handleMove;
document.onmousedown = handlePress;
document.onmouseup = handleRelease;


var drawArea;
var ctx;

var winW;
var winH;

var mouseX;
var mouseY;

var world = [];
var lineCount = 0;


var eye = new point();

var last = new point();

var init = 1;

var sunLock = 0;

function point() {
    this.x;
    this.y;
}

function line() {
    this.a = new point();
    this.b = new point();
}

function rays(centre, max, jump, prec) {
    for (var i=0;i<prec;i++) {
        castRay(centre, max, i*(Math.PI*2/prec), jump);
        //alert(i*Math.PI*2/prec);
    }
}

function castRay(centre, max, angle, jump) {
    
    var next = new point();
    var end = new point();
    end.x = centre.x;
    end.y = centre.y;
    var xin = jump*Math.cos(angle);
    var yin = jump*Math.sin(angle);
    //alert(xin + ", " + yin);
    //if (xin < 0.001 && xin > -0.001) {
     //   xin = 0.01;
    //}
    
    var ict = 0;

    for (var i=0;i<max/jump && !ict;i++) {
        next.x = end.x + xin;
        next.y = end.y + yin;
        ctx.lineWidth=2;
        ctx.strokeStyle="green";
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();

        var seg = new line();
        seg.a = end;
        seg.b = next;
        
        ict = checkForIct(seg);
        if (!ict) {
            end.x = next.x;
            end.y = next.y;
        }
    }

    return end;
}

function checkForIct(p) {
    var ict = 0;
    for (var i=0;i<lineCount && !ict;i++) {
        ict = intersect(p, world[i]);
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


ctx.fillStyle="red";
ctx.fillRect(icp.x-2, icp.y-2, 4, 4);
ctx.fill();
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
    ctx.fillStyle="blue";
    ctx.fillRect(eye.x-10, eye.y-10, 20, 20);
    ctx.fill();
}

function test() {
    clear();

    drawEye();
    drawLines(world);
    rays(eye, winW, 15, 60);
    //castRay(eye, 250, Math.PI/2, 2);
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
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
}


function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    
    updateDimensions();
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


    eye.x = winW/2;
    eye.y = winH/2;

    test();


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
    
    if (sunLock) {
        eye.x = mouseX;
        eye.y = mouseY;
        test();
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
        test();
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

