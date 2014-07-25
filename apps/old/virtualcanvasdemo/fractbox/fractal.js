
var winW = 1280;
var winH = 800;
var drawArea1; //the canvas element object
var ctx1; //the 2D canvas context that is used for drawing


var mouseX, mouseY;

var t1;


function World(xMin, xMax, yMin, yMax) {
    this.blank = "rgba(0, 0, 0, 1)"; //the colour used for clearing the canvas
    this.fractals = []; //array of pointers to fractals (FractDetail)
    this.fCount = 0; //the number of fractals
    this.lines = []; //array of lines that must be drawn
    this.lCount = 0; //the number of lines
    
    //the dimensions of the plane on which lines will be drawn
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.xRange = xMax - xMin;
    this.yRange = yMax - yMin;
}

//cartesian coordinate
function CartPt(x, y) {
    this.x = x;  
    this.y = y;
}

//polar coordinate
function PolarPt(rad, theta) {
    this.rad = rad; //distance from centre
    this.theta = theta; //angle
}

//a polar representation of a shape made up of points and joining lines
function Shape() {
    this.lines = []; //array of pointers to lines between points
}

//a pair of points
function Line1(a, b, width) {
    this.a = a; //pointer to first point
    this.b = b; //point to second point
    this.colour = "rgba(255, 255, 255, 0.75)";
    this.width = width;
}

//details of a recursion
function Repeat(sizeChange, angleChange, start) {
    this.sizeChange = sizeChange; //change in size of shape
    this.angleChange = angleChange; //angle of rotation of shape
    this.start = start; //pointer to polar coordinate of centre of next shape
}

//details of the entire fractal
function FractDetail(shape, depth, start, initialUnit, initialAngle) {
    this.shape = shape; //pointer to shape
    this.depth = depth; //number of recurances
    this.start = start; //pointer to cartesian pt at centre of first shape
    this.repeats = []; //array of pointers to repetitions
    this.initialUnit = initialUnit; //the size of 1 unit in the base shape
    this.initialAngle = initialAngle; //the 0 radians global angle of the base shape
}

function addLine1(world, line) {
    world.lines[world.lCount] = line;
    world.lCount++;
}

//draw a single line
function drawLine1(world, line) {
    ctx1.beginPath();
    ctx1.strokeStyle = line.colour;
    ctx1.lineWidth = line.width;

    var realPt = []; //the actual points on the canvas
    
    ctx1.moveTo(winW * ((line.a.x - world.xMin)/world.xRange), winH * (1 - ((line.a.y - world.yMin)/world.yRange)));
    ctx1.lineTo(winW * ((line.b.x - world.xMin)/world.xRange), winH * (1 - ((line.b.y - world.yMin)/world.yRange)));



    ctx1.stroke();

}

function drawAllLine1s(world) {
    for (var i in world.lines) {
        drawLine1(world, world.lines[i]);
    }
}

function makeShape(world, shape, centre, unit, angle) {
    
    for (var i in shape.lines) {
        var cartA = new CartPt();
        var cartB = new CartPt();
        cartA.x = centre.x + unit*shape.lines[i].a.rad*Math.cos(shape.lines[i].a.theta + angle);
        cartA.y = centre.y + unit*shape.lines[i].a.rad*Math.sin(shape.lines[i].a.theta + angle);

        cartB.x = centre.x + unit*shape.lines[i].b.rad*Math.cos(shape.lines[i].b.theta + angle);
        cartB.y = centre.y + unit*shape.lines[i].b.rad*Math.sin(shape.lines[i].b.theta + angle);
        addLine1(world, new Line1(cartA, cartB, unit*15));
    }
}

//a wrapper for the actual recursive fractal function
function makeFractals(world) {
    for (var i = 0;i<world.fCount;i++) {
        detail = world.fractals[i];


        stackFractalMaker(world, detail.depth, detail.shape, detail.start, detail.repeats, detail.initialUnit, detail.initialAngle);
    }
}

function stackFractalMaker(world, depth, shape, centre, repeats, unit, angle) {
    
    depth--;
    

    makeShape(world, shape, centre, unit, angle);

    if (depth > 0) {
        for (var i in repeats) {
            stackFractalMaker(world, depth, shape, centreMod(centre, repeats[i], unit, angle), repeats, unit*repeats[i].sizeChange, angle+repeats[i].angleChange);
        }
    }

}


