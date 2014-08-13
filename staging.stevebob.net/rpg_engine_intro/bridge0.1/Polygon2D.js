function Polygon2D() {
    
    this.points = [];
    this.heights = [];

    this.zindex;
    this.id;

    this.slanted = false;
   
    /* z(x,y) = a*x + b*y + c 
     * This describes the plane of which this polygon is a subset.
     */
    this.a;
    this.b;
    this.c;
    
    this.zfn = function(x, y) {
        return this.heights[0];
    }
    
    this.slantedZfn = function(x, y) {
        return this.a * x + this.b * y + this.c;
    }

    this.addPoint = function(point) {
        this.points.push(point);
    }

    this.addHeight = function(height) {
        this.heights.push(height);
    }
}

Polygon2D.fromDOM = function(doc) {
    var pointsNode = doc.getElementsByTagName("points")[0];
    var points = pointsNode.getElementsByTagName("point");

    var height = doc.getElementsByTagName("height")[0];
    var components = height.getElementsByTagName("component");
    var single;
    
    var ret = new Polygon2D();
    ret.zindex = parseInt(doc.getAttribute("z-index"));
    ret.id = parseInt(doc.getAttribute("id"));

    if (components.length == 0) {
        single = height.getElementsByTagName("single")[0];
        var singleHeight = parseInt(single.getAttribute("z"));

        for (var i = 0;i!=points.length;++i) {
            ret.addHeight(singleHeight);
        }
    } else {

        ret.slanted = true;
        ret.zfn = ret.slantedZfn;
        
       
        var p0 = new Point3D(parseInt(components[0].getAttribute("x")), 
                 parseInt(components[0].getAttribute("y")), 
                 parseInt(components[0].getAttribute("z")));
        var p1 = new Point3D(parseInt(components[1].getAttribute("x")), 
                 parseInt(components[1].getAttribute("y")), 
                 parseInt(components[1].getAttribute("z")));
        var p2;

        /* linearly interpolate the heights of points given
         * the heights of two points */

        /* First we need a third point on the plane:
         * This is found by taking the 2D normal, ignoring the
         * vertical axis, and shifting one of the specified 
         * points (with a known height) in that direction some
         * arbitrary, non-zero amount.
         */


        var dy = p1.y - p0.y;
        var dx = p1.x - p0.x;

        if (dx == 0) {
            p2 = new Point3D(p0.x+1, p0.y, p0.z);
        } else if (dy == 0) {
            p2 = new Point3D(p0.x, p0.y+1, p0.z);
        } else {
            var theta = Math.atan(dy/dx);

            var rdx = -Math.sin(theta);
            var rdy = Math.cos(theta);
            
            var rx = p0.x + rdx;
            var ry = p0.y + rdy;

            p2 = new Point3D(rx, ry, p0.z);
        }

        /* now p2 is a third, non-colinear point on the plane */
        
        /* next we calculate the normal to the plane */
        var e0 = p1.subtract(p0);
        var e1 = p2.subtract(p0);
        var normal = e0.crossProduct(e1);
        
        for (var i = 0;i!=points.length;++i) {
            var point = Point2D.fromDOM(points[i]);
            ret.a = -normal.x/normal.z;
            ret.b = -normal.y/normal.z;
            ret.c = normal.x * p0.x / normal.z + normal.y * p0.y / normal.z + p0.z;
            var height = ret.a * point.x + ret.b * point.y + ret.c;
            ret.addHeight(height);
        }
    }
    
    for (var i = 0;i!=points.length;++i) {
        ret.addPoint(Point2D.fromDOM(points[i]));
    }

    return ret;
}
