
document.onkeydown = keyPressHandle;
document.onmousemove = updateMousePos;

//document.onclick = handleClick;

var winH, winW;
var drawArea;
var ctx;

var t;

var mouseX;
var mouseY;

var pixW = 4;
var pixH = 4;

var xCount;
var yCount;

var xAxis, yAxis;

var pixmap = [];

var zoom = 100;

var first = 1;

var min = 0;
var max = 1;

var ctrl = 1;

var slMin = -20;
var slMax = 20;
var slInc = 1;

var scale = 48;

function axisInit() {
    xAxis = xCount/2;
    yAxis = yCount/2;
}


function drawMap() {
    
    ctx.beginPath();
    
    for (var i = 0;i<yCount;i++) {
        for (var j = 0;j<xCount;j++) {
            
            /*
            if (pixmap[j][i] == 1) {
                ctx.fillStyle = "black";
            } else {
                ctx.fillStyle = "white";
            }
            */

            ctx.fillStyle = colour(pixmap[j][i], min, max);
            ctx.fillRect(j*pixW, i*pixH, pixW, pixH);

        }
    }

    ctx.fill();
}


function clear() {
    ctx.fillStyle = "rgba(0, 0, 0, "+1+")";
    ctx.beginPath();
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}


function colour(val, rMin, rMax) {
    var red;
    var green;
    var blue;

    if (val <= rMin) {
        red = 255;
        green = 255;
        blue = 255;
    } else if (val >= rMax) {
        red = 0;
        green = 0;
        blue = 0;
    } else {
         n  = 1-(val - rMin)/(rMax - rMin);
    
    var expand = n*6;
    var section = Math.floor(expand);
    var progress = expand - section;




    if (section == 0) {
        red = 0;
        green = 0;
        blue = 255 * progress;
    } else if (section == 1) {
        red = 255 * progress;
        green = 0;
        blue = 255;
    } else if (section == 2) {
        red = 255;
        green = 0;
        blue = 255*(1-progress);
    } else if (section == 3) {
        red = 255;
        green = 255 * progress;
        blue = 0;
    } else if (section == 4) {
        red = 255 * (1-progress);
        green = 255;
        blue = 0;
    } else if (section == 5) {
        red = 255 * progress;
        green = 255;
        blue = 255 * progress;
    } else if (section == 6) {
        red = 255;
        green = 255;
        blue = 255;
    }
    }
    red = Math.floor(red);
    green = Math.floor(green);
    blue = Math.floor(blue);
    
    return "rgb(" + red + ", " + green + ", " + blue + ")";
}

function colourTest() {
    for (var i = 0;i<400;i++) {
        ctx.beginPath();
        ctx.fillStyle = colour(i/400);
        ctx.fillRect(i, 0, 1, 20);
        ctx.fill();
    }

}

function vary() {
    //setMap(n);
    heartMap();
    drawMap();

    //rMin += 0.01;
    //max *= 0.95;

    if (ctrl) {
        showCtrl();
    }

    //t = setTimeout(vary, 10);
}

