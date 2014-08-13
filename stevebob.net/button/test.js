
document.onkeydown = keyPressHandle;
document.onkeyup = keyUpHandle;
document.onmousemove = updateMousePos;
document.onclick = handleClick;


var winH, winW;
var drawArea;
var ctx;

var btnTop, btnBottom, btnLeft, btnRight;

var btnStat = -1;
var tmp = -2;

var t;
var cT;

var waiting = 1;
var waitingFor;

function setBtnSize() {
    btnTop = winH/4;
    btnBottom = 3*(winH/4);
    btnLeft = 3*(winW/8);
    btnRight = 5*(winW/8);
}

function drawBtn() {

    ctx.lineWidth = 2;

    ctx.lineStyle = "black";
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.beginPath();
    ctx.moveTo(btnLeft, btnTop);
    ctx.lineTo(btnRight, btnTop);
    ctx.lineTo(btnRight, btnBottom);
    ctx.lineTo(btnLeft, btnBottom);
    ctx.lineTo(btnLeft, btnTop);
    
    ctx.fill();
    ctx.stroke();
    
    ctx.lineWidth = 10;
    
    ctx.beginPath();

    if (btnStat == 0) {
        ctx.moveTo(btnLeft, btnTop + (btnBottom-btnTop)*0.75);
        ctx.lineTo(btnRight, btnTop + (btnBottom-btnTop)*0.75);
    } else if (btnStat == 1) {
        ctx.moveTo(btnLeft, btnTop + (btnBottom-btnTop)*0.25);
        ctx.lineTo(btnRight, btnTop + (btnBottom-btnTop)*0.25);
    }

    ctx.stroke();
}

function makeDark() {
    //document.getElementById("all").style.backgroundColor = "grey";

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}

function reDraw() {
    
    //document.getElementById("all").style.backgroundColor = "white";
    ctx.fillStyle="rgb(200, 200, 200)";
    ctx.fillRect(0, 0, drawArea.width, drawArea.height);
    
    drawBtn();
    if (btnStat == 0) {
        makeDark();
    }

}


function press() {

    xmlhttp = new XMLHttpRequest();

waiting = 1;
waitingFor = 1 - btnStat;

if (btnStat == 0) {
    xmlhttp.open("POST","on.pl",true);
} else {
    xmlhttp.open("POST","off.pl",true);
}
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send();

}

function wait() {

ctx.font = "12px Courier";
ctx.strokeStyle="black";
ctx.fillStyle="black";
ctx.textAlign="left";
ctx.textBaseline="top";

ctx.fillText("syncing...", winW - 80, winH - 20);

}

function check() {

    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            
            tmp=parseInt(xmlhttp.responseText);
        }
    }

    xmlhttp.open("GET","getStat.pl",true);
    
    xmlhttp.send();

    if (tmp!=btnStat) {
        btnStat = tmp;
        reDraw();
        waiting = 0;
    }


    cornerSquare(1);
    t=setTimeout(check, 1000);
}

function cornerSquare(n) {

    if (n==0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    } else {
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
    }
    
    ctx.fillRect(winW-10, winH-10, 10, 10);
    ctx.fill();

}

function connected() {
    cornerSquare(0);
    
    if (waiting) {
        wait();
    }

    cT = setTimeout(connected, 50);
}


function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;

    if (keyID == 38) {
    } else if (keyID == 40) {
    }

}

function keyUpHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == 38) {
    } else if (keyID == 40) {
    }
}

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }

    check();
    connected();
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
    
    reDraw();

    setBtnSize();
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
    if (mouseX > btnLeft && mouseX < btnRight && mouseY > btnTop && mouseY < btnBottom) {
        press();
    }
}
