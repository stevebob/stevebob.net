
function Vector3D(a, b, c, d) {

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;

    this.toPoint = function() {
        return new Point3D(a, b, c);
    }


    this.multiplyScalar = function(s) {
        return new Vector3D(this.a * s,
                            this.b * s,
                            this.c * s,
                            this.d * s
                            );
    }

    this.toString = function() {
        return [this.a, this.b, this.c, this.d].join(", ");
    }
}
