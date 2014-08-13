

function Object3D() {

    var global = false;

    /* an array of Point3D objects */
    this.points = [];
    
    /* the polygons which exist in this world */
    this.polygons = [];

    this.world = null;

    this.setWorld = function(w) {
        this.world = w;
    }

    this.currentColour = "white";
    
    this.basis = new Basis3D(
        new Vector3D(1, 0, 0, 1),
        new Vector3D(0, 1, 0, 1),
        new Vector3D(0, 0, 1, 1),
        new Vector3D(0, 0, 0, 1));   

    this.addPolygon = function(p) {
        this.polygons.push(p);
        p.set_object(this);
        p.colour = this.currentColour;
    }

    this.globalize = function() {
        global = true;
        var basisTr = Matrix3D.basisTransform(this.basis.u, this.basis.v, this.basis.n, this.basis.o);
        for (var i = 0;i<this.points.length;i++) {
            this.points[i] = basisTr.multiplyVector(this.points[i].toVector()).toPoint();
        }
        
        this.basis = new Basis3D(
            new Vector3D(1, 0, 0, 1),
            new Vector3D(0, 1, 0, 1),
            new Vector3D(0, 0, 1, 1),
            new Vector3D(0, 0, 0, 1));   
    }

    this.applyMatrix = function(m) {
        var ret = new Object3D();

        ret.currentColour = this.currentColour;

        /* apply the matrix to all the points */
        for (var i = 0;i<this.points.length;i++) {
            var new_point = m.multiplyVector(this.points[i].toVector()).toPoint();
            ret.points[i] = new_point;
        }
        

        /* copy the polygons */
        for (var i = 0;i<this.polygons.length;i++) {
            ret.polygons[i] = this.polygons[i].clone();
            ret.polygons[i].object = ret;
            ret.polygons[i].colour = ret.currentColour;
        }
        


        return ret;
    }

    this.turnInsideOut = function() {
        for (var i = 0;i<this.polygons.length;i++) {
            this.polygons[i] = this.polygons[i].flip();
        }
    }
}

Object3D.unitCubePointsOnly = function() {
    var o = new Object3D();
    
    o.points[0] = (new Point3D(1, 1, 1));
    o.points[1] = (new Point3D(1, 1, -1));
    o.points[2] = (new Point3D(1, -1, 1));
    o.points[3] = (new Point3D(1, -1, -1));
    o.points[4] = (new Point3D(-1, 1, 1));
    o.points[5] = (new Point3D(-1, 1, -1));
    o.points[6] = (new Point3D(-1, -1, 1));
    o.points[7] = (new Point3D(-1, -1, -1));
    
    return o;
}

Object3D.unitCube = function() {
    var o = new Object3D();
    
    o.points[0] = (new Point3D(1, 1, 1));
    o.points[1] = (new Point3D(1, 1, -1));
    o.points[2] = (new Point3D(1, -1, 1));
    o.points[3] = (new Point3D(1, -1, -1));
    o.points[4] = (new Point3D(-1, 1, 1));
    o.points[5] = (new Point3D(-1, 1, -1));
    o.points[6] = (new Point3D(-1, -1, 1));
    o.points[7] = (new Point3D(-1, -1, -1));

    o.addPolygon(new Polygon3D([0, 1, 3, 2]));
    o.addPolygon(new Polygon3D([4, 6, 7, 5]));
    o.addPolygon(new Polygon3D([0, 4, 5, 1]));
    o.addPolygon(new Polygon3D([2, 3, 7, 6]));
    o.addPolygon(new Polygon3D([0, 2, 6, 4]));
    o.addPolygon(new Polygon3D([1, 5, 7, 3]));

    return o;
}
