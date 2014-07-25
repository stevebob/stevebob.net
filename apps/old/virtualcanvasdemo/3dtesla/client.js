
document.onkeydown = keyPressHandle;

var variety = 4;

var t;
var spin = 0.02;


function client() {
    
    setUpCanvas();
    adjustSize();

    var three = new Three();
    var fractal = new FractalWorld(-10, 10, -10, 10);
    
    
    var mode = Math.floor(Math.random()*variety);

    if (mode == 0) {
        saddle(fractal);
    } else if (mode == 1) {
        cubes(fractal);
    } else if (mode == 2) {
        tree(fractal);
    } else if (mode == 3) {
        swirl(fractal);
    }
    copyLines(three, fractal);

    rotate(0, three, fractal);
}


function copyLines(three, fractal) {
    
    for (var i in fractal.lines) {
        
        addEdge(three, addPoint(three, fractal.lines[i].a.x, fractal.lines[i].a.y, fractal.lines[i].a.z), addPoint(three, fractal.lines[i].b.x, fractal.lines[i].b.y, fractal.lines[i].b.z));
    
    }

}

function makeCube(shape, x, y, z, s) {

    shape.lines[shape.lines.length] = new FractLine(new Vector3(x+s, y+s, z+s), new Vector3(x+s, y+s, z-s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x+s, y+s, z-s), new Vector3(x+s, y-s, z-s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x+s, y-s, z-s), new Vector3(x+s, y-s, z+s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x+s, y-s, z+s), new Vector3(x+s, y+s, z+s));

    shape.lines[shape.lines.length] = new FractLine(new Vector3(x-s, y+s, z+s), new Vector3(x-s, y+s, z-s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x-s, y+s, z-s), new Vector3(x-s, y-s, z-s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x-s, y-s, z-s), new Vector3(x-s, y-s, z+s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x-s, y-s, z+s), new Vector3(x-s, y+s, z+s));

    shape.lines[shape.lines.length] = new FractLine(new Vector3(x+s, y+s, z+s), new Vector3(x-s, y+s, z+s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x+s, y+s, z-s), new Vector3(x-s, y+s, z-s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x+s, y-s, z-s), new Vector3(x-s, y-s, z-s));
    shape.lines[shape.lines.length] = new FractLine(new Vector3(x+s, y-s, z+s), new Vector3(x-s, y-s, z+s));


}

function swirl(world) {

    var line = new Shape();
 
    

    makeCube(line, 2, -2, 2, 0.5);
    makeCube(line, 2, -2, -2, 0.5);
    makeCube(line, -2, -2, -2, 0.5);
    makeCube(line, -2, -2, 2, 0.5);
    
    makeCube(line, 2, 2, 2, 0.5);
    makeCube(line, 2, 2, -2, 0.5);
    makeCube(line, -2, 2, -2, 0.5);
    makeCube(line, -2, 2, 2, 0.5);
    
    var s = 1.9;

    var axis = new AxisSet();
    axis.x = new Vector3(s, 0, 0);
    axis.y = new Vector3(0, s, 0);
    axis.z = new Vector3(0, 0, s);

    world.fractals[0] = new FractDetail(line, 12, new Vector3(0, 0, 0), axis);
    world.fractals[0].repeats[0] = new Repeat(0.7, new Vector3(0, 0, 0), Math.PI/12, Math.PI/12, 0);
    

    world.fCount = 1;
    
    makeFractals(world);
}

function tree(world) {

    
    var line = new Shape();

    line.lines[0] = new FractLine(new Vector3(0, 0, 0), new Vector3(0, 0, 2));
    
    var s = 2;

    var axis = new AxisSet();
    axis.x = new Vector3(s, 0, 0);
    axis.y = new Vector3(0, s, 0);
    axis.z = new Vector3(0, 0, s);

    world.fractals[0] = new FractDetail(line, 6, new Vector3(0, 0, -5), axis);
    
    world.fractals[0].repeats[0] = new Repeat(0.75, new Vector3(0, 0, 2), Math.PI/6, 0, 0);
    world.fractals[0].repeats[1] = new Repeat(0.75, new Vector3(0, 0, 2), -Math.PI/6, 0, 0);
    world.fractals[0].repeats[2] = new Repeat(0.75, new Vector3(0, 0, 2), 0, Math.PI/6, 0);
    world.fractals[0].repeats[3] = new Repeat(0.75, new Vector3(0, 0, 2), 0, -Math.PI/6, 0);

    
    world.fCount = 1;
    
    makeFractals(world);
}

