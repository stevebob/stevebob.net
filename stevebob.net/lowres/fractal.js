

function addLine(world, line) {
    world.lines[world.lCount] = line;
    world.lCount++;
}

function makeShape(world, shape, centre, axis) {
    
    for (var i in shape.lines) {
        //alert("makeShape: " + axis);
        var cartA = plot(shape.lines[i].a, centre, axis);
        var cartB = plot(shape.lines[i].b, centre, axis);
        //alert(cartA.x);
        //alert(cartB.x + ", " + cartB.y + ", " + cartB.z);
        addLine(world, new FractLine(cartA, cartB, 2));
    }
}

//returns the global point representing a local point on the axis provided
function plot(point, centre, axis) {
//alert(axis);
   //alert(axis.x.x + ", " +  axis.x.y + ", " +  axis.x.z);
    var global;
    global = addVector(addVector(
                            multiplyVector(axis.x, point.x),        //Add these vectors
                            multiplyVector(axis.y, point.y)),       //
                            multiplyVector(axis.z, point.z));       //
    global = addVector(global, centre);   //Add to the centre


    return global;

}



//a wrapper for the actual recursive fractal function
function makeFractals(world) {
    for (var i = 0;i<world.fCount;i++) {
        detail = world.fractals[i];
        stackFractalMaker(world, detail.depth, detail.shape, detail.start, detail.repeats, detail.axis);
    }
}

function stackFractalMaker(world, depth, shape, centre, repeats, axis) {
    depth--;
    makeShape(world, shape, centre, axis);
   // alert(repeats.length);
   
   //alert(axis.x.x + ", " +  axis.x.y + ", " +  axis.x.z);
   
    if (depth > 0) {
        for (var i in repeats) {
            var nextAxis = rotateAxis(axis, repeats[i].xR, repeats[i].yR, repeats[i].zR);
            //var nextAxis = axis;
            scaleAxis(nextAxis, repeats[i].scale);
            var nextCentre = modifyCentre(centre, repeats[i], axis);
//aolert(nextCentre.x);
            

            //alert(nextCentre.x);
        //alert("nextAxis: " + nextAxis);
            stackFractalMaker(world, depth, shape, nextCentre, repeats, nextAxis);
        
        }
    }

}

function modifyCentre(centre, repeat, axis) {

    //alert(axis.x.x);

    return plot(repeat.start, centre, axis);

}

function scaleAxis(axis, scale) {
    axis.x = multiplyVector(axis.x, scale);
    axis.y = multiplyVector(axis.y, scale);
    axis.z = multiplyVector(axis.z, scale);
}

function rotateAxis(axis, xR, yR, zR) {
    var newAxis = new AxisSet();

    newAxis.x = new Vector();
    newAxis.y = new Vector();
    newAxis.z = new Vector();

    newAxis.x.x = axis.x.x;
    newAxis.x.y = axis.x.y * Math.cos(xR) + axis.x.z * Math.sin(xR);
    newAxis.x.z = -axis.x.y * Math.sin(xR) + axis.x.z * Math.cos(xR);
    
    newAxis.y.x = axis.y.x;
    newAxis.y.y = axis.y.y * Math.cos(xR) + axis.y.z * Math.sin(xR);
    newAxis.y.z = -axis.y.y * Math.sin(xR) + axis.y.z * Math.cos(xR);
    
    newAxis.z.x = axis.z.x;
    newAxis.z.y = axis.z.y * Math.cos(xR) + axis.z.z * Math.sin(xR);
    newAxis.z.z = -axis.z.y * Math.sin(xR) + axis.z.z * Math.cos(xR);
    

    newAxis.x.x = newAxis.x.x * Math.cos(yR) + newAxis.x.z * Math.sin(yR);
    newAxis.x.z = -newAxis.x.x * Math.sin(yR) + newAxis.x.z * Math.cos(yR);
    
    newAxis.y.x = newAxis.y.x * Math.cos(yR) + newAxis.y.z * Math.sin(yR);
    newAxis.y.z = -newAxis.y.x * Math.sin(yR) + newAxis.y.z * Math.cos(yR);
    
    newAxis.z.x = newAxis.z.x * Math.cos(yR) + newAxis.z.z * Math.sin(yR);
    newAxis.z.z = -newAxis.z.x * Math.sin(yR) + newAxis.z.z * Math.cos(yR);
    

    newAxis.x.x = newAxis.x.x * Math.cos(zR) - newAxis.x.y * Math.sin(zR);
    newAxis.x.y = newAxis.x.x * Math.sin(zR) + newAxis.x.y * Math.cos(zR);
    
    newAxis.y.x = newAxis.y.x * Math.cos(zR) - newAxis.y.y * Math.sin(zR);
    newAxis.y.y = newAxis.y.x * Math.sin(zR) + newAxis.y.y * Math.cos(zR);
    
    newAxis.z.x = newAxis.z.x * Math.cos(zR) - newAxis.z.y * Math.sin(zR);
    newAxis.z.y = newAxis.z.x * Math.sin(zR) + newAxis.z.y * Math.cos(zR);
    
    

    return newAxis;

}

function xRotator(angle) {
    var map = [[1, 0, 0], [0, Math.cos(angle), Math.sin(angle)], [0, -Math.sin(angle), Math.cos(angle)]];
    return map;
}

function yRotator(angle) {
    var map = [[Math.cos(angle), 0, -Math.sin(angle)], [0, 1, 0], [Math.sin(angle), 0, Math.cos(angle)]];
    return map;
}

function zRotator(angle) {
    var map = [[Math.cos(angle), Math.sin(angle), 0], [Math.cos(angle), -Math.sin(angle), 0], [0, 0, 1]];
    return map;
}

function clear(world) {
    ctx.beginPath();
    ctx.fillStyle = world.blank;
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
}

