//This is the script that controls the canvas

//  Function Type Key

//  0.  (for new functions)
//  1. Polynomial Component (*1)
//  2. Sine
//  3. Inverse (1/x)

var xtest = 9;

var mylinewidth = 4;


//  *1 - a polynomial is composed of c1*x^n+c2*x^n-1+...
//  each component will be in the form of c*x^n+m
//  where c, n and m are constants.
//  To plot a polynomial, link several components together by making m
//  point to another component.

//  Paramater Type:
//  0. Number
//  1. Function


//canvas
var ctx;
var drawArea;

//The length of each straight part making up a curve
var quality = 2;

//view window
var xMin = -10;
var xMax = 10;
var yMin = -10;
var yMax = 10;

var xUnit, yUnit;

//refresh rate - number of changes per second
var tick = 100;

//canvas properties
var height, width;

//funCounter variables
var i, j, k;
var x, y;

//a test function
var f = [];

var fills = [];

var cs = [];

//number of functions
var funCount = 0;
var fillCount = 0;
var colCount = 9;

//timer variable
var t;

var bgCol = 2;//"rgb(0, 0, 0)";

function begin() {

    resizeElements();
    setUpCanvas();
    
    redraw();

}


//maek some testing functions
function test() {

/*


    f[0] = new fun();
    
    f[0].id = "abc";
    f[0].type = 2;
    f[0].param = [2, 6.28, 0, 3];
    f[0].paramType = [0, 0, 0, 1];
    f[0].paramRoC = [0, 0, 40, 0];
    f[0].paramfunCount = 4;
    f[0].visible = 1;
    f[0].col = 0;
    

    f[1] = new fun();
    
    f[1].id = 1;
    f[1].type = 2;
    f[1].param = [2, 6.28, 0, 2];
    f[1].paramType = [0, 0, 0, 1];
    f[1].paramRoC = [0, 0, 40, 0];
    f[1].paramfunCount = 4;
    f[1].visible = 1;
    f[1].col = 0;
      
    f[2] = new fun();    
    
    f[2].id = 2;
    f[2].type = 1;
    f[2].param = [1, 1, 0];
    f[2].paramType = [0, 0, 0];
    f[2].paramRoC = [0, 0, 0];
    f[2].paramfunCount = 3;
    f[2].visible = 0;
    f[2].col = 0;
    
    f[3] = new fun();    
    
    f[3].id = "def";
    f[3].type = 1;
    f[3].param = [-1, 1, 0];
    f[3].paramType = [0, 0, 0];
    f[3].paramRoC = [0, 0, 0];
    f[3].paramfunCount = 3;
    f[3].visible = 0;
    f[3].col = 0;

    
    fill[0] = new fill();
    fill[0].id = "demo";
    fill[0].col = 0;
    fill[0].bounds[0] = 0;
    fill[0].bounds[1] = 1;
*/
    
    cs[0] = new colsch();
    
    cs[0].id = "fire";
    cs[0].reds = [255, 255, 255];
    cs[0].blues = [0, 0, 0];
    cs[0].greens = [0, 255, 0];
    
    cs[0].alphas = [0, 0, 0];
    cs[0].spread = [0, 0.5, 1];
    cs[0].variety = 3;

    cs[1] = new colsch();
    
    cs[1].id = "white";
    cs[1].reds = [255, 255];
    cs[1].blues = [255, 255];
    cs[1].greens = [255, 255];
    
    cs[1].alphas = [0, 0];
    cs[1].spread = [0, 1];
    cs[1].variety = 2;


    cs[2] = new colsch();
    
    cs[2].id = "black";
    cs[2].reds = [0, 0];
    cs[2].blues = [0, 0];
    cs[2].greens = [0, 0];
    
    cs[2].alphas = [0, 0];
    cs[2].spread = [0, 1];
    cs[2].variety = 2;
   
    
    cs[3] = new colsch();

    cs[3].id = "matttodd";

    cs[3].reds = [255, 255];
    cs[3].blues = [255, 0];
    cs[3].greens = [0, 100];

    cs[3].alphas = [0, 0];
    cs[3].spread = [0, 1];
    cs[3].variety = 2;



    
    cs[4] = new colsch();

    cs[4].id = "matttoddbg";

    cs[4].reds = [255, 255];
    cs[4].blues = [0, 255];
    cs[4].greens = [100, 0];

    cs[4].alphas = [0, 0];
    cs[4].spread = [0, 1];
    cs[4].variety = 2;


    cs[5] = new colsch();
    cs[5].id = "rainbow";
    cs[5].reds = [255, 255, 255, 0, 0, 255];
    cs[5].blues = [0, 0, 0, 100, 255, 255];
    cs[5].greens = [0, 100, 255, 255, 100, 0];
    cs[5].alphas = [0, 0, 0, 0, 0, 0];
    cs[5].spread = [0, 0.2, 0.4, 0.6, 0.8, 1];
    cs[5].variety = 6;
    
    cs[6] = new colsch();
    cs[6].id = "otherrainbow";
    cs[6].greens = [255, 255, 255, 0, 0, 255];
    cs[6].reds = [0, 0, 0, 100, 255, 255];
    cs[6].blues = [0, 100, 255, 255, 100, 0];
    cs[6].alphas = [0, 0, 0, 0, 0, 0];
    cs[6].spread = [0, 0.2, 0.4, 0.6, 0.8, 1];
    cs[6].variety = 6;
    
    
    cs[7] = new colsch();
    cs[7].id = "seethrough";
    cs[7].reds = [255, 255, 255];
    cs[7].blues = [255, 255, 255];
    cs[7].greens = [255, 255, 255];
    
    cs[7].alphas = [0, 1, 0];
    cs[7].spread = [0, 0.5, 1];
    cs[7].variety = 3;
    
    cs[8] = new colsch();
    cs[8].id = "reverseseethrough";
    cs[8].reds = [255, 255, 255];
    cs[8].blues = [255, 255, 255];
    cs[8].greens = [255, 255, 255];
    
    cs[8].alphas = [1, 0, 1];
    cs[8].spread = [0, 0.5, 1];
    cs[8].variety = 3;


}

