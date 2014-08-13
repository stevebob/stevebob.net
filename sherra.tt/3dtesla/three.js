function Three() {
    this.point = [];
    this.edge = [];
    this.face = [];
    this.pCount = 0;
    this.eCount = 0;
    this.fCount  = 0;
    this.eye = new Vector(0, 0, 0);
    this.xDir = new Vector(1, 0, 0);
    this.yDir = new Vector(0, 1, 0);
    this.zDir = new Vector(0, 0, 1);

    this.eyeVel = new Vector(0, 0, 0);
    this.eyeAccel = new Vector(0.05, 0.05, 0);

    this.maxEyeVel = new Vector(0.4, 0.4, 0);

    this.frame= 0.1;
}

function Line(e0, e1, col) {
    this.e0 = e0;
    this.e1 = e1;
    this.col = col;
}

function Face(v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
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

    addEdge(world, 0, 1);
    addEdge(world, 1, 2);
    addEdge(world, 2, 3);
    addEdge(world, 3, 0);
    addEdge(world, 4, 5);
    addEdge(world, 5, 6);
    addEdge(world, 6, 7);
    addEdge(world, 7, 4);
    addEdge(world, 0, 4);
    addEdge(world, 1, 5);
    addEdge(world, 2, 6);
    addEdge(world, 3, 7);

    addFace(world, 3, 6, 2);
    addFace(world, 0, 5, 4);
}

function addPoint(world, x, y, z) {
    world.point[world.pCount] = new Vector(x, y, z);
    world.pCount++;
    return world.pCount - 1;
}

function addEdge(world, e0, e1, col) {
    world.edge[world.eCount] = new Line(e0, e1, col);
    world.eCount++;
}

function addFace(world, v0, v1, v2) {
    world.face[world.fCount] = new Face(v0, v1, v2);
    world.fCount++;
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


function drawPerspectiveFaces(world) {
    var xMin = -15;
    var xMax = 15;
    var yMin = -10;
    var yMax = 10;

    var eyeHt = -100;
    
    var horiz = 0;

    var dotSize = 10;

    var xSpan = xMax - xMin;
    var ySpan = yMax - yMin;

    ctx.fillStyle = "black";

    for (var i = 0;i<world.fCount;i++) {
        var ptArray = [];
        ptArray[0] = addVector(world.eye, world.point[world.face[i].v0]);
        ptArray[1] = addVector(world.eye, world.point[world.face[i].v1]);
        ptArray[2] = addVector(world.eye, world.point[world.face[i].v2]);

        ctx.beginPath();
        
        for (var j = 0;j<4;j++) {

            var x = sLength(ptArray[j%3], world.xDir);
            var y = sLength(ptArray[j%3], world.yDir);
            var z = sLength(ptArray[j%3], world.zDir);
        
            var a = x - (x*y)/(horiz+eyeHt+y);
            var b = z + ((horiz - z)*(x - a))/x;
            
            if (j==0) {
                ctx.moveTo( ((a-xMin)/xSpan)*winW - dotSize/2, (1-(b-yMin)/ySpan)*winH - dotSize/2, dotSize, dotSize );
            }
            ctx.lineTo( ((a-xMin)/xSpan)*winW - dotSize/2, (1-(b-yMin)/ySpan)*winH - dotSize/2, dotSize, dotSize );
        }

        ctx.fill();
        //ctx.fillStyle = "red";
    }
}



function drawPerspectiveEdges(world, width, trans) {
    var xMin = -15;
    var xMax = 15;
    var yMin = -10;
    var yMax = 10;

    var eyeHt = 10;
    
    var horiz = 0;

    var dotSize = 10;

    var xSpan = xMax - xMin;
    var ySpan = yMax - yMin;

    //alert("begin");
    for (var i = 0;i<world.eCount;i++) {
        var tmp = world.point[world.edge[i].e0];
        var copy = addVector(tmp, world.eye);

        var x0 = sLength(copy, world.xDir);
        var y0 = sLength(copy, world.yDir);
        var z0 = sLength(copy, world.zDir);
        
        tmp = world.point[world.edge[i].e1];
        copy = addVector(tmp, world.eye);
        
        var x1 = sLength(copy, world.xDir);
        var y1 = sLength(copy, world.yDir);
        var z1 = sLength(copy, world.zDir);
        
        if (x0 == 0) {
            x0 = 0.001;
        }
        var a0 = x0 - (x0*y0)/(horiz+eyeHt+y0);
        var b0= z0 + ((horiz - z0)*(x0 - a0))/x0;


        if (x1 == 0) {
            x1 = 0.001;
        }
        var a1 = x1 - (x1*y1)/(horiz+eyeHt+y1);
        var b1 = z1 + ((horiz - z1)*(x1 - a1))/x1;

//alert(a0 + ", " + b0 + ", " + a1 + ", " + b1);

        var inFront = (y0 > -1* eyeHt);

        if (inFront) {
        ctx.beginPath();
        ctx.lineWidth = 2*Math.pow(2.17, -y0/2) * width;
        
        ctx.strokeStyle = "rgba(" + world.edge[i].col + ", "+trans+")";
        
        ctx.moveTo( ((a0-xMin)/xSpan)*winW - dotSize/2, (1-(b0-yMin)/ySpan)*winH - dotSize/2, dotSize, dotSize );
        ctx.lineTo( ((a1-xMin)/xSpan)*winW - dotSize/2, (1-(b1-yMin)/ySpan)*winH - dotSize/2, dotSize, dotSize );
        ctx.stroke();
    }
    }
    //alert("end");
}

function drawPerspectivePoints(world) {
    var xMin = -15;
    var xMax = 15;
    var yMin = -10;
    var yMax = 10;

    var eyeHt = -1;
    
    var dotSize = 10;

    var xSpan = xMax - xMin;
    var ySpan = yMax - yMin;

    for (var i = 0;i<world.pCount;i++) {
        var x = sLength(world.point[i], world.xDir);
        var y = sLength(world.point[i], world.yDir);
        var z = sLength(world.point[i], world.zDir);
        
        var a = x - (x*y)/(ySpan+eyeHt+y);
        var b = z + ((ySpan - z)*(x - a))/x;

        ctx.beginPath();
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect( ((a-xMin)/xSpan)*winW - dotSize/2, (1-(b-yMin)/ySpan)*winH - dotSize/2, dotSize, dotSize );
        ctx.fill();
    }
}

function drawTopDown(world) {
    var xMin = -15;
    var xMax = 15;
    var yMin = -10;
    var yMax = 10;
    
    var dotSize = 10;

    var xSpan = xMax - xMin;
    var ySpan = yMax - yMin;

    for (var i = 0;i<world.pCount;i++) {
        var x = sLength(world.point[i], world.xDir);
        var y = sLength(world.point[i], world.yDir);
        
        ctx.beginPath();
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(((x-xMin)/xSpan)*winW - dotSize/2, (1-(y-yMin)/ySpan)*winH - dotSize/2, dotSize, dotSize);
        ctx.fill();
        //alert(((y-yMin)/ySpan)*winH);
    }
}




//--------------------canvas-------------------

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
}


