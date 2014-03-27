function nextPt(len, tries, here, dest) {
    var theta;
    var phi;

    var best;
    var unset = 1;
    var bestDist;

    for (var i = 0;i<tries;i++) {
        theta = Math.random() * Math.PI * 2;
        phi = Math.random() * Math.PI - Math.PI/2;
        
        var x, y, z;

        x = Math.sin(theta) * Math.cos(phi) * len;
        y = Math.cos(theta) * Math.cos(phi) * len;
        z = Math.sin(phi) * len;
        
        var tmp = addVector(new Vector(x, y, z), here);
        var tmpDist = distance(tmp, dest);

        if (unset) {
            unset = 0;
            best = tmp;
            bestDist = tmpDist;
        } else {
            if (tmpDist < bestDist) {
                best = tmp;
                bestDist = tmpDist;
            }         
        }
    }

    return best;

}


function distance(a, b) {
    return length(addVector(a, multiplyVector(b, -1)));
}
