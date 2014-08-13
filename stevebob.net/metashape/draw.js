

var drawCTX;


var xBuffer;
var yBuffer;


var visibleCentre = 1;

function addLineCart(ax, ay, bx, by) {
    var shape = env.fractals[0].shape;
    
    var a = cartToPolar(new CartPt(ax, ay));
    var b = cartToPolar(new CartPt(bx, by));




    shape.lines[shape.lines.length] = new Line(a, b, 1);

}

function cartToPolar(cart) {

    var angle = 0;

    if (cart.x == 0) {
        if (cart.y > 0) {
            angle = Math.PI/2;
        } else if (cart.y < 0) {
            angle = -Math.PI/2;
        }
    } else {
        angle = Math.atan(Math.abs(cart.y/cart.x));
        var sign;
        
        if (cart.y > 0) {
            sign = 1;
        } else {
            sign = -1;
        }


        if (cart.x < 0) {
            angle = Math.PI - angle;
        }

        angle *= sign;
    }

    return new PolarPt(Math.sqrt(cart.x*cart.x + cart.y*cart.y), angle);

}


function setUpDraw() {
    drawArea = document.getElementById("screen");
    if (drawArea.getContext) {
        drawCTX = drawArea.getContext("2d");
    }
}

//set up a fractal detail with default values
function beginFractal() {
    env.fractals[0] = new FractDetail(new Shape(), 5, new CartPt(0, 0), 1, 0);
    env.fCount = 1;
}


function addPolarRep(dSize, dAngle, offsetDistance, offsetAngle) {
    env.fractals[0].repeats[env.fractals[0].repeats.length] = new Repeat(dSize, dAngle, new PolarPt(offsetDistance, offsetAngle));
}


function removeLine(n) {
    var ls = env.fractals[0].shape.lines;

    for (var i = n+1;i<ls.length;i++) {
        ls[i-1] = ls[i];
    }
    ls.length--;
}

function removeRepeat(n) {
    var reps = env.fractals[0].repeats;
    for (var i = n+1;i<reps.length;i++) {
        reps[i-1] = reps[i];
    }
    reps.length--;
}


function clearAll() {
    env.fractals[0].repeats.length = 0;
    env.fractals[0].shape.lines.length = 0;
}

function darken() {

    document.getElementById("inout").style.display = "";

}

function showExport() {

    darken();
    document.getElementById("importfieldholder").style.display = "none";
    document.getElementById("exportfieldholder").style.display = "";

}

function hideExport() {
    document.getElementById("exportfield").value = "";
    document.getElementById("inout").style.display = "none";
}

function showImport() {
    darken();
    document.getElementById("importfieldholder").style.display = "";
    document.getElementById("exportfieldholder").style.display = "none";

}

function hideImport() {
    document.getElementById("importfield").value = "";
    document.getElementById("inout").style.display = "none";
}





