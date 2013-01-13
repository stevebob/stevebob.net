
document.onkeydown = keyPressHandle;
document.onkeyup = keyUpHandle;


var drawArea;
var ctx;

var up = 0;
var down = 0;

var t;
var dT;

function getDark() {

    ctx.fillStyle="rgba(0, 0, 0, 0.01)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    ctx.fill();
    dT = setTimeout(getDark, 10);
}

function getCol(col) {
    if (col==0){
        return "rgba(255, 255, 255, 0.5)";}
    if (col==1){
        return "rgba(255, 0, 0, 0.5)";}
    if (col==2)
        return "rgba(255, 255, 0, 0.5)";
    if (col==3)
        return "rgba(0, 255, 0, 0.5)";
    if (col==4)
        return "rgba(0, 255, 255, 0.5)";
    if (col==5)
        return "rgba(0, 0, 255, 0.5)";
    if (col==6)
        return "rgba(255, 0, 255, 0.5)";
}
        
    

function drawLine(x, y, len, angle, col) {
    //ctx.strokeStyle = "rgb("+n/10+", "+n/10+", "+n/10+")";
    ctx.strokeStyle = getCol(col);
    ctx.beginPath();
    //if (col != 0) {alert(col);}
    ctx.moveTo(x, y);
    
    var xDest  = x + len*Math.cos(angle); 
    var yDest  = y + len*Math.sin(angle); 

    ctx.lineTo(xDest, yDest);

    ctx.stroke();

    if (Math.random() < 0.003) {
    //drawLine(drawArea.width/2, drawArea.height, 30, -Math.PI/2);
    
    drawLine(xDest, yDest, len, (Math.random()*(Math.PI/3)-Math.PI/6), Math.floor(Math.random()*7));
    }
    
    if (Math.random() < 1) {
    t = setTimeout(drawLine, 1, xDest, yDest, len, angle + (Math.random()*(Math.PI/3)-Math.PI/6), col);
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
    drawLine(drawArea.width/2, drawArea.height/2, 1, Math.random()*Math.PI*2, 1);
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


