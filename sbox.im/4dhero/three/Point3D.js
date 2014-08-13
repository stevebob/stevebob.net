
function Point3D(x, y, z) {
    
    this.x = x;
    this.y = y;
    this.z = z;

    this.toVector = function() {
        return new Vector3D(x, y, z, 1);
    }

    this.differenceVector = function(p) {
        return p.toVector().
                addVector(this.toVector().multiplyScalar(-1));
    }

    this.toString = function() {
        return [this.x, this.y, this.z].join(", ");
    }
}
