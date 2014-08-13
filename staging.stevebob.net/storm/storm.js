//The Fractal Framework - Stephen Sherratt
//Help yourself, but don't remove this comment (or the one above)

document.onmousemove = updateMousePos;
document.onmousedown = handleMouseDown;
document.onmouseup = handleMouseUp;

var ctx;
var drawArea;

var fT;

var mouseX, mouseY;

var mouseDown = 0;

var mute = 1;

function coord() {
    this.x;
    this.y;
}

function line() {
    //this.col;
    //this.width;
    this.a;
    this.b;
}

function node() {
    this.point = new coord();
    this.eCount;
}

function fractalData() {
    this.spread;
    //this.angle; 
    this.range; 
    this.length;  
   // this.lenMod; 
   // this.depth; 
    this.maxDepth;
}

function randData() {
    this.spreadMin;
    this.spreadMax;
    this.probDist = [];
    this.range;
    this.lengthMin;
    this.lengthMax;
    this.maxDepth;
}

function fractal() {
    this.nodes = [];
    this.lines = [];
    this.nodeCount;
}


function initFractal(startX, startY, fract) {
    fract.nodes[0] = new node();
    fract.nodes[0].point.x = startX;
    fract.nodes[0].point.y = startY;
    fract.nodes[0].eCount = 0;

    fract.lines[0] = new line();
    fract.lines[0].a = 0;
    //fract.lines[0].b

    fract.nodeCount = 1;
}



function stdFract(fract, fractData, prev, depth, angle) {
    
    if (depth < fractData.maxDepth) {

        var i;

        for (i=0;i<fractData.spread;i++) {

            var next = new node();

            var an;
            if (fractData.spread > 1) {
                an = angle - fractData.range/2 + (i*fractData.range/(fractData.spread-1));
            } else {
                an = angle;
            }

            next.point.x = fract.nodes[prev].point.x + fractData.length*Math.cos(an);
            next.point.y = fract.nodes[prev].point.y + fractData.length*Math.sin(an);
            
            next.eCount = 1;
            
            fract.nodes[fract.nodeCount] = new node();
            fract.nodes[fract.nodeCount] = next;

            fract.lines[fract.nodeCount] = new line();
            fract.lines[fract.nodeCount].a = prev;
            fract.lines[fract.nodeCount].b = fract.nodeCount;
            
            fract.nodeCount++;

            stdFract(fract, fractData, fract.nodeCount - 1, depth + 1, an);

        }
    }
}
function randFract(fract, fractData, prev, depth, angle, mouse) {
    

    if (((mouse || mouseDown) && Math.sqrt(power((fract.nodes[prev].point.x - mouseX), 2) + power((fract.nodes[prev].point.y - mouseY), 2)) > 20) || ((!mouse && !mouseDown) && fract.nodes[prev].point.y < drawArea.height)) {
        var i;

        var spreadDecider = Math.random();

        var spread = 0;
        var total = 0;

        for (i=0;i+fractData.spreadMin < fractData.spreadMax;i++) {
            if (spreadDecider < fractData.probDist[i] + total && spreadDecider > total) {
                spread = i+fractData.spreadMin;
            }
            total += fractData.probDist[i];
        }

        for (i=0;i<spread;i++) {

            var j;
            var bestDist = drawArea.height;
            var best = new node();

            for (j=0;j<32;j++) {
                
                var next = new node();

                var an = Math.random() * (fractData.range) + angle - fractData.range/2;
                
                var length = Math.floor(Math.random()*(fractData.lengthMax - fractData.lengthMin)) + fractData.lengthMin;

                next.point.x = fract.nodes[prev].point.x + length*Math.cos(an);
                next.point.y = fract.nodes[prev].point.y + length*Math.sin(an);

                var ht;
                var mouseDist;
                
                mouseDist = Math.sqrt(power((next.point.x - mouseX), 2) + power((next.point.y - mouseY), 2));
                ht = drawArea.height - next.point.y;

                if (mouse || mouseDown) {
                    ht = mouseDist;
                }

                if (ht<bestDist) {
                    bestDist = ht;
                    best = next;
                }

        
            }

            best.eCount = 1;
            
            fract.nodes[fract.nodeCount] = new node();
            fract.nodes[fract.nodeCount] = best;

            fract.lines[fract.nodeCount] = new line();
            fract.lines[fract.nodeCount].a = prev;
            fract.lines[fract.nodeCount].b = fract.nodeCount;
            
            fract.nodeCount++;

            randFract(fract, fractData, fract.nodeCount - 1, depth + 1, an, mouse);

        }
    }
}



