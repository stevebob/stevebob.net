//document.onmousemove = trackMouse;
//document.onmousedown = handleMouseDown;
//document.onmouseup = handleRelease;

var mouseX, mouseY; //store the mouse coordinates

const UP = 0;
const DOWN = 1;

var mouseStatus = UP;



function handleMosueDown() {
    getPosition();
    mouseStatus = DOWN;

    if (mode == DRAW_MODE) {
        xBuffer = mouseX;
        yBuffer = mouseY;
    }
}

function trackMouse() {
    getPosition();

    if (mode == DRAW_MODE) {

    }
}

function exportString(type) {
    var str = "";
    
    var delim;

    if (type == "cookie") {
        delim = ",";
    } else if (type == "export") {
        delim = "\n";
    }

    for (var i in env.fractals[0].shape.lines) {
        var l = env.fractals[0].shape.lines[i];
        str += ("l " + l.a.rad + " " + l.a.theta + " " + l.b.rad + " " + l.b.theta + delim);
    }
    for (var i in env.fractals[0].repeats) {
        var r = env.fractals[0].repeats[i];
        str += ("r " + r.sizeChange + " " + r.angleChange + " " + r.start.rad + " " + r.start.theta + delim);
    }

    str += ("d " + env.fractals[0].depth + delim);

    str += ("s " + env.xMin + " " + env.xMax + " " + env.yMin + " " + env.yMax + delim);

    str += ("f " + env.fractals[0].start.x + " " + env.fractals[0].start.y + " " + env.fractals[0].initialUnit + " " + env.fractals[0].initialAngle + delim);

    return str;

}

function formatExport() {
    showExport();
    var output = document.getElementById("exportfield");
    
    output.value = exportString("export");
}   

function parseImport() {
    parseImportText(document.getElementById("importfield").value, "export");
    
    hideImport();
    
    drawFractal(env);
    updateData();
}

function parseImportText(text, type) {
    var buffer = "";

    var delim;

    if (type == "cookie") {
        delim = ",";
    } else if (type == "export") {
        delim = "\n";
    }

    clearAll();
    
    for (var i in text) {
        //alert(text[i]);
        if (text[i] == delim) {
            evaluateLine(buffer);
            buffer = "";
        } else {
            buffer += text[i];
        }
    }
    evaluateLine(buffer);
}

function evaluateLine(line) {
    var check = line.match(/([a-z]) ([-]?[0-9]+[\.]?[0-9]*) ([-]?[0-9]+[\.]?[0-9]*) ([-]?[0-9]+[\.]?[0-9]*) ([-]?[0-9]+[\.]?[0-9]*)/);
    if (check != null) {
        if (check[1] == "l") {
            
            env.fractals[0].shape.lines[env.fractals[0].shape.lines.length] = new Line(new PolarPt(parseFloat(check[2]), parseFloat(check[3])), new PolarPt(parseFloat(check[4]), parseFloat(check[5])), 1);


        } else if (check[1] == "r") {
            addPolarRep(parseFloat(check[2]), parseFloat(check[3]), parseFloat(check[4]), parseFloat(check[5]));
        } else if (check[1] == "s") {
            env.xMin = parseFloat(check[2]);
            env.xMax = parseFloat(check[3]);
            env.yMin = parseFloat(check[4]);
            env.yMax = parseFloat(check[5]);
            env.xRange = env.xMax - env.xMin;
            env.yRange = env.yMax - env.yMin;
        } else if (check[1] == "f") {
            env.fractals[0].start.x = parseFloat(check[2]);
            env.fractals[0].start.y = parseFloat(check[3]);
            env.fractals[0].initialUnit = parseFloat(check[4]);
            env.fractals[0].initialAngle = parseFloat(check[5]);

        }
    } else {
        check = line.match(/d ([0-9]+)/);
        if (check != null) {
            env.fractals[0].depth = parseInt(check[1]);
        }
    }
}


function getPosition(e) {
    e = e || window.event;
    
    if (e.pageX || e.pageY) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    } 
    else {
        mouseX = e.clientX + 
            (document.documentElement.scrollLeft || 
            document.body.scrollLeft) - 
            document.documentElement.clientLeft;
        mouseY = e.clientY + 
            (document.documentElement.scrollTop || 
            document.body.scrollTop) - 
            document.documentElement.clientTop;
    }
}


