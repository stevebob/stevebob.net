
function World(xMin, xMax, yMin, yMax) {
    this.blank = "rgba(255, 255, 255, 1)"; //the colour used for clearing the canvas
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
function Line(a, b, width) {
    this.a = a; //pointer to first point
    this.b = b; //point to second point
    this.colour = "rgba(0, 0, 0, 1)";
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