function heartMap() {

    for (var i = 0;i<xCount;i++) {
        for (var j = 0;j<yCount;j++) {
            var effX = (i - xAxis)/scale;
            var effY = (yCount - j - yAxis)/scale;
            var diff = power((power(effX, 2) + power(effY, 2) - 1), 3) - power(effX, 2)*power(effY, 3);
            //var diff = effX ^ effY;
            //alert(diff);
            pixmap[i][j] = diff;
            //alert(pixmap[i][j]);
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

function setMap(n) {
    var tolerance = 2;

    for (var i = 0;i<xCount;i++) {
        
        var val = 20*Math.sin(i/80 + n) + 0;
        
        for (var j = 0;j<yCount;j++) {
            
            var diff = Math.floor(yCount -  val - yAxis - j);

            pixmap[i][j] = diff/40;
        }
    }
}

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    
    updateDimensions();
    //axisInit();
    //colourTest();
    //setMap();
    //drawMap();
    updateVals();
    vary(0);
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

    xCount = winW/pixW;
    yCount = winH/pixH;

    //if (first) {
        axisInit();
        first = 0;
    //}

    for (var i = 0;i<xCount;i++) {
        pixmap[i] = [];
        for (var j = 0;j<yCount;j++) {
            pixmap[i][j] = 0;
        }
    }

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

function handleClick() {
    zoom*=2;
    xAxis = xAxis - (mouseX/pixW - xAxis);
    yAxis = yAxis - (mouseY/pixH - yAxis);
    drawMap();
}

function showCtrl() {
    if (document.getElementById("axis").checked) {
        drawAxis();
    }

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillRect(0, 0, 200, winH);
    ctx.fill();
    
    showColRect();

}

function showColRect() {
    var lIndent = 20;
    var tIndent = 180;
    var width = 100;
    var height = winH - tIndent - 20;
    var res = 4;

    var margin = 10;
    
    ctx.beginPath();

    var track = 0;

    
    for (var i = track;i<height/res;i++) {
        ctx.fillStyle = colour(i/(height/res), 0, 1);
        ctx.fillRect(lIndent, tIndent + i*res, width, res);
        track = i;
    }
    
    ctx.fill();

    var numCount = 8;
    var size = 12;
    var lSpace = 10;

    ctx.font = size + "px Monospace";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "left";
    ctx.textBassline = "bottom";

    for (var i = 0;i<=numCount;i++) {
        var str = (min + i*((max-min)/numCount)+"");

        if (i==0) {
            str = "<= "+str.substr(0, 4);
        } else if (i==numCount) {
            str = ">= "+str.substr(0, 4);
        } else {
            str = str.substr(0, 6);
        }

        ctx.fillText(str, lIndent + width + lSpace, tIndent + i*(height/numCount) + size/2);
    }


}

function updateVals() {
    document.getElementById("min").value = min;
    document.getElementById("max").value = max;
}

function parseMin() {
    var tmp = parseFloat(document.getElementById("min").value);
    
    if (tmp >= 0 || tmp < 0) {
        min = tmp;
    }

    updateVals();
    vary();
}
    
function parseMax() {
    var tmp = parseFloat(document.getElementById("max").value);
    
    if (tmp >= 0 || tmp < 0) {
        max = tmp;
    }

    updateVals();
    vary();
}

function changeMax(n) {
    max+=n;
    updateVals();
    vary();
}

function changeMin(n) {
    min+=n;
    updateVals();
    vary();
}

function drawAxis() {

    var spacing = 50;
    var padding = 10;
    var size = 12;

    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(xAxis*pixW - padding, 0, padding*8, winH);
    ctx.fillRect(0, yAxis*pixH - padding*2, winW, padding*3);
    
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 2;

    ctx.moveTo(xAxis*pixW, 0);
    ctx.lineTo(xAxis*pixW, winH);
    ctx.moveTo(0, yAxis*pixH);
    ctx.lineTo(winW, yAxis*pixH);
    
    
    ctx.fill();
    ctx.stroke();

    ctx.font = size + "px Monospace";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.textAlign = "left";
    ctx.textBassline = "bottom";
    var count = -parseInt((winH-yAxis*pixH)/spacing);
    for (i = winH;i>0;i-=spacing) {
        var str = count*(spacing/(pixH*scale))+"";
        str = str.substr(0, 8);
        ctx.fillText(str, xAxis*pixW + 2, i);
        count++;
    }

    count = -parseInt((winW-xAxis*pixW)/spacing) - 1;
    for (i = winW;i>0;i-=spacing) {
        var str = count*(spacing/(pixW*scale))+"";
        str = str.substr(0, 5);
        ctx.fillText(str, i, yAxis*pixH-4);
        count++;
    }

}