//data type for functions
function fun() {
    
    //a unique identifier
    this.id;
    
    //is this function to be drawn?
    this.visible;
    
    //the function's type - see top of file for list of types
    this.type;
    
    //number of paramters of the function
    this.paramfunCount;
    
    //paramater's of function
    this.param = [];
    
    //type of paramater - either a number or another function
    this.paramType = [];
    
    //increase of paramater per second
    this.paramRoC = [];
    
    //colour scheme of the function
    this.col;
}

//fill area data type
function fill() {

    this.id;
    this.bounds = [];
    this.col;
}


//colour scheme data type
function colsch() {

    this.id;
    
    this.reds = [];
    this.blues = [];
    this.greens = [];
    this.alphas = [];
    
    //list of numbers from 0 to 1, each representing a percentage of the x axis
    this.spread = [];
    
    //number of points - there must be at least 2 (0 and 1)
    this.variety;
}

//set up the canvas
function setUpCanvas() {

    drawArea = document.getElementById("rave");
    
    
    if (drawArea.getContext) {
   
        ctx = drawArea.getContext("2d");
    
        ctx.lineWidth = mylinewidth; //temporary until control is added
    }
        
    setView();
    

}

function setView() {

    

    height = drawArea.height;
    width = drawArea.width;
    
    xUnit = (xMax - xMin) / width;
    yUnit = height / (yMax - yMin);

    

}


//draw axis
function axis() {

    height = drawArea.height;
    width = drawArea.width;
    

    ctx.beginPath();
    ctx.strokeStyle = "rgb(0, 0, 0)";

    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    
    ctx.stroke();


}


function getColour(id, xVal) {

    var m;
    var interval;
    
    var found = 0;
    
    var prop = (xVal - xMin) / (xMax - xMin);
    
    var red, green, blue, alpha;
    
    for (m=0;m<cs[id].variety-1 && !found;m++) {
        
        if (prop >= cs[id].spread[m] && prop <= cs[id].spread[m+1]) {
        
            found = 1;
            interval = m;
        
        } 
    }
    
    
    
    red = cs[id].reds[interval] + //what the colour was at the start of this interval
    ((cs[id].reds[interval + 1]-cs[id].reds[interval]) * //the difference between the start and end colours
    ((prop - cs[id].spread[interval])/(cs[id].spread[interval+1]-cs[id].spread[interval]))); //how far along the interval we are
  
    green = cs[id].greens[interval] +
    ((cs[id].greens[interval + 1]-cs[id].greens[interval]) *
    ((prop - cs[id].spread[interval])/(cs[id].spread[interval+1]-cs[id].spread[interval])));
    
    
    blue = cs[id].blues[interval] +
    ((cs[id].blues[interval + 1]-cs[id].blues[interval]) *
    ((prop - cs[id].spread[interval])/(cs[id].spread[interval+1]-cs[id].spread[interval])));
  
    alpha = cs[id].alphas[interval] +
    ((cs[id].alphas[interval + 1]-cs[id].alphas[interval]) *
    ((prop - cs[id].spread[interval])/(cs[id].spread[interval+1]-cs[id].spread[interval])));
    
    return "rgba(" + parseInt(red) + ", " + parseInt(green) + ", " + parseInt(blue) + ", "+ (1-alpha)+")";
    
}


