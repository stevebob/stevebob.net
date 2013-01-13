var ctx; //the 2d context of the canvas element
document.onclick = randomColour;
var colour = [];
current = 4;
other = 1;
colour[0] =  "200, 0, 255";
colour[1] =  "255, 255, 255";
colour[2] =  "255, 220, 100";
colour[3] =  "0, 50, 255";
colour[4] =  "0, 255, 0";
colour[5] =  "0, 255, 255";
colour[6] =  "155, 0, 0";

function randomColour() {
    current =Math.floor(Math.random() * 7);
    if (Math.floor(Math.random()*2)) {
        other = -1;
    } else {
        other =Math.floor(Math.random() * 7);
        
    }
}

var drawArea;

var t;

var spin = 0.02;
    
var left = 10;
var right = 10;

var max = 15;

var count = 8;

function main() {
setUpCanvas();
adjustSize();

    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0,1)";
    ctx.fillRect(0, 0 ,1280, 800);
    ctx.fill();

var target;
var start = [];

var target = new Vector3(0, 0, 0);

for (var i = 0;i<count;i++) {

    var theta = Math.random() * Math.PI * 2;
    var phi = Math.random() * Math.PI - Math.PI/2;


    var x = Math.sin(theta) * Math.cos(phi) * max;
    var y = Math.cos(theta) * Math.cos(phi) * max;
    var z = Math.sin(phi) * max;


    start[i] = new Vector3(x, y, z);
}

once(0, target, start, 0);

}

function clear() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 0,1)";
    ctx.fillRect(0, 0 ,winW, winH);
    ctx.fill();
}

function once(a, target, start, n) {

clear();

for (var j = 0; j<count;j++) {


if (Math.random() < 1/100) {

    var theta = Math.random() * Math.PI * 2;
    var phi = Math.random() * Math.PI - Math.PI/2;


    var x = Math.sin(theta) * Math.cos(phi) * max;
    var y = Math.cos(theta) * Math.cos(phi) * max;
    var z = Math.sin(phi) * max;
    
    start[j] = new Vector3(x, y, z);
}
if (Math.random() < 1/2) {

var world = new Three();


addPoint(world, target.x, target.y, target.z);
addPoint(world, start[j].x, start[j].y, start[j].z);

var tmp;
var last = start[j];

var i = 2;

var col;


    if (other == -1 || Math.floor(Math.random()*2)) {
        col = colour[current];
    } else {
        col = colour[other];
    }

while (distance(last, target) > 0.1) {
//while (i<20) {

    tmp = nextPt(0.1, 15, last, target);
    addPoint(world, tmp.x, tmp.y, tmp.z);

    if (other == -1 || Math.floor(Math.random()*2)) {
        addEdge(world, i-1, i, col);
    } else {
        addEdge(world, i-1, i, col);
    }

    last = tmp;
    i++;
}

    var xAngle = -a;
    var yAngle = -a - Math.PI/2;


    world.xDir = new Vector3(Math.cos(xAngle), Math.sin(xAngle), 0);
    world.yDir = new Vector3(Math.cos(yAngle), Math.sin(yAngle), 0);
    

    for (var k = 1;k<5;k++) {
    drawPerspectiveEdges(world, 6*Math.pow(2, -k), k*0.2);

    }

}
}



t = setTimeout(once, 1, a + spin, target, start, n+1);

}
