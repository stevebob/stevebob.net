

function client() {
    
    setUpCanvas();
    adjustSize();

    var three = new Three();

    testShape(three);

    rotate(0, three);


}
 
var t;

var speed = 0.005;

function rotate(r, world) {

    var xAngle = -r;
    var yAngle = -r - Math.PI/2;
    


    world.xDir = new Vector(Math.cos(xAngle), Math.sin(xAngle), 0);
    world.yDir = new Vector(Math.cos(yAngle), Math.sin(yAngle), 0);
    
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();

    drawPerspectiveFaces(world);

    t = setTimeout(rotate, 10, r+speed, world);
}
