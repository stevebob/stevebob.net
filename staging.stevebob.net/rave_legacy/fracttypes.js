
function FractalWorld(xMin, xMax, yMin, yMax) {
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

function CartPt(x, y, z) {
    this.x = x;  
    this.y = y;
    this.z = z;
}

//polar coordinate
function PolarPt(rad, theta, phi) {
    this.rad = rad; //distance from centre
    this.theta = theta; //angle
    this.phi = phi; //other angle
}

//a polar representation of a shape made up of points and joining lines
function Shape() {
    this.lines = []; //array of pointers to lines between points
}

//a pair of points
function FractLine(a, b, width) {
    this.a = a; //pointer to first point
    this.b = b; //point to second point
    this.colour = "rgba(255, 255, 255, 0.75)";
    this.width = width;
}

//details of a recursion
function Repeat(scale, start, xR, yR, zR) {
    this.scale = scale; //change in size of shape
    this.start = start; //pointer to vector representing centre of next shape
    this.xR = xR;       //Rotations
    this.yR = yR;       //
    this.zR = zR;       //
}

//details of the entire fractal
function FractDetail(shape, depth, start, axis) {
    this.shape = shape; //pointer to shape
    this.depth = depth; //number of recurances
    this.start = start; //pointer to cartesian pt at centre of first shape
    this.repeats = []; //array of pointers to repetitions
    this.axis = axis;
}


function AxisSet(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

