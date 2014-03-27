
document.onmousemove = handleMove;

var mid_x, mid_y;
var between;
const count = 180;


function setMid() {
    mid_x = winW / 2;
    mid_y = winH / 2;
    between = winW / (count-1);
}

function drawAll(squares) {
       
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();

    setMid();

    for (var i in squares) {
        squares[i].draw();
    }

}

var a = 50;
var b = 1;
var c = 0;
var d = 0;

var da = 0;
var db = 0.0005;
var dc = 10;
var dd = 0;

var t;
function sine(squares) {
    
    setMid();

    //a = winH * 0.3;

    if (b == 0) {
        b = 0.0001;
    }

    for (var i = 0;i<count;i++) {
        var x = -mid_x + i * between;
        var y = a*Math.sin((x+c)/b) + d;

        squares[i].set_y(y);
    }

    drawAll(squares);
    
    a+= da;
    b+= db;
    c+= dc;
    d+= dd;

    if (Math.abs(b) > 10) {
        db = -db;
    }

    t = setTimeout(sine, 10, squares);
}

function handleMove() {
    var pos = getPosition();

    dc = (pos.x - mid_x) / 2000;
    a = winH - pos.y - mid_y;

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
