var ctx, drawArea;
var winW, winH;

var xMin = -10;
var xMax = 10;
var yMin = -10;
var yMax = 10;

var lSet = [];
var lCount = 0;

var dSet = [];
var dCount = 0;

var depth = 5;
var offset = 0;

var t;

function point(a, b) {
    this.x = a;
    this.y = b;
}

function line(a, b, c, d, w, g) {
    this.end0 = new point(a, b);
    this.end1 = new point(c, d);
    this.width = w;
    this.green = g;
}

function detail(ba, br, s, a) {
    this.bassAngle = ba;
    this.bassRad = br;
    this.scale = s;
    this.angle = a;
}

function base(bx, by, l, a) {
    this.pt = new point(bx, by);
    this.len = l;
    this.angle = a;
}

function setupDetails() {
    dSet[0] = new detail(0, 1, 0.38, Math.PI/3);
    dSet[1] = new detail(0, 1, 0.38, -Math.PI/3);
    dSet[2] = new detail(0, 1, 0.75, offset);
    dCount = 3;
}

function fractalClient(n) {
    offset = 0.05*Math.sin(n/50);
    
    var b = new base(0,-10, 5.5, Math.PI/2+offset);

    setupDetails();
    lCount = 0;
    makeFractal(b, 0);
    //clear();
    drawLines();

    //t = setTimeout(fractalClient, 10, n+1);
}


function clear() {
    ctx.beginPath();
    ctx.fillStyle="black";
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}

function makeFractal(b, n) {

    lSet[lCount] = new line(b.pt.x, b.pt.y, b.pt.x + b.len*Math.cos(b.angle), b.pt.y + b.len*Math.sin(b.angle), depth-n, n);
    lCount++;

    //alert(b.pt.y);
    for (var i = 0;i<dCount && n<depth;i++) {
        var next = new base(b.pt.x + dSet[i].bassRad*b.len*Math.cos(dSet[i].bassAngle + b.angle),
                            b.pt.y + dSet[i].bassRad*b.len*Math.sin(dSet[i].bassAngle + b.angle),
                            b.len * dSet[i].scale,
                            b.angle + dSet[i].angle);
        makeFractal(next, n+1);
    }

}

function drawLines() {
    var xSpan = xMax - xMin;
    var ySpan = yMax - yMin;

    
    for (var i = 0;i<lCount;i++) {
        var realX0 = ((lSet[i].end0.x - xMin) / xSpan) * winW;
        var realY0 = (1 - (lSet[i].end0.y - yMin) / ySpan) * winH;
        var realX1 = ((lSet[i].end1.x - xMin) / xSpan) * winW;
        var realY1 = (1 - (lSet[i].end1.y - yMin) / ySpan) * winH;
        ctx.beginPath();
        
        ctx.strokeStyle = "rgb(100, "+(100+lSet[i].green*15)+", 0)";
        ctx.lineWidth = lSet[i].width;
        ctx.moveTo(realX0, realY0);
        ctx.lineTo(realX1, realY1);
        
        ctx.stroke();
        
        ctx.beginPath();
        
        ctx.strokeStyle = "rgba(100, "+(100+lSet[i].green*15)+", 0, 0.75)";
        ctx.lineWidth = lSet[i].width*2;
        ctx.moveTo(realX0, realY0);
        ctx.lineTo(realX1, realY1);
        
        ctx.stroke();
        
        ctx.beginPath();
        
        ctx.strokeStyle = "rgba(200, "+(100+lSet[i].green*15)+", 0, 0.5)";
        ctx.lineWidth = lSet[i].width*4;
        ctx.moveTo(realX0, realY0);
        ctx.lineTo(realX1, realY1);
        
        ctx.stroke();
    }
    
}


function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    updateDimensions();
    //setupDetails();
    //fractalClient(0);
    snowFall();
    //drawLines();
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

