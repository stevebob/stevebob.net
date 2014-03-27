
document.onkeydown = keyPressHandle;
document.onkeyup = keyUpHandle;
document.onmousemove = updateMousePos;
document.onmousedown = handlePress;
document.onmouseup = handleUp;


//var drawArea;
//var ctx;

var colour = "rgba(255, 255, 255, 1)";

var up = 0;
var down = 0;

var timer;
var dT;

var mouseX;
var mouseY;

var max = 100;
var count = 0;

    var snow = [];
var selected = 0;
var selectedNow = 0;

var surTime = 0;
var surTimer;
var surStr;
var showTimer = 1;

function trackSurvival() {
    surTime++;
    surStr = parseInt(surTime / 60) + ":"; 
    if (surTime%60<10) {
        surStr += "0";
    }
    surStr += surTime % 60;
    surTimer = setTimeout(trackSurvival, 1000);
}

function printSurvival() {
    ctx.font = "16px Courier";
    //ctx.strokeStyle="black";
    ctx.fillStyle="black";
    ctx.textAlign="left";
    ctx.textBaseline="top";

    ctx.fillText(surStr, 10, drawArea.height - 26);
}
function getDark() {

    ctx.fillStyle="rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
    dT = setTimeout(getDark, 10);
}

/*
function clear() {

    ctx.fillStyle="rgba(150, 150, 255, 1)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
}*/

function flake() {
    this.depth;
    this.spread = [];
    this.length = [];
    this.angle;
    this.x;
    this.y;
}

function snowFall() {
    
    var i;

    for (i=0;i<40;i++) {

        var j;

        var depth = Math.floor(Math.random()*2)+2;
        var spread = new Array(depth);
        var length = new Array(depth);

        for (j=depth-1;j>=0;j--) {
            spread[j] = Math.floor(Math.random()*6)+3;
            length[j] = (Math.random() + 0.5)*7;
        }

        length[depth-1] = 0;

        snow[i] = new flake();
        snow[i].depth = depth;
        snow[i].spread = spread;
        snow[i].length = length;
        snow[i].x = Math.floor(Math.random()*drawArea.width);
        snow[i].y = Math.floor(Math.random()*drawArea.height);
        snow[i].angle = Math.random()*Math.PI;

    }

    drawFlakes(20, snow, 0);
}

function drawFlakes(n, snow, fr) {
    var i;
    clear();

    ctx.linewidth = 1;

    for (i=0;i<n;i++) {

        snowFlake(snow[i].x, snow[i].y, snow[i].spread, snow[i].length, snow[i].depth, snow[i].angle);
        
        if (!selectedNow || selected != i) {
            snow[i].y+= rad(snow[i])/16;
            snow[i].angle += Math.PI*Math.random()/120 - Math.PI/240;
        }

        if (snow[i].y > drawArea.height+80) {
            surTime = -1;
            var j;

            var depth = Math.floor(Math.random()*2)+2;
            var spread = new Array(depth);
            var length = new Array(depth);

            for (j=depth-1;j>=0;j--) {
                spread[j] = Math.floor(Math.random()*7)+3;
                length[j] = (Math.random() + 0.5)*7;
            }

            length[depth-1] = 0;

            snow[i] = new flake();
            snow[i].depth = depth;
            snow[i].spread = spread;
            snow[i].length = length;
            snow[i].x = Math.floor(Math.random()*drawArea.width);
            snow[i].y = -80;
            snow[i].angle = Math.random()*Math.PI;

        }
    }

    fractalClient(fr);

    timer=setTimeout(drawFlakes, 1, n, snow, fr+1);

}

function snowFlake(x, y, spread, length, depth, angle) {
    

    drawLine(x, y, length, angle, depth-1, spread, 1);


}
    

function drawLine(x, y, length, angle, n, spread, init) {
    
    var xDest  = x + length[n]*Math.cos(angle); 
    var yDest  = y + length[n]*Math.sin(angle); 
    
    if (!init) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = colour;
        ctx.beginPath();
        ctx.moveTo(x, y);


        ctx.lineTo(xDest, yDest);

        ctx.stroke();
    }
    
    var i;

    if (n>=0) {
        for (i=0;i<spread[n];i++) {
            drawLine(xDest, yDest, length, angle+i*(Math.PI*2/spread[n]), n-1, spread, 0);
        }
    }
}
    
function findFlake() {
    var i;

    var best = -1;
    var dist;
    selectedNow = 0;

    for (i=0;i<20;i++) {
        if (best == -1 || Math.sqrt((snow[i].x-mouseX)*(snow[i].x-mouseX) + (snow[i].y-mouseY)*(snow[i].y-mouseY)) < dist) {
            best = i;
            dist = Math.sqrt((snow[i].x-mouseX)*(snow[i].x-mouseX) + (snow[i].y-mouseY)*(snow[i].y-mouseY));
        }
    }
    if (dist < rad(snow[best])) {
        selectedNow = 1;
    }

    return best;
}

function rad(f) {
    var i;
    var radius = 0;
    for (i=0;i<f.depth;i++) {
        radius += f.length[i];
    }
    return radius;
}

function handlePress() {


   // selectedNow = 1;
    selected = findFlake();

    if (mouseX < 75 && mouseY < 50) {
        showTimer = 1-showTimer;
    }


}


function handleUp() {

    selectedNow = 0;
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


function moveSelected() {
    if (selectedNow) {
    snow[selected].x = mouseX;
    snow[selected].y = mouseY;
    }
}

function updateMousePos() {
    var mousePos = getPosition();

    mouseX = mousePos.x;
    mouseY = mousePos.y;
    moveSelected();
}



