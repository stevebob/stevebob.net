function div(id, cl, contents) {
    return "<div id='" + id + "' class='" + cl + "'>"+contents+"</div>";
}


function updateLineList() {
    var shape = env.fractals[0].shape;
    var lineList = document.getElementById("lineList");
    lineList.innerHTML = "";

    for (var i = 0;i<shape.lines.length;i++) {
        lineList.innerHTML += div("line" + i, "listElement", i + ": " + formatLine(shape.lines[i]));
    }
}

function updateRepeatList() {
    var reps = env.fractals[0].repeats;
    var repList = document.getElementById("repeatList");
    repList.innerHTML = "";

    for (var i = 0;i<reps.length;i++) {
        repList.innerHTML += div("rep" + i, "listElementLarge", i + ".<br />Scale: " + trun(reps[i].sizeChange) + "<br/> Rotate: " + trun(reps[i].angleChange) + "<br /> Offset Distance: " + trun(reps[i].start.rad) + "<br /> Offset Angle: " + trun(reps[i].start.theta));
    }
}

function updateFractal() {
    var frData = document.getElementById("fractalList");
    frData.innerHTML = div("fractalData", "listElement", "Depth: " + env.fractals[0].depth + "<br />Initial Unit: " + env.fractals[0].initialUnit + "<br />Initial Zero Angle: " + env.fractals[0].initialAngle + "<br />Initial Centre: (" + env.fractals[0].start.x + ", " + env.fractals[0].start.y + ")");
}

function trun(n) {
    return ("" + n).substr(0, 8);
}

function updateData() {
    updateLineList();
    updateRepeatList();
    updateFractal();
    document.cookie = exportString("cookie");
}

//take polar lines
function formatLine(line) {
    var cartAX = approx(line.a.rad * Math.cos(line.a.theta));
    var cartAY = approx(line.a.rad * Math.sin(line.a.theta));
    var cartBX = approx(line.b.rad * Math.cos(line.b.theta));
    var cartBY = approx(line.b.rad * Math.sin(line.b.theta));
    
    

    return "(" + cartAX + ", " + cartAY + ") to (" + cartBX + ", " + cartBY + ")";
}

function approx(n) {
    
    var str = n + "";
    var check0 = str.match(/^([/-]*[0-9]+.[0-9][0-9])[0]+[0-9]/);
    var check9 = str.match(/^([/-]*[0-9]+.[0-9][0-9])[9]+[0-9]/);
    var checke = str.match(/^[/-]*[0-9]+.[0-9]+[e][/-][0-9]+/);
    if (check9 != null) {
        n = parseFloat(check9[1]);
        if (n > 0) {
            n+=0.01;
        } else if (n < 0) {
            n-=0.01;
        }
    } else if (check0 != null) {
        n = parseFloat(check0[1]);
    } else if (checke != null) {
        n = 0;
    }

    return n;
}

