
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

    this.addVector = function(v) {
        return new Vector3D(this.a + v.a,
                            this.b + v.b,
                            this.c + v.c,
                            1
                            );
    }

    this.crossProduct = function(v) {
        return new Vector3D(
            this.b * v.c - this.c * v.b,
            this.c * v.a - this.a * v.c,
            this.a * v.b - this.b * v.a,
            1
        );
    }

    this.dotProduct = function(v) {
        return this.a * v.a + this.b * v.b + this.c * v.c;
    }

    this.normalize = function() {
        var norm = Math.sqrt(this.a * this.a + this.b * this.b + this.c * this.c);
        return new Vector3D(this.a / norm, this.b / norm, this.c / norm, 1);
    }

    this.toString = function() {
        return [this.a, this.b, this.c, this.d].join(", ");
    }
}

function Basis3D(u, v, n, o) {
    this.u = u;
    this.v = v;
    this.n = n;
    this.o = o;

    this.toString = function() {
        return "(" + u.toString() + ", " + v.toString() + ", " + n.toString() + ", " + o.toString() + ")";
    }
}
