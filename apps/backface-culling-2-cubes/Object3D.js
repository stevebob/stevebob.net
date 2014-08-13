

function Object3D() {

    /* an array of Point3D objects */
    this.points = [];
    
    /* the polygons which exist in this world */
    this.polygons = [];

    this.world = null;

    this.setWorld = function(w) {
        this.world = w;
    }


    this.addPolygon = function(p) {
        this.polygons.push(p);
        p.set_object(this);
    }

    this.applyMatrix = function(m) {
        var ret = new Object3D();

        /* apply the matrix to all the points */
        for (var i = 0;i<this.points.length;i++) {
            var new_point = m.multiplyVector(this.points[i].toVector()).toPoint();
            ret.points[i] = new_point;
        }

        /* copy the polygons */
        for (var i = 0;i<this.polygons.length;i++) {
            ret.polygons[i] = this.polygons[i];
        }

        return ret;
    }
}
