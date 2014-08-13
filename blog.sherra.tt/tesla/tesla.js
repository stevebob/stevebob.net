
document.onkeydown = keyPressHandle;
document.onkeyup = keyUpHandle;
document.onmousemove = updateMousePos;


var drawArea;
var ctx;

var colour = "rgba(150, 100, 255, 0.25)";

var sourceX, sourceY;


var t;
var dT;

var mouseX;
var mouseY;

var max = 200;
var count = 0;

var curAttr = 1;

var up=0;
var left=0;

var xVel = 0;
var yVel = 0;

var moveT;

function moveSource() {

    var inc = 1;

if (Math.abs(yVel) < 20) {
    yVel -= up * 1;
}

if (Math.abs(xVel) < 20) {
    xVel -= left * 1;
}

    sourceX += xVel;
    sourceY += yVel;

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


    moveT = setTimeout(moveSource, 10);
}

function handleDbClick() {
    curAttr = 1 - curAttr;
}


function changeColour() {
   var seed =  (Math.floor(Math.random()*8));
   if (seed == 0) {
      colour = "rgba(150, 100, 255, 0.4)";
   } else if (seed == 1) {
      colour = "rgba(255, 50, 0, 0.25)";
   } else if (seed == 2) {
      colour = "rgba(0, 255, 100, 0.25)";
   } else if (seed == 3) {
      colour = "rgba(255, 150, 0, 0.25)";
   } else if (seed == 4) {
      colour = "rgba(255, 150, 0, 0.25)";
   } else if (seed == 5) {
      colour = "rgba(0, 255, 200, 0.25)";
   } else if (seed == 6) {
      colour = "rgba(255, 50, 100, 0.25)";
   } else if (seed == 7) {
      colour = "rgba(255, 255, 255, 0.25)";
   } 
}

function getDark() {

    ctx.fillStyle="rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
    dT = setTimeout(getDark, 10);
}

    

function drawLine(x, y, len, angle) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    //if (col != 0) {alert(col);}
    ctx.moveTo(x, y);
    
    var xDest  = x + len*Math.cos(angle); 
    var yDest  = y + len*Math.sin(angle); 

    ctx.lineTo(xDest, yDest);

    ctx.stroke();

    //if (Math.random() < 0.001 && count < max) {
    //drawLine(drawArea.width/2, drawArea.height, 30, -Math.PI/2);
    //count++;
    //drawLine(xDest, yDest, len, (Math.random()*(Math.PI/3)-Math.PI/6));
    //}

    if (Math.random() < 0.01 && count < max) {
        count++;
if (curAttr) {
        drawLine(sourceX, sourceY, len, (Math.random()*Math.PI*2));
} else {
    
        drawLine(mouseX, mouseY, len, (Math.random()*Math.PI*2));
}
}
    
    if ((Math.random() < 1 && count < max) || (Math.random() < 0.75)) {
        var sSize = 4;
        var best = 0;
        var shortest = 10000;
        var i;

        for (i=0;i<sSize;i++) {
            var test = Math.random()*Math.PI*2;
            var dist;
if (curAttr) {
dist = Math.sqrt((x+Math.cos(test)-mouseX)*(x+Math.cos(test)-mouseX)+(y+Math.sin(test)-mouseY)*(y+Math.sin(test)-mouseY));
} else {
dist = Math.sqrt((x+Math.cos(test)-sourceX)*(x+Math.cos(test)-sourceX)+(y+Math.sin(test)-sourceY)*(y+Math.sin(test)-sourceY));
}
    

        if (dist < shortest) {
                shortest = dist;
                best = test;
            }
        }

//	if (curAttr) {
//moveSource();
    t = setTimeout(drawLine, 1, xDest, yDest, len, best);
//} else {
//t = setTimeout(drawLine, 50, drawArea.width/2, drawArea.height/2, len, best);
//}
    } else {
        count--;
    }
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

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }


    getDark();
    moveSource();
    drawLine(drawArea.width/2, drawArea.height/2, 20, Math.random()*Math.PI*2, 1);
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
    ctx.fillStyle="black";
   sourceX = drawArea.width/2;
   sourceY = drawArea.height/2;
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
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


