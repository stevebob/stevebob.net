
var ctx; //the 2D canvas context that is used for drawing


var mouseX, mouseY;

var t;



function addLine(world, line) {
    world.lines[world.lCount] = line;
    world.lCount++;
}

//draw a single line
function drawLine(world, line) {
    ctx.beginPath();
    ctx.strokeStyle = line.colour;
    ctx.lineWidth = line.width;

    ctx.moveTo(winW * ((line.a.x - world.xMin)/world.xRange), winH * (1 - ((line.a.y - world.yMin)/world.yRange)));
    ctx.lineTo(winW * ((line.b.x - world.xMin)/world.xRange), winH * (1 - ((line.b.y - world.yMin)/world.yRange)));
    ctx.stroke();

}

function drawAllLines(world) {
    for (var i in world.lines) {
        drawLine(world, world.lines[i]);
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
        
        addLine(world, new Line(cartA, cartB, 2));
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
    //alert();   
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
    ctx.beginPath();
    ctx.fillStyle = world.blank;
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}

function drawFractal(world) {
    clear(world);
    makeFractals(world);
    drawAllLines(world);
    world.lCount = 0;
    world.lines.length = 0;
}

//----------------------------Canvas Stuff---------------------------
function setUpCanvas() {
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    adjustSize();
}


