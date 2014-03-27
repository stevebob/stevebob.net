var ctx; //the 2d context of the canvas element

function Three() {
    this.point = [];
    this.pCount = 0;
    this.eye = new Vector(0, 0, 0);
    this.xDir = new Vector(1, 0, 0);
    this.yDir = new Vector(0, 1, 0);
    this.zDir = new Vector(0, 0, 1);


    this.frame= 0.1;
}



function testShape(world) {
 
    addPoint(world, -2, 2, 2)
    addPoint(world, 2, 2, 2)
    addPoint(world, 2, -2, 2)
    addPoint(world, -2, -2, 2)
    addPoint(world, -2, 2, -2)
    addPoint(world, 2, 2, -2)
    addPoint(world, 2, -2, -2)
    addPoint(world, -2, -2, -2)

}

function addPoint(world, x, y, z) {
    world.point[world.pCount] = new Vector(x, y, z);
    world.pCount++;
    return world.pCount - 1;
}





function drawVector(a) {
    
    var xMin = -10;
    var xMax = 10;
    var yMin = -10;
    var yMax = 10;
    
    var xSpan = xMax - xMin;
    var ySpan = yMax - yMin;
    
    ctx.beginPath();
    ctx.moveTo((-xMin/xSpan)*winW, (1-(-yMin/ySpan))*winH);
    ctx.lineTo(((a.x-xMin)/xSpan)*winW, (1-(a.y-yMin)/ySpan)*winH);
    ctx.stroke();

}




function drawPerspectivePoints(world) {
    var xMin = -15;
    var xMax = 15;
    var yMin = -10;
    var yMax = 10;

    var eyeHt = 10;
    
    var horiz = 0;

    var lDotSize = 10;

    var minSize = 3;

    var xSpan = xMax - xMin;
    var ySpan = yMax - yMin;

    for (var i = 0;i<world.pCount;i++) {
        var tmp = world.point[i];
        var copy = addVector(tmp, world.eye);

        var x0 = sLength(copy, world.xDir);
        var y0 = sLength(copy, world.yDir);
        var z0 = sLength(copy, world.zDir);

        var inFront = (y0 > -1* eyeHt);
        
        lDotSize = (minSize + Math.pow(2, -y0))*dotSize;

        if (x0 == 0) {
            x0 = 0.001;
        }
        var a = x0 - (x0*y0)/(horiz+eyeHt+y0);
        var b = z0 + ((horiz - z0)*(x0 - a))/x0;

        if (inFront) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(" + dotColour + ", " + dotOpacity + ")";
            //ctx.fillRect( ((a-xMin)/xSpan)*winW - lDotSize/2, (1-(b-yMin)/ySpan)*winH - lDotSize/2, lDotSize, lDotSize );
            
            ctx.arc( ((a-xMin)/xSpan)*winW, (1-(b-yMin)/ySpan)*winH, lDotSize, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }
    }
}






//--------------------canvas-------------------

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    adjustSize();
}

function clear(op) {

    ctx.beginPath();
    ctx.fillStyle = "rgba(" + bgColour + ", " + op + ")";
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();

}
