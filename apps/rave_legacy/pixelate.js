//a canvas wrapper for drawing psuedo pixel based lines

var pixSize = 4;

const RIGHT = 0;
const UPRIGHT = 1;
const UP = 2;
const UPLEFT = 3;
const LEFT = 4;
const DOWNLEFT = 5;
const DOWN = 6;
const DOWNRIGHT = 7;

function Point(x, y) {
    this.x = x;
    this.y = y;
}

/*
 * Draws a single pseudo pixel
 */
function drawPixel(pt, colour) {
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.fillRect(
        pt.x*pixSize,
        winH - pt.y*pixSize,
        pixSize,
        -pixSize
    );

    ctx.fill();
}


/*
 * returns the angle one would travel to move from the point e0
 * to the point e1
 */
function angleToTravel(e0, e1) {
    //deal with some edge cases so we don't divide by zero
    if (e0.x == e1.x) {
        if (e0.y == e1.y) {
            return 0; /* they are the same point, but valuation
                       * is needed to keep things running smoothly
                       */
        } else if (e0.y > e1.y) {
            //e0 is directly above e1
            return -Math.PI/2;
        } else {
            //e0 is directly below e1
            return Math.PI/2;
        }
    }

    if (e0.y == e1.y) {
        if (e0.x > e1.x) {
            //e0 is to the right of e1
            return Math.PI;
        } else {
            //e0 is to the left of e1
            return 0;
        }
    }

    
    /* now we can assert that e0 and e1 are not directly beside or
     * above one another.
     */
    
    var dx = e1.x - e0.x;
    var dy = e1.y - e0.y;
    
    //find the magnitude of the angle
    var mag = Math.atan(Math.abs(dy/dx));

    if (e0.x > e1.x) {
        //e0 right of e1
        if (e0.y > e1.y) {
            //e0 above e1
            return mag - Math.PI;
        } else {
            //e0 belowe e1
            return Math.PI - mag;
        }
    } else {
        //e0 left of e1
        if (e0.y > e1.y) {
            //e0 above e1
            return -mag;
        } else {
            //e0 below e1
            return mag
        }
    }

}


/*
 * Returns true iff x>=y && x<z
 */
function between(x, y, z) {
    return x >= y && x < z;
}

/*
 * Returns the nearest discrete angle to a given continuous angle
 */
function nearestDiscreteAngle(actual) {
    if (between(actual, -Math.PI/8, Math.PI/8)) {
        return RIGHT;
    } else if (between(actual, Math.PI/8, 3*Math.PI/8)) {
        return UPRIGHT;
    }  else if (between(actual, 3*Math.PI/8, 5*Math.PI/8)) {
        return UP;
    }  else if (between(actual, 5*Math.PI/8, 7*Math.PI/8)) {
        return UPLEFT;
    }  else if (between(actual, 7*Math.PI/8, Math.PI) ||
                between(actual, -Math.PI, -7*Math.PI/8) ||
                actual == Math.PI){
        return LEFT;
    }  else if (between(actual, -7*Math.PI/8, -5*Math.PI/8)) {
        return DOWNLEFT;
    }  else if (between(actual, -5*Math.PI/8, -3*Math.PI/8)) {
        return DOWN;
    }  else if (between(actual, -3*Math.PI/8, -Math.PI/8)) {
        return DOWNRIGHT;
    } 
    
}


function modPoint(pt, dir) {
    if (dir == RIGHT) {
        pt.x++;
    } else if (dir == UPRIGHT) {
        pt.x++;
        pt.y++;
    } else if (dir == UP) {
        pt.y++;
    } else if (dir == UPLEFT) {
        pt.y++;
        pt.x--;
    } else if (dir == LEFT) {
        pt.x--;
    } else if (dir == DOWNLEFT) {
        pt.x--;
        pt.y--;
    } else if (dir == DOWN) {
        pt.y--;
    } else if (dir == DOWNRIGHT) {
        pt.y--;
        pt.x++;
    }
}

function drawSquare(topLeft, size, colour) {
    var xref = topLeft.x - parseInt(size/2);
    var yref = topLeft.y - parseInt(size/2);
    for (var i = 0;i<size;i++) {
        for (var j = 0;j<size;j++) {
            drawPixel(new Point(
                            xref + i,
                            yref + j
                        ), colour);
        }
    }
}


/*
-5, 5   
-5, 7  

0   2

*/

function pixLine(width, colour, e0, e1) {

    var dx = e0.x - e1.x;
    var dy = e0.y - e1.y;
    
    var big, small;

    var next;

//alert(e0.x + ", " + e0.y + " : " + e1.x + ", " + e1.y +
 //      colour     );

    //determine the big distance and the small distance to travel
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            //e0 is to the right of e1
            big = LEFT;
        } else {
            big = RIGHT;
        }

        if (dy > 0) {
            //e0 is above e1
            small = DOWN;
        } else {
            small = UP;
        }
        
        if (dy == 0) {
            next = Math.abs(dx)*2 + 1;
        } else {
            next = Math.abs(dx) / Math.abs(dy);
        }

    } else {
        if (dy > 0) {
            //e0 is above e1
            big = DOWN;
        } else {
            big = UP;
        }
        
        if (dx > 0) {
            //e0 is to the right of e1
            small = LEFT;
        } else {
            small = RIGHT;
        }
        if (dx == 0) {
            next = Math.abs(dy)*2 + 1;
        } else {
            next = Math.abs(dy) / Math.abs(dx);
        }
    }


    //how often to move in the small dir
    
    var freq = next;
    
    var counter = parseInt(next/2);
    
    drawSquare(e0, width, colour);
    
    while (e0.x != e1.x || e0.y != e1.y) {

//alert(e0.x + ", " + e0.y + " != " + e1.x + ", " + e1.y);
        if (counter == Math.floor(next)) {
            modPoint(e0, small);
            next += freq;
        } else {
            modPoint(e0, big);

            counter++;
        }

        drawSquare(e0, width, colour);
    }

}




function pixClear() {
    
    ctx.beginPath();
    ctx.clearRect(0, 0, winW, winH);
    ctx.fill();
}

