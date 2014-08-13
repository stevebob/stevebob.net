function Point3D(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.crossProduct = function(p) {
        return new Point3D(
            this.y * p.z - this.z * p.y,
            this.z * p.x - this.x * p.z,
            this.x * p.y - this.y * p.x
            );
    }

    this.subtract = function(p) {
        return new Point3D(
            this.x - p.x,
            this.y - p.y,
            this.z - p.z
            );
    }
}
