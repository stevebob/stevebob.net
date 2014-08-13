document.onmousemove = handleMove;
document.onmousedown = handlePress;
document.onmouseup = handleRelease;


var drawArea;
var ctx;

var wd;
var ht;

var mouseX;
var mouseY;

var penDown = 0;

var painting;

var lightX;
var lightY;
var t;

var prec = 1440;

var lightArea = [];

var sunSize = 30;

var sunSelect = 0;

var blSize = 20;

function point() {
    this.x;
    this.y;
}

function castRays() {

    var i;
    
    for (i=0;i<prec;i++) {
        lightArea[i] = point();
        lightArea[i] = ray(lightX, lightY, i*2*Math.PI/prec);
        
    }
}


function renderLight() {
    var i;
    ctx.fillStyle = "rgb(255, 255, 200)";
    ctx.strokeStyle = "rgb(255, 255, 50)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(lightArea[0].x, lightArea[0].y);
    for (i=1;i<prec-1;i++) {
        ctx.lineTo(lightArea[i+1].x, lightArea[i+1].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}



function ray(x, y, angle) {
    var rad = 0;
    var pt = new point();
    var sine = Math.sin(angle);
    var cosine = Math.cos(angle);
    
    var endX = rad*cosine+x;
    var endY = rad*sine+y;

    while (endX > 0 && endX < drawArea.width && endY > 0 && endY < drawArea.height && !collide(endX, endY)) {

        rad+=5;

        endX = rad*cosine+x;
        endY = rad*sine+y;


    }

    pt.x = endX;
    pt.y = endY;

    
    return pt;
}

function collide(x, y) {
    var xEq = Math.floor((x/drawArea.width)*wd);
    var yEq = Math.floor((y/drawArea.height)*ht);

    return painting[xEq][yEq];
}

function drawLight() {
    ctx.fillStyle="rgb(255, 255, 0)";
    ctx.strokeStyle="rgb(100, 100, 0)";
    ctx.lineWidth=4;
    ctx.beginPath();
    ctx.fillRect(lightX-sunSize/2, lightY-sunSize/2, sunSize, sunSize);
    ctx.strokeRect(lightX-sunSize/2, lightY-sunSize/2, sunSize, sunSize);
    
    ctx.fill();
    ctx.stroke();
}

function setupPainting() {
    for (var i=0;i<wd;i++) {
        painting[i] = new Array(ht);
        for (var j=0;j<ht;j++) {
            painting[i][j] = 0;
        }
    }
}

function paint() {
    var mode;
    var x = Math.floor((mouseX/drawArea.width)*wd);
    var y = Math.floor((mouseY/drawArea.height)*ht);
    mode = painting[x][y];
    painting[x][y] = 1;// - painting[x][y];

    var sign = 0;
    var centreX = (x/wd)*drawArea.width+(drawArea.width/(2*wd));
    var centreY = (y/ht)*drawArea.height+(drawArea.height/(2*ht));
    return mode;
}

function erase() {
    var x = Math.floor((mouseX/drawArea.width)*wd);
    var y = Math.floor((mouseY/drawArea.height)*ht);
    painting[x][y] = 0;// - painting[x][y];

    var sign = 0;
    var centreX = (x/wd)*drawArea.width+(drawArea.width/(2*wd));
    var centreY = (y/ht)*drawArea.height+(drawArea.height/(2*ht));
}

function updatePaint(m) {
    var mode = -1;
    clear();
    if (m==1) {
        erase();
    } else if (penDown) {
        mode = paint();
    }
    castRays();
    renderLight();
    updateCanvas();
    drawLight();
    return mode;
}

function clear() {
    ctx.fillStyle = "rgb(200, 200, 255)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
}

function updateCanvas() {

    var i, j;

    for (i=0;i<wd;i++) {
        for (j=0;j<ht;j++) {
            if (painting[i][j] == 1) {
                ctx.fillStyle="rgb(50, 0, 0)";
                ctx.beginPath();
                ctx.fillRect(i*drawArea.width/wd, j*drawArea.height/ht, drawArea.width/wd, drawArea.height/ht);
                ctx.fill();
                ctx.fillStyle="rgb(150, 20, 20)";
                ctx.beginPath();
                ctx.fillRect(i*drawArea.width/wd+2, j*drawArea.height/ht+2, drawArea.width/wd-4, drawArea.height/ht-4);
                ctx.fill();
            }
        }
    }
}


function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    
    updateDimensions();

}




function updateDimensions() {
    var winH, winW;
    
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

    wd = Math.floor(winW/blSize);
    ht = Math.floor(winH/blSize);

    painting = new Array(wd);
    setupPainting();


    lightX = winW/2;
    lightY = winH/2;

    document.getElementById("light").value=sunSize;
    document.getElementById("block").value=blSize;

    updatePaint(0);

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

    if (sunSelect) {
        lightX = mouseX;
        lightY = mouseY;
    }
    if (sunSelect || penDown) {
        updatePaint(0);
    }
}

function handlePress() {
    
    if (overCtrl()) {
        cpshow();
    } else if (overSun()) {
        sunSelect = 1;
    } else {
        penDown = 1;
        var mode = updatePaint(0);
        //alert(mode);
        if (mode==1) {
            updatePaint(1);
            penDown = 0;
        }
    }
    
}

function handleRelease() {
    penDown = 0;
    sunSelect = 0;
}

function overSun() {
    return mouseX > lightX - sunSize/2 && mouseX < lightX + sunSize/2 && mouseY > lightY - sunSize/2 && mouseY < lightY + sunSize/2;
}


function setBlock() {
    blSize = parseInt(document.getElementById("block").value);
    updateDimensions();
}

function setLight() {
    sunSize = parseInt(document.getElementById("light").value);
    updatePaint(0);
}

function cpshow() {
    document.getElementById("pnl").style.display = "";
}
function cphide() {
    document.getElementById("pnl").style.display = "none";
}

function overCtrl() {
    return (mouseX < 20 && mouseY >drawArea.height-20);
}
