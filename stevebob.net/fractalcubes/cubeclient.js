var t;
var spin = 0.01;

function client() {
    
    setUpCanvas();
    adjustSize();

    var three = new Three();
    var fractal = new FractalWorld(-10, 10, -10, 10);

    fractalClient(fractal);

    copyLines(three, fractal);

    rotate(0, three, fractal);
}


function copyLines(three, fractal) {
    
    for (var i in fractal.lines) {
        
        //alert(fractal.lines[i].b.z);

        addEdge(three, addPoint(three, fractal.lines[i].a.x, fractal.lines[i].a.y, fractal.lines[i].a.z), addPoint(three, fractal.lines[i].b.x, fractal.lines[i].b.y, fractal.lines[i].b.z));

    
    }

}


function fractalClient(world) {
    
    var line = new Shape();
    line.lines[0] = new FractLine(new PolarPt(Math.sqrt(2), Math.PI/4, Math.PI/4), new PolarPt(Math.sqrt(2), -Math.PI/4, Math.PI/4));
    line.lines[1] = new FractLine(new PolarPt(Math.sqrt(2), Math.PI/4, Math.PI/4), new PolarPt(Math.sqrt(2), Math.PI/4, -Math.PI/4));
    line.lines[2] = new FractLine(new PolarPt(Math.sqrt(2), -Math.PI/4, -Math.PI/4), new PolarPt(Math.sqrt(2), Math.PI/4, -Math.PI/4));
    line.lines[3] = new FractLine(new PolarPt(Math.sqrt(2), -Math.PI/4, -Math.PI/4), new PolarPt(Math.sqrt(2), -Math.PI/4, Math.PI/4));

    line.lines[4] = new FractLine(new PolarPt(-Math.sqrt(2), Math.PI/4, Math.PI/4), new PolarPt(-Math.sqrt(2), -Math.PI/4, Math.PI/4));
    line.lines[5] = new FractLine(new PolarPt(-Math.sqrt(2), Math.PI/4, Math.PI/4), new PolarPt(-Math.sqrt(2), Math.PI/4, -Math.PI/4));
    line.lines[6] = new FractLine(new PolarPt(-Math.sqrt(2), -Math.PI/4, -Math.PI/4), new PolarPt(-Math.sqrt(2), Math.PI/4, -Math.PI/4));
    line.lines[7] = new FractLine(new PolarPt(-Math.sqrt(2), -Math.PI/4, -Math.PI/4), new PolarPt(-Math.sqrt(2), -Math.PI/4, Math.PI/4));

    
    line.lines[8] = new FractLine(new PolarPt(-Math.sqrt(2), Math.PI/4, Math.PI/4), new PolarPt(Math.sqrt(2), -Math.PI/4, -Math.PI/4));
    line.lines[9] = new FractLine(new PolarPt(-Math.sqrt(2), -Math.PI/4, Math.PI/4), new PolarPt(Math.sqrt(2), Math.PI/4, -Math.PI/4));
    line.lines[10] = new FractLine(new PolarPt(-Math.sqrt(2), -Math.PI/4, -Math.PI/4), new PolarPt(Math.sqrt(2), Math.PI/4, Math.PI/4));
    line.lines[11] = new FractLine(new PolarPt(-Math.sqrt(2), Math.PI/4, -Math.PI/4), new PolarPt(Math.sqrt(2), -Math.PI/4, Math.PI/4));


    world.fractals[0] = new FractDetail(line, 4, new CartPt(0, 0, -3), 4, 0, 0);

    world.fractals[0].repeats[0] = new Repeat(0.5, 0, 0, new PolarPt(1, Math.PI/2, Math.PI/8));
    world.fractals[0].repeats[1] = new Repeat(0.5, 0, 0, new PolarPt(1, -Math.PI/2, Math.PI/8));
    world.fractals[0].repeats[2] = new Repeat(0.5, 0, 0, new PolarPt(-1, Math.PI/2, Math.PI/8));
    world.fractals[0].repeats[3] = new Repeat(0.5, 0, 0, new PolarPt(-1, -Math.PI/2, Math.PI/8));
    
    world.fCount = 1;

    makeFractals(world);

}


function rotate(t, world, fractal) {
    var xAngle = t;
    var yAngle = t + Math.PI/2;

    world.xDir = new Vector(Math.cos(xAngle), Math.sin(xAngle), 0);
    world.yDir = new Vector(Math.cos(yAngle), Math.sin(yAngle), 0);
    
    clear(fractal);

    drawPerspectiveEdges(world);

    t = setTimeout(rotate, 1, t+spin, world, fractal);
    
}
