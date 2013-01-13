
document.onkeydown = keyPressHandle;
document.onmousemove = updateMousePos;

document.onclick = handleClick;

var depth = 100;
var inc = 1;
var speed = 1;
var initial = 1;
var n = 1;

var max = 100;

var winH, winW;
var drawArea;
var ctx;

var t;

var mouseX;
var mouseY;

var pixW = 1;
var pixH = 1;

var xCount;
var yCount;

var xAxis, yAxis;

var pixmap = [];

var zoom = 300;

var first = 1;

function complex() {
    this.re;
    this.im;
}

function cplexAdd(w, z) {
    var sum = new complex();
    sum.re = w.re + z.re;
    sum.im = w.im + z.im;

    return sum;
}

function axisInit() {
    xAxis = xCount/2;
    yAxis = yCount/2;
}

function cplexSquare(z) {
    var square = new complex();
    square.re = z.re*z.re - z.im*z.im;
    square.im = 2*z.re*z.im;
    return square;
}



function drawMap() {
    //updateDimensions();
    
    ctx.beginPath();

    //for (var n = 0;n<depth;n+=inc) {

        ctx.fillStyle = "rgba(" + colour(n/depth) + ", 0.2)"; 

        for (var i = 0;i<yCount;i++) {
            for (var j = 0;j<xCount;j++) {
                var c = new complex();
        
                c.re = (j - xAxis)/zoom;
                c.im = (i - yAxis)/zoom;

                var abs = cplexAbs(value(c, n));

                //var col = 255-Math.floor(abs*255);


                if (abs < 1) {
                //ctx.fillStyle = "rgba(255, 255, 255, 0.1)";//colour(1-abs);
                ctx.fillRect(j*pixW, i*pixH, pixW, pixH);
                }

            }
        }

    //}
//alert(n);
//
    ctx.fill();
  
    
    if (n<depth) {
        n++;
        t = setTimeout(drawMap, speed);
    }
}



function value(z, accuracy) {
    var result = new complex();
    result.im = 0;
    result.re = 0;

    for (var i = 0;i<accuracy && cplexAbs(result) < max;i++) {
        result = cplexAdd(cplexSquare(result), z);
    }
    
    
    return result;
}


function cplexAbs(z) {
    return Math.sqrt(z.re*z.re + z.im*z.im);
}


function clear() {
    ctx.fillStyle = "rgba(0, 0, 0, "+1+")";
    ctx.beginPath();
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}


function colour(n) {
    var expand = n*6;
    var section = Math.floor(expand);
    var progress = expand - section;

    var red, green, blue;

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
    }

    red = Math.floor(red);
    green = Math.floor(green);
    blue = Math.floor(blue);
    
    return  red + ", " + green + ", " + blue;
}

function colourTest() {
    for (var i = 0;i<400;i++) {
        ctx.beginPath();
        ctx.fillStyle = colour(i/400);
        ctx.fillRect(i, 0, 1, 20);
        ctx.fill();
    }

}

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    
    updateDimensions();
    //initAxis();
    //colourTest();
    drawMap(initial);
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

    if (first) {
        axisInit();
        first = 0;
    }

    for (var i = 0;i<yCount;i++) {
        pixmap[i] = [];
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
    n = 1;
    
    
    clear();
    zoom*=2;
    xAxis = xAxis - (mouseX/pixW - xAxis);
    yAxis = yAxis - (mouseY/pixH - yAxis);
    drawMap();
}


function clear() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}