function saddle(world) {

    
    var line = new Shape();

    line.lines[0] = new FractLine(new Vector3(0, 0, -2), new Vector3(0, 0, 2));
    
    var s = 1.5;

    var axis = new AxisSet();
    axis.x = new Vector3(s, 0, 0);
    axis.y = new Vector3(0, s, 0);
    axis.z = new Vector3(0, 0, s);

    world.fractals[0] = new FractDetail(line, 6, new Vector3(0, 0, 0), axis);
    
    world.fractals[0].repeats[0] = new Repeat(0.75, new Vector3(2, 0, 0), 0, Math.PI/6, 0);
    world.fractals[0].repeats[1] = new Repeat(0.75, new Vector3(-2, 0, 0), 0, -Math.PI/6, 0);
    world.fractals[0].repeats[2] = new Repeat(0.75, new Vector3(0, 2, 0), -Math.PI/6, 0, 0);
    world.fractals[0].repeats[3] = new Repeat(0.75, new Vector3(0, -2, 0), Math.PI/6, 0, 0);
    
    world.fCount = 1;
    
    makeFractals(world);
}


function cubes(world) {
    
    var line = new Shape();
    line.lines[0] = new FractLine(new Vector3(2, 2, 2), new Vector3(2, 2, -2));
    line.lines[1] = new FractLine(new Vector3(2, -2, 2), new Vector3(2, -2, -2));
    line.lines[2] = new FractLine(new Vector3(-2, 2, 2), new Vector3(-2, 2, -2));
    line.lines[3] = new FractLine(new Vector3(-2, -2, 2), new Vector3(-2, -2, -2));
    
    line.lines[4] = new FractLine(new Vector3(2, 2, 2), new Vector3(2, -2, 2));
    line.lines[5] = new FractLine(new Vector3(2, -2, 2), new Vector3(-2, -2, 2));
    line.lines[6] = new FractLine(new Vector3(-2, -2, 2), new Vector3(-2, 2, 2));
    line.lines[7] = new FractLine(new Vector3(2, 2, 2), new Vector3(-2, 2, 2));
    
    line.lines[8] = new FractLine(new Vector3(2, 2, -2), new Vector3(2, -2, -2));
    line.lines[9] = new FractLine(new Vector3(2, -2, -2), new Vector3(-2, -2, -2));
    line.lines[10] = new FractLine(new Vector3(-2, -2, -2), new Vector3(-2, 2, -2));
    line.lines[11] = new FractLine(new Vector3(2, 2, -2), new Vector3(-2, 2, -2));

    //line.lines[0] = new FractLine(new Vector3(0, 0, -2), new Vector3(0, 0, 2));
    
    var s = 1;

    var axis = new AxisSet();
    axis.x = new Vector3(s, 0, 0);
    axis.y = new Vector3(0, s, 0);
    axis.z = new Vector3(0, 0, s);

    world.fractals[0] = new FractDetail(line, 6, new Vector3(0, 0, 0), axis);
    
    /*
    world.fractals[0].repeats[0] = new Repeat(0.75, new Vector3(2, 0, 0), 0, Math.PI/6, 0);
    world.fractals[0].repeats[1] = new Repeat(0.75, new Vector3(-2, 0, 0), 0, -Math.PI/6, 0);
    world.fractals[0].repeats[2] = new Repeat(0.75, new Vector3(0, 2, 0), -Math.PI/6, 0, 0);
    world.fractals[0].repeats[3] = new Repeat(0.75, new Vector3(0, -2, 0), Math.PI/6, 0, 0);
*/
    world.fractals[0].repeats[0] = new Repeat(0.6, new Vector3(3.2, 3.2, 3.2), Math.PI/8, Math.PI/8, Math.PI/8);
    world.fractals[0].repeats[1] = new Repeat(0.6, new Vector3(-3.2, -3.2, -3.2), Math.PI/8, Math.PI/8, Math.PI/8);
    
    world.fCount = 1;
    
    makeFractals(world);

}


function rotate(a, world, fractal) {
    var xAngle = -a;
    var yAngle = -a - Math.PI/2;

    world.xDir = new Vector3(Math.cos(xAngle), Math.sin(xAngle), 0);
    world.yDir = new Vector3(Math.cos(yAngle), Math.sin(yAngle), 0);
    
    clear(fractal);

    drawPerspectiveEdges(world);

    t = setTimeout(rotate, 1, a+spin, world, fractal);
    
}

function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == 82) {
        clearTimeout(t);
        client();
    }
        
}
