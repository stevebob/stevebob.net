
document.onkeydown = keyPressHandle;
document.onkeyup = keyUpHandle;
document.onmousemove = updateMousePos;

var drawArea;
var ctx;

var up = 0;
var down = 0;

var t;
var dT;

var mouseX;
var mouseY;

function getDark() {

    ctx.fillStyle="rgba(0, 0, 0, 0.01)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
    dT = setTimeout(getDark, 100);
}

    

function drawLine(x, y, len, angle, wt) {
    //ctx.strokeStyle = "rgb("+n/10+", "+n/10+", "+n/10+")";
    if (wt == 1) {
        ctx.strokeStyle = "rgba(255, 150, 200, 0.8)";
        ctx.lineWidth = 1;
    } else if (wt == 2) {
        ctx.strokeStyle = "rgba(20, 170, 30, 1)";
        ctx.lineWidth = 4;
    } else {
        ctx.strokeStyle = "rgba(20, 100, 30, 1)";
        ctx.lineWidth = 4;
    }

    //ctx.lineWidth = wt;
    ctx.beginPath();
    //if (col != 0) {alert(col);}
    ctx.moveTo(x, y);
    
    var xDest  = x + len*Math.cos(angle); 
    var yDest  = y + len*Math.sin(angle); 

    ctx.lineTo(xDest, yDest);

    ctx.stroke();

    if (Math.random() < 0.0001 && wt == 1) {
        wt = 2;
    }
    


    
    if (Math.random() < 0.001) {
    //drawLine(drawArea.width/2, drawArea.height, 30, -Math.PI/2);
    
    drawLine(xDest, yDest, len, (Math.random()*(Math.PI/3)-Math.PI/6), 1);
    }
    
    
    if (Math.random() < 0.9999 || wt == 3) {
        var sSize = 16;
        var best = 0;
        var shortest = 10000;
        var i;
            
        if (wt == 1 || wt == 3) {
            sSize = 1;
        }

        for (i=0;i<sSize;i++) {
            var test = Math.random()*Math.PI*2;
            var dist = Math.sqrt((x+Math.cos(test)-mouseX)*(x+Math.cos(test)-mouseX)+(y+Math.sin(test)-mouseY)*(y+Math.sin(test)-mouseY));
            if (dist < shortest) {
                shortest = dist;
                best = test;
            }
        }
    

    t = setTimeout(drawLine, 1, xDest, yDest, len, best, wt);
    }
}
    



function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;

    if (keyID == 38) {
        up = 1
        
    } else if (keyID == 40) {
        down = 1;
    }

}

function keyUpHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == 38) {
        up = 0;
        //canJump = 0;
    } else if (keyID == 40) {
        down = 0;
    }
}

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }


    getDark();
    drawLine(drawArea.width/2, drawArea.height/2, 1, Math.random()*Math.PI*2, 3);
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