function makeRandomFractal(mode) {

    var data = new randData();
    
    if (mouseDown) {
        data.probDist[0] = 0.9;
        data.probDist[1] = 0.1;
    } else {
        data.probDist[0] = 0.975;
        data.probDist[1] = 0.025;
    }

    data.spreadMin = 1;
    data.spreadMax = 3;
    data.range = Math.PI*2;
    data.lengthMin = Math.floor(drawArea.height/100);
    data.lengthMax = Math.floor(drawArea.height/10);
    data.maxDepth = 8;

    var fract = new fractal();
    initFractal(drawArea.width*Math.random(), 0, fract);

    randFract(fract, data, 0, 0, Math.PI/2, mode);
    drawFractal(fract);
}

function makeFractal() {
    var data = new fractalData();
    
    data.spread = 1;
    data.range = Math.PI/3;
    data.length = 20;
    data.maxDepth = 12;

    var fract = new fractal();
    initFractal(drawArea.width/2, drawArea.height/2, fract);

    stdFract(fract, data, 0, 0, -Math.PI/2);
    drawFractal(fract);
}


function drawFractal(fract) {
    var i;

    for (i=1;i<fract.nodeCount;i++) {
        var j;
        
        for (j=1;j<6;j++) {

            ctx.lineWidth = power(j, 2); 
            ctx.strokeStyle = "rgba(200, 50, 230, " + 1/power(2, j) + ")";
            ctx.beginPath();
            ctx.moveTo(fract.nodes[fract.lines[i].a].point.x, fract.nodes[fract.lines[i].a].point.y);
            ctx.lineTo(fract.nodes[fract.lines[i].b].point.x, fract.nodes[fract.lines[i].b].point.y);
            ctx.stroke();
        }
    }

}

function power(base, index) {
    var answer = 1;

    var i;

    for (i=0;i<index;i++) {
        answer *= base;
    }

    return answer;
}

function thunder() {
    document.getElementById("sound").play();
}

function fade() {

    
    ctx.fillStyle = "rgba(0, 0, 0, 0.025)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();

    if (Math.random() < 0.01 || (mouseDown && Math.random() < 0.5)) {
        makeRandomFractal(0);
        if (!mute) {
            thunder();
        }
    }

    fT = setTimeout(fade, 10);
}



function setMute() {
    mute = 1-mute;
    if (mute) {
        document.getElementById("mute").innerHTML = "unmute";
    } else {
        document.getElementById("mute").innerHTML = "mute";
    }
}



function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }


    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
    //makeLine(drawArea.width/2, drawArea.height/2, 20, Math.random()*Math.PI*2, 0, 5);
    //drawLines();
}


function updateDimensions() {
    var winH, winW;
    
    setUpCanvas();

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
    
    //ctx.fillStyle="white";
    //ctx.fillRect(0, 0, drawArea.width, drawArea.height);
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

function handleMouseDown() {
    mouseDown = 1;
}

function handleMouseUp() {
    mouseDown = 0;
     
    var data = new randData();

    data.probDist[0] = 0.5;
    data.probDist[1] = 0.5;

    data.spreadMin = 1;
    data.spreadMax = 3;
    data.range = Math.PI*2;
    data.lengthMin = Math.floor(drawArea.height/100);
    data.lengthMax = Math.floor(drawArea.height/10);
    data.maxDepth = 8;

    var fract = new fractal();
    initFractal(mouseX, mouseY, fract);

    randFract(fract, data, 0, 0, Math.PI/2, 0);
    drawFractal(fract);
}