function colourBG() {
    
    var barCount;
    var barWidth;
    var m;
    var a;
    
    height = drawArea.height;
    width = drawArea.width;

    
    
    barCount = parseInt(width/quality) + 1;

    for (m=0;m<barCount;m++) {

        a = xMin + xUnit*m*quality;
    
        ctx.fillStyle = getColour(bgCol, a);
        ctx.fillRect(m*quality, 0, quality, height);
    }
}


//plots a function on the canvas
function draw() {

    

    height = drawArea.height;
    width = drawArea.width;
    
    var result0;
    var result1;
    
    for (i=0;i<width;i += quality) {
        
        
        x = xMin + i * xUnit;
        y = x + xUnit * quality;
        j=i+quality;
        
        for (k=0;k<funCount;k++) {
            
            if (f[k].visible) {
                ctx.beginPath();
                
                
                ctx.strokeStyle = getColour(f[k].col, x);
                
                result0 = evaluate(k, x);
                result1 = evaluate(k, y);

                if (result0 != "div0" && result1 != "div0") {
                    ctx.moveTo(i, height + yUnit * yMin - yUnit*result0);
                    ctx.lineTo(j, height + yUnit * yMin - yUnit*result1);
                
                    ctx.stroke();
                }
            }
        }
        
        for (k=0;k<fillCount;k++) {
        
            ctx.beginPath();
            ctx.fillStyle = getColour(k, x);
            
            
            
            ctx.fillRect(i, (height + yUnit * yMin - yUnit*evaluate(fills[k].bounds[0], x)), j-i, height + yUnit * yMin - yUnit*evaluate(fills[k].bounds[1], y)-(height + yUnit * yMin - yUnit*evaluate(fills[k].bounds[0], y)));
            
            
            //ctx.lineTo(j, height + yUnit * yMin - yUnit*evaluate(fills[k].bounds[1], y));
         
            
            
            
            ctx.stroke();
        
        }
        
    
    }
    
    
}

//Returns the value of a function at a point
function evaluate(id, x) {

    var value;
    var localParam = [];
    
    var m;
    
    for (m=0;m<f[id].paramfunCount;m++) {
        if (f[id].paramType[m] == 0) {
            localParam[m] = f[id].param[m];
        } else if (f[id].paramType[m] == 1) {
            //alert(4);
            localParam[m] = evaluate(f[id].param[m], x);
        }
    }
    
    if (f[id].type == 1) {
        
        value = localParam[0]*(Math.pow(x ,localParam[1]))+localParam[2];
        
    } else if (f[id].type == 2) {
        if (localParam[1] == 0) {
            value = "div0";
        } else {
            value = localParam[0]*Math.sin(x*localParam[1] + localParam[2]) + localParam[3];
        }
    } else if (f[id].type == 3) {
        
        if (x!=0) {
            value = localParam[0]/(x+localParam[1]) + localParam[2];
        }
    }
    
    return value;
}

function power(base, index) {

    var answer = 1;
    var n;
    
    for (n=0;n<index;n++) {
        answer *= base;        
    }
    
    return answer;

}


function change() {
    
    //for each function
    for (i=0;i<funCount;i++) {
        //for each parameter
        for (j=0;j<f[i].paramfunCount;j++) {
        
            f[i].param[j] += (f[i].paramRoC[j]/tick);
        
        }
    
    }

}


function redraw() {
    
    //clear the canvas
    ctx.clearRect (0, 0, drawArea.width, drawArea.height); 
    
    colourBG();
    
    //draw all the functions
    draw();
    
    //make any changes to paramaters
    change();
    
    
    //some interface stuff
    //insertValues(selectedElement);
    
    //and do it all again
    t=setTimeout("redraw()", 1000/tick);

}

function gradient() {

    height = drawArea.height;
    width = drawArea.width;
    
    var step = parseInt(20*(255/width));
    
    var left = [0, 0, 0];
    var right = [255, 0, 0];
    
    var rStep = (left[0]-right[255])/width;
    
    
    step = step/20;
    
    for (i=0;i<width;i++) {
        
        ctx.beginPath();
        ctx.strokeStyle = "rgb("+(255-(i*step))+", 0, 0)";



        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);




        ctx.stroke();
    
    }
    
    
}

function forceTick() {

    clearTimeout(t);
    redraw();   
    
}

function myTest() {

    clearTimeout(t);
    redraw();
	//hideForm();
/*
    var m;
    
    for (m=0;m<funCount;m++) {
    
        document.write(m + ", " + f[m].id + ", " + f[m].type   + ", " + f[m].paramType[0] + "|<br>");
    
    
    }
*/



}