function centreMod(centre, repeat, unit, angle) {
    return new CartPt(centre.x + unit*repeat.start.rad*Math.cos(repeat.start.theta + angle), 
                      centre.y + unit*repeat.start.rad*Math.sin(repeat.start.theta + angle)
                     );
}


function clear(world) {
    ctx1.beginPath();
    ctx1.fillStyle = world.blank;
    ctx1.fillRect(0, 0, winW, winH);
    ctx1.fill();
}

//----------------------------Client Stuff-----------------------

var fract_flag = 0;

function client1(angle) {
    
    if (!fract_flag) {
        setUpCanvas1();
        fract_flag = 1;
    }
    
    var world = new World(-10, 10, -10, 10);
    
    var square = new Shape();
    square.lines[0] = new Line1(new PolarPt(3, Math.PI/4), new PolarPt(3, -Math.PI/4));
    square.lines[1] = new Line1(new PolarPt(3, -3*Math.PI/4), new PolarPt(3, -Math.PI/4));
    square.lines[2] = new Line1(new PolarPt(3, 3*Math.PI/4), new PolarPt(3, -3*Math.PI/4));
    square.lines[3] = new Line1(new PolarPt(3, 3*Math.PI/4), new PolarPt(3, Math.PI/4));
    
    world.fractals[0] = new FractDetail(square, 5, new CartPt(0, 0), 1, 0);
    
    var min = 5;



    world.fractals[0].repeats[0] = new Repeat(0.4 + 0.2 * Math.sin(angle), Math.sin(angle)*Math.PI/16, new PolarPt(min + Math.sin(angle), Math.PI/4));
    world.fractals[0].repeats[1] = new Repeat(0.4 + 0.2 * Math.sin(angle+Math.PI/2), -Math.sin(angle + Math.PI/2)*Math.PI/16, new PolarPt(min + Math.sin(angle+Math.PI/2), 3*Math.PI/4));
    world.fractals[0].repeats[2] = new Repeat(0.4 + 0.2 * Math.sin(angle+Math.PI), Math.sin(angle + Math.PI)*Math.PI/16, new PolarPt(min + Math.sin(angle+Math.PI), -3*Math.PI/4));
    world.fractals[0].repeats[3] = new Repeat(0.4 + 0.2 * Math.sin(angle+3*Math.PI/2), -Math.sin(angle + 3*Math.PI/2)*Math.PI/16, new PolarPt(min + Math.sin(angle+3*Math.PI/2), -Math.PI/4));
    world.fCount = 1;

    //clear(world);
    ctx1.beginPath();
    ctx1.fillStyle = world.blank;
    ctx1.fillRect(0, 0, 1280, 800);
    ctx1.fill();   

    makeFractals(world);
    drawAllLine1s(world);
    t1 = setTimeout(client1, 1, angle + Math.PI/128);
}

//----------------------------Canvas Stuff---------------------------
function setUpCanvas1() {
    drawArea1 = document.getElementById("screen");
    
    if (drawArea1.getContext) {
        //ctx1 = drawArea1.getContext("2d");
        ctx1 = new SimpleVirtualCanvas(new FullScreenCanvas(drawArea1),
                                        20, 400,
                                        200, 200,
                                        0.4, -Math.PI/32
                    );
    }
    updateDimensions1();
}


function updateDimensions1() {
  /*  if (parseInt(navigator.appVersion)>3) {
        if (navigator.appName=="Netscape") {
            winH = window.innerHeight;
            winW = window.innerWidth;
        }
        if (navigator.appName.indexOf("Microsoft")!=-1) {
            winH = document.body.offsetHeight;
            winW = document.body.offsetWidth;
        }
    }
    */
   // drawArea1.height = winH;
   // drawArea1.width = winW;


}

//--------------------------------mouse stuff


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

function handleMove() {
    updateMousePos();

    var realX = mouseX - winW/2;
    var realY = winH/2 - mouseY;

    
    var abs = Math.abs(Math.atan(realY/realX));
    var angle;

    if (realX > 0) {
        if (realY > 0) {
            angle = abs;
        } else if (realY < 0) {
            angle = -abs;
        }
    } else if (realX < 0) {
        if (realY > 0) {
            angle = Math.PI-abs;
        } else if (realY < 0) {
            angle = abs-Math.PI;
        }
    }
        

    document.getElementById("header").innerHTML = angle;
    

}



