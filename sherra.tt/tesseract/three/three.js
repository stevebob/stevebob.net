

function Three() {}

Three.Edge = function(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
}

Three.Object3D = function() {

    var global = false;

    /* an array of Point3D objects */
    this.points = [];

    this.edges = [];
    
    /* the polygons which exist in this world */
    this.polygons = [];

    this.world = null;

    this.setWorld = function(w) {
        this.world = w;
    }

    this.currentColour = "white";
    this.purge = function() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
    }
    this.basis = new Three.Basis3D(
        new Three.Vector3D(1, 0, 0, 1),
        new Three.Vector3D(0, 1, 0, 1),
        new Three.Vector3D(0, 0, 1, 1),
        new Three.Vector3D(0, 0, 0, 1));   

    this.addPolygon = function(p) {
        this.polygons.push(p);
        p.set_object(this);
        p.colour = this.currentColour;
    }

    this.globalize = function() {
        global = true;
        var basisTr = Three.Matrix3D.basisTransform(this.basis.u, this.basis.v, this.basis.n, this.basis.o);
        for (var i = 0;i<this.points.length;i++) {
            this.points[i] = basisTr.multiplyVector(this.points[i].toVector()).toPoint();
        }

        for (var i = 0;i!=this.edges.length;++i) {
            this.edges[i].p1 = basisTr.multiplyVector(this.edges[i].p1.toVector()).toPoint(); 
            this.edges[i].p2 = basisTr.multiplyVector(this.edges[i].p2.toVector()).toPoint(); 
        }
        
        this.basis = Three.Basis3D(
            new Three.Vector3D(1, 0, 0, 1),
            new Three.Vector3D(0, 1, 0, 1),
            new Three.Vector3D(0, 0, 1, 1),
            new Three.Vector3D(0, 0, 0, 1));   
    }

    this.applyMatrix = function(m) {
        var ret = new Three.Object3D();

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

Three.Object3D.unitCubePointsOnly = function() {
    var o = new Three.Object3D();
    
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

Three.Object3D.unitCube = function() {
    var o = new Three.Object3D();
    
    o.points[0] = (new Three.Point3D(1, 1, 1));
    o.points[1] = (new Three.Point3D(1, 1, -1));
    o.points[2] = (new Three.Point3D(1, -1, 1));
    o.points[3] = (new Three.Point3D(1, -1, -1));
    o.points[4] = (new Three.Point3D(-1, 1, 1));
    o.points[5] = (new Three.Point3D(-1, 1, -1));
    o.points[6] = (new Three.Point3D(-1, -1, 1));
    o.points[7] = (new Three.Point3D(-1, -1, -1));

    o.addPolygon(new Three.Polygon3D([0, 1, 3, 2]));

    o.addPolygon(new Three.Polygon3D([4, 6, 7, 5]));
    o.addPolygon(new Three.Polygon3D([0, 4, 5, 1]));
    o.addPolygon(new Three.Polygon3D([2, 3, 7, 6]));
    o.addPolygon(new Three.Polygon3D([0, 2, 6, 4]));
    o.addPolygon(new Three.Polygon3D([1, 5, 7, 3]));

    return o;
}



Three.Vector3D = function(a, b, c, d) {

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;

    this.toPoint = function() {
        return new Three.Point3D(a, b, c);
    }
    
    this.length = function() {
        return Math.sqrt(this.a*this.a + this.b * this.b + this.c * this.c);
    }

    this.multiplyScalar = function(s) {
        return new Three.Vector3D(this.a * s,
                            this.b * s,
                            this.c * s,
                            this.d * s
                            );
    }

    this.addVector = function(v) {
        return new Three.Vector3D(this.a + v.a,
                            this.b + v.b,
                            this.c + v.c,
                            1
                            );
    }

    this.crossProduct = function(v) {
        return new Three.Vector3D(
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
        return new Three.Vector3D(this.a / norm, this.b / norm, this.c / norm, 1);
    }

    this.toString = function() {
        return [this.a, this.b, this.c, this.d].join(", ");
    }
}

Three.Basis3D = function(u, v, n, o) {
    this.u = u;
    this.v = v;
    this.n = n;
    this.o = o;

    this.uvnMultiplyMatrix = function(m) {
        
        this.u = m.multiplyVector(this.u);
        this.v = m.multiplyVector(this.v);
        this.n = m.multiplyVector(this.n);

    }

    this.originMultiplyMatrix = function(m) {
        this.o = m.multiplyVector(this.o);
    }

    this.toString = function() {
        return "(" + u.toString() + ", " + v.toString() + ", " + n.toString() + ", " + o.toString() + ")";
    }
}

Three.Point3D = function(x, y, z) {
    
    this.x = x;
    this.y = y;
    this.z = z;

    this.toVector = function() {
        return new Three.Vector3D(x, y, z, 1);
    }

    this.differenceVector = function(p) {
        return p.toVector().
                addVector(this.toVector().multiplyScalar(-1));
    }

    this.toString = function() {
        return [this.x, this.y, this.z].join(", ");
    }
}



Three.Matrix3D = function(aa, ab, ac, ad, 
                  ba, bb, bc, bd, 
                  ca, cb, cc, cd, 
                  da, db, dc, dd) {
    this.aa = aa;
    this.ab = ab;
    this.ac = ac;
    this.ad = ad;
    this.ba = ba;
    this.bb = bb;
    this.bc = bc;
    this.bd = bd;
    this.ca = ca;
    this.cb = cb;
    this.cc = cc;
    this.cd = cd;
    this.da = da;
    this.db = db;
    this.dc = dc;
    this.dd = dd;
    

    this.multiplyMatrix = function(m) {
        return new Three.Matrix3D(
/* generated by perl:
@matrix = ();
foreach $i ("a".."d") {
    foreach $j ("a".."d") {
        @row = ();
        foreach $k ("a".."d") {
            push @row, "this.$i$k * m.$k$j"
        }
        push @matrix, join " + ", @row;
    }
}
print join ", \n", @matrix;
*/

this.aa * m.aa + this.ab * m.ba + this.ac * m.ca + this.ad * m.da, 
this.aa * m.ab + this.ab * m.bb + this.ac * m.cb + this.ad * m.db, 
this.aa * m.ac + this.ab * m.bc + this.ac * m.cc + this.ad * m.dc, 
this.aa * m.ad + this.ab * m.bd + this.ac * m.cd + this.ad * m.dd, 
this.ba * m.aa + this.bb * m.ba + this.bc * m.ca + this.bd * m.da, 
this.ba * m.ab + this.bb * m.bb + this.bc * m.cb + this.bd * m.db, 
this.ba * m.ac + this.bb * m.bc + this.bc * m.cc + this.bd * m.dc, 
this.ba * m.ad + this.bb * m.bd + this.bc * m.cd + this.bd * m.dd, 
this.ca * m.aa + this.cb * m.ba + this.cc * m.ca + this.cd * m.da, 
this.ca * m.ab + this.cb * m.bb + this.cc * m.cb + this.cd * m.db, 
this.ca * m.ac + this.cb * m.bc + this.cc * m.cc + this.cd * m.dc, 
this.ca * m.ad + this.cb * m.bd + this.cc * m.cd + this.cd * m.dd, 
this.da * m.aa + this.db * m.ba + this.dc * m.ca + this.dd * m.da, 
this.da * m.ab + this.db * m.bb + this.dc * m.cb + this.dd * m.db, 
this.da * m.ac + this.db * m.bc + this.dc * m.cc + this.dd * m.dc, 
this.da * m.ad + this.db * m.bd + this.dc * m.cd + this.dd * m.dd

        );        
    }



    this.multiplyScalar = function(s) {
        return new Three.Matrix3D(
/* generated by perl:
@lines = ();
foreach $i ("a".."d") {
    @row = ();
    foreac@lines = ();
foreach $i ("a".."d") {
    @row = ();
    foreach $j ("a".."d") {
        push @row, "this.$i$j * v.$j";
    }
    push @lines, (join " + ", @row);
}
print join ", \n", @lines;
this.aa * v.a + this.ab * v.b + this.ac * v.c + this.ad * v.d, 
this.ba * v.a + this.bb * v.b + this.bc * v.c + this.bd * v.d, 
this.ca * v.a + this.cb * v.b + this.cc * v.c + this.cd * v.d, 
this.da * v.a + this.db * v.b + this.dc * v.c + this.dd * v.dh $j ("a".."d") {
        push @row, "this.$i$j * s";
    }
    push @lines, (join ", ", @row);
}
print join ", \n", @lines;
*/
this.aa * s, this.ab * s, this.ac * s, this.ad * s, 
this.ba * s, this.bb * s, this.bc * s, this.bd * s, 
this.ca * s, this.cb * s, this.cc * s, this.cd * s, 
this.da * s, this.db * s, this.dc * s, this.dd * s);

    }



    this.multiplyVector = function(v) {
        return new Three.Vector3D(
/* generated by perl:
@lines = ();
foreach $i ("a".."d") {
    @row = ();
    foreach $j ("a".."d") {
        push @row, "this.$i$j * v.$j";
    }
    push @lines, (join " + ", @row);
}
print join ", \n", @lines;
*/
this.aa * v.a + this.ab * v.b + this.ac * v.c + this.ad * v.d, 
this.ba * v.a + this.bb * v.b + this.bc * v.c + this.bd * v.d, 
this.ca * v.a + this.cb * v.b + this.cc * v.c + this.cd * v.d, 
this.da * v.a + this.db * v.b + this.dc * v.c + this.dd * v.d
        );
    }


    this.transpose = function() {
        return new Three.Matrix3D(
            
            this.aa, this.ba, this.ca, this.da,
            this.ab, this.bb, this.cb, this.db,
            this.ac, this.bc, this.cc, this.dc,
            this.ad, this.bd, this.cd, this.dd

        );
    }

    this.toString = function() {
        return [[this.aa, this.ab, this.ac, this.ad].join(", "),
               [this.ba, this.bb, this.bc, this.bd].join(", "),
               [this.ca, this.cb, this.cc, this.cd].join(", "),
               [this.da, this.db, this.dc, this.dd].join(", ")].join("\n");

    }

}

Three.Matrix3D.identity = new Three.Matrix3D(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

Three.Matrix3D.perspectiveTransform = function(depth) {
    return new Three.Matrix3D(
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 0, 0,
        0, 0, 1/depth, 1
    );
}

Three.Matrix3D.doPerspectiveTransform = function(depth, p3d) {
    var transformMatrix = Three.Matrix3D.perspectiveTransform(depth);
    var result = transformMatrix.multiplyVector(p3d.toVector());
    var correctResult = result.multiplyScalar(1/result.d);
    return new Three.Point2D(correctResult.a, correctResult.b);
}

Three.Matrix3D.basisTransform = function(u, v, n, o) {
    return new Three.Matrix3D(
        u.a, v.a, n.a, o.a,
        u.b, v.b, n.b, o.b,
        u.c, v.c, n.c, o.c,
        0, 0, 0, 1
    );
}

Three.Matrix3D.viewingTransform = function(u, v, n, o) {
    return new Three.Matrix3D(
        u.a, u.b, u.c, 0,
        v.a, v.b, v.c, 0,
        n.a, n.b, n.c, 0,
        0, 0, 0, 1
    ).multiplyMatrix(new Three.Matrix3D(
        1, 0, 0, -o.a,
        0, 1, 0, -o.b,
        0, 0, 1, -o.c,
        0, 0, 0, 1
    ));
}

Three.Matrix3D.rotateTransformX = function(theta) {
    return new Three.Matrix3D(
        1, 0, 0, 0,
        0, Math.cos(theta), -Math.sin(theta), 0,
        0, Math.sin(theta), Math.cos(theta), 0,
        0, 0, 0, 1
    );
}

Three.Matrix3D.rotateTransformY = function(theta) {
    return new Three.Matrix3D(
        Math.cos(theta), 0, Math.sin(theta), 0,
        0, 1, 0, 0,
        -Math.sin(theta), 0, Math.cos(theta), 0,
        0, 0, 0, 1
    );
}

Three.Matrix3D.rotateTransformZ = function(theta) {
    return new Three.Matrix3D(
        Math.cos(theta), -Math.sin(theta), 0, 0,
        Math.sin(theta), Math.cos(theta), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
}

Three.Matrix3D.translateTransform = function(x, y, z) {
    return new Three.Matrix3D(
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1
    );
}

Three.Matrix3D.scaleTransform = function(x, y, z) {
    return new Three.Matrix3D(
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1
    );
}




Three.Point2D = function(x, y) {

    this.x = x;
    this.y = y;

    this.toString = function() {
        return [x, y].join(", ");
    }
}



Three.Polygon3D = function(point_indices) {

    /* the world in which this polygon exists */
    this.object = null;
    
    this.set_object = function(o) {
        this.object = o;
    }

    /* The indexes into the world's point array in the order
     * they are connected. The first point need not appear twice.
     */
    this.point_indices = point_indices;

    this.colour = "blue";

    this.setPointIndices = function(new_point_indices) {
        this.point_indices = point_indices;
    }

    this.clone = function() {
        var point_indices = [];
        for (var i = 0;i<this.point_indices.length;i++) {
            point_indices[i] = this.point_indices[i];
        }
        
        var ret = new Three.Polygon3D(point_indices);
        ret.colour = this.colour;
        ret.object = this.object;
        return ret;
    }

    this.normal = function() {
        var o_points = this.object.points;

        var points = [o_points[this.point_indices[0]],   
                      o_points[this.point_indices[1]],   
                      o_points[this.point_indices[2]]];
        
        var v0 = points[1].differenceVector(points[0]);
        var v1 = points[1].differenceVector(points[2]);

        var n = v0.crossProduct(v1);
        
        return n;
    }
    
    this.hasPolygonBehind = function(p) {
        



        var n = this.normal().normalize();
        var face_pt = this.object.points[this.point_indices[0]];
        
        var inFront = false;
        var behind = false;

        
        /* condition for early exit:
         * both polygons are in the same object and share a point
         *
        var connected = false;
        if (this.object == p.object) {
            for (var i = 0;i<this.point_indices.length;i++) {
                for (var j = 0;j<p.point_indices.length;j++) {
                    if (this.point_indices[i] == p.point_indices[j]) {
                        connected = true;
                    } else {
                        var pt = p.object.points[p.point_indices[j]];
                        var vec = face_pt.differenceVector(pt);
                        var dp = n.dotProduct(vec);
                        if (dp < 0) {
                            behind = true;
                        } else {
                            inFront = true;
                        }                    
                    }
                }
            }
        } else {
            for (var i = 0;i<this.point_indices.length;i++) {
                for (var j = 0;j<p.point_indices.length;j++) {
                    if (
                        this.object.points[this.point_indices[i]].differenceVector(
                        p.object.points[p.point_indices[j]]).length() < 0.01
                        
                        ) {
                        connected = true;
                    } else {
                        var pt = p.object.points[p.point_indices[j]];
                        var vec = face_pt.differenceVector(pt);
                        var dp = n.dotProduct(vec);
                        if (dp < 0) {
                            behind = true;
                        } else {
                            inFront = true;
                        }    
                    }
                }
            }
        }

        if (connected) {
            if (behind) {
                return BEHIND;
            } else {
                return IN_FRONT;
            }
        } else {
            inFront = false;
            behind = false;
        }*/

        for (var i = 0;i<p.point_indices.length;i++) {
            var pt = p.object.points[p.point_indices[i]];
            var vec = face_pt.differenceVector(pt);
            var dp = n.dotProduct(vec);
            if (dp < 0) {
                behind = true;
            } else {
                inFront = true;
            }
        }

        if (inFront && behind) {
            return BOTH;
        }
        if (behind) {
            return BEHIND;
        } else {
            return IN_FRONT;
        }
    }

    /* returns a basis
     * with this polygon lying in the xy plane
     */
    this.toBasis = function() {
        var o_points = this.object.points;

        var points = [o_points[this.point_indices[0]],   
                      o_points[this.point_indices[1]]];   
        
        var u = points[1].differenceVector(points[0]).normalize();
        var n = this.normal().normalize().multiplyScalar(1);
        var v = u.crossProduct(n).multiplyScalar(-1);
        return new Three.Basis3D(u, v, n, points[0].toVector());
    }


    this.hasPointBehind = function(p, n, depth) {
        var normal = this.normal();
        
        var eyeToPolygon = this.object.points[this.point_indices[0]].toVector().
                                addVector(p.toVector().addVector(
                                    n.multiplyScalar(-depth)).multiplyScalar(-1));
        
        if (eyeToPolygon.dotProduct(normal) < 0) {
            return false;
        } else {
            return true;
        }
    }

    this.clip = function(clipping_offset, transformMatrix) {
        var point_indices = this.point_indices;

        var points = this.object.points;
        var clipped = [];
        var firstVector = points[point_indices[0]].toVector();
        var last = transformMatrix.multiplyVector(firstVector).toPoint();
        for (var j = 1;j<point_indices.length + 1;j++) {
            var index = j % point_indices.length;

            var currentVector = points[point_indices[index]].toVector();
            var current = transformMatrix.multiplyVector(currentVector).toPoint();
            
            /* check if last->current cuts the xy plane */
            if (last.z > clipping_offset && current.z > clipping_offset) {
                clipped.push(current);
            } else if (last.z <= clipping_offset && current.z <= clipping_offset) {
            } else {
                
                /* find the point of intersection */

                var param = (last.z - clipping_offset) / (last.z - current.z);
                var ict_x = last.x + (current.x - last.x) * param;
                var ict_y = last.y + (current.y - last.y) * param;

                var ict = new Three.Point3D(ict_x, ict_y, clipping_offset);
                clipped.push(ict);
                if (last.z <= clipping_offset) {
                    clipped.push(current);
                }

            }

            last = current;
        }
            
        return clipped;
    }

    this.toString = function() {
        var object = this.object;
        return this.point_indices.map(function(i){return object.points[i].toString()}).join("  |  ");
    }

    this.flip = function() {
        var new_point_indices = [];
        var j = 0;
        for (var i = this.point_indices.length - 1;i>=0;i--) {
            new_point_indices[j] = this.point_indices[i];
            j++;
        }
        var copy = new Three.Polygon3D(new_point_indices);
        copy.object = this.object;
        copy.colour = this.colour;
        return copy;
    }
}


Three.Camera3D = function(world, depth) {
    
    /* the world in which this camera exists */
    this.world = world;

    var depth = depth;

    this.origin = new Three.Vector3D(0, 0, -5, 1);
    this.n = new Three.Vector3D(0, 0, 1, 1);
    this.v = new Three.Vector3D(0, 1, 0, 1);
    this.u = new Three.Vector3D(1, 0, 0, 1);


    function convert3Dto2D(p3d) {

        return Three.Matrix3D.doPerspectiveTransform(depth, p3d);

    }

    var viewer;

    this.registerViewer = function(v) {
        viewer = v;
    }

    this.render = function() {

        var objects = this.world.objects;

        var transformMatrix = Three.Matrix3D.viewingTransform(this.u, this.v, this.n, this.origin);

        /* draw each point */
        
        for (var j = 0;j<this.world.objects.length;j++) {
            for (var i = 0;i<this.world.objects[j].points.length;i++) {
                var xyzVector = this.world.objects[j].points[i].toVector();
                var uvnVector = transformMatrix.multiplyVector(xyzVector);
                var p3d = uvnVector.toPoint();
                if (p3d.z >= -depth) {
                    var p2d = convert3Dto2D(p3d);

                    viewer.dot(p2d);
                }
            }
        }

        /* draw each edge */
        for (var j = 0;j<this.world.objects.length;j++) {
            for (var i = 0;i<this.world.objects[j].edges.length;i++) {
                var xyzVector1 = this.world.objects[j].edges[i].p1.toVector();
                var uvnVector1 = transformMatrix.multiplyVector(xyzVector1);
                var xyzVector2 = this.world.objects[j].edges[i].p2.toVector();
                var uvnVector2 = transformMatrix.multiplyVector(xyzVector2);
                var p3d1 = uvnVector1.toPoint();
                var p3d2 = uvnVector2.toPoint();
                if (p3d1.z >= -depth && p3d2.z >= -depth) {
                    var p2d1 = convert3Dto2D(p3d1);
                    var p2d2 = convert3Dto2D(p3d2);

                    viewer.line(p2d1, p2d2);

                }
            }
        }


        var polygons = this.world.bspTree.traverse(this.origin.toPoint(), this.n, depth);


        //polygons.aoeuaeu();

        for (var i = 0;i<polygons.length;i++) {

            var points = polygons[i].object.points;
            var point_indices = polygons[i].point_indices;

            /* got the vector from the eye to the first point
             * of the polygon
             */
            var eyeToPolygon = points[point_indices[0]].toVector().
                addVector(this.origin.addVector(
                            this.n.multiplyScalar(-depth)).multiplyScalar(-1));

            var normal = polygons[i].normal();
            var viewingAngle = eyeToPolygon.dotProduct(normal);

            /* cull the back faces */
            if (viewingAngle >= 0) {
                continue;
            }

            var clipped = polygons[i].clip(0, transformMatrix);

            /* check if the entire polygon was clipped away */
            if (clipped.length == 0) {
                continue;
            }

            var pts2d = [];
            for (var j = 0;j<clipped.length;j++) {
                var p3d = clipped[j];


                var p2d = convert3Dto2D(p3d);
                pts2d[j] = p2d;
            }
            viewer.polygon(pts2d, polygons[i].colour);
        }
        //}

}

this.translate = function(x, y, z) {
    var transformation = Three.Matrix3D.translateTransform(x, y, z);
    var new_o = transformation.multiplyVector(this.origin);
    this.origin = new_o;
}

this.moveForward = function(dist) {
    this.translate(this.n.a * dist, this.n.b * dist, this.n.c * dist);
}

this.moveRight = function(dist) {
    this.translate(this.u.a * dist, this.u.b * dist, this.u.c * dist);
}

this.moveUp = function(dist) {
    this.translate(this.v.a * dist, this.v.b * dist, this.v.c * dist);
}

this.rotateX = function(theta) {
    var transformation = Matrix3D.rotateTransformX(theta);
    var new_n = transformation.multiplyVector(this.n);
    var new_u = transformation.multiplyVector(this.u);
    var new_v = transformation.multiplyVector(this.v);
    this.n = new_n;
    this.u = new_u;
    this.v = new_v;
}

this.rotateY = function(theta) {
    var transformation = Three.Matrix3D.rotateTransformY(theta);
    var new_n = transformation.multiplyVector(this.n);
    var new_u = transformation.multiplyVector(this.u);
    var new_v = transformation.multiplyVector(this.v);
    this.n = new_n;
    this.u = new_u;
    this.v = new_v;
}


this.rotateZ = function(theta) {
    var transformation = Matrix3D.rotateTransformZ(theta);
    var new_n = transformation.multiplyVector(this.n);
    var new_u = transformation.multiplyVector(this.u);
    var new_v = transformation.multiplyVector(this.v);
    this.n = new_n;
    this.u = new_u;
    this.v = new_v;
}

}



const IN_FRONT = 0;
const BEHIND = 1;
const BOTH = 2;

Three.BSPTree = function() {

    this.polygon = null;
    this.left = null;
    this.right = null;

    this.addPolygon = function(p) {
        if (this.polygon == null) {
            this.polygon = p;
            this.left = new Three.BSPTree();
            this.right = new Three.BSPTree();
        } else {
            var behind = this.polygon.hasPolygonBehind(p);


            if (behind == IN_FRONT) {
                this.left.addPolygon(p);
            } else if (behind == BEHIND) {
                this.right.addPolygon(p);
            } else {
                var basis = this.polygon.toBasis();

                var frontPolygon = [];
                var backPolygon = [];
                var trInvMatrix = Three.Matrix3D.basisTransform(basis.u, basis.v, basis.n, basis.o);
                var trMatrix = Three.Matrix3D.viewingTransform(basis.u, basis.v, basis.n, basis.o);


                var firstVector = p.object.points[p.point_indices[0]].toVector();
                var last = trMatrix.multiplyVector(firstVector).toPoint();

                for (var i = 1;i<p.point_indices.length + 1;i++) {
                    var index = i % p.point_indices.length;
                    var pindex = p.point_indices[index];
                    var point = p.object.points[pindex];
                    var trPoint = trMatrix.multiplyVector(point.toVector()).toPoint();


                    if (last.z > 0 && trPoint.z > 0) {
                        backPolygon.push(pindex);
                    } else if (last.z <= 0 && trPoint.z <= 0) {
                        frontPolygon.push(pindex);
                    } else {
                        var param = (last.z) / (last.z - trPoint.z);
                        var ict_x = last.x + (trPoint.x - last.x) * param;
                        var ict_y = last.y + (trPoint.y - last.y) * param;

                        var ict = new Three.Point3D(ict_x, ict_y, 0);

                        /* add the new point to the object's points */
                        var j = p.object.points.length;

                        var trIct = trInvMatrix.multiplyVector(ict.toVector()).toPoint();

                        /* see if the polygon already contains the point */
                        var alreadyContains = -1;
                        for (var k = 0;k<p.point_indices.length;k++) {

                            var pt = p.object.points[p.point_indices[k]];

                            var between = pt.differenceVector(trIct);
                            if (between.length() == 0) {
                                alreadyContains = p.point_indices[k];
                                break;
                            }

                        }

                        if (alreadyContains == -1) {
                            p.object.points.push(trIct);
                            /* add the point index to both polygons */
                            frontPolygon.push(j);
                            backPolygon.push(j);
                        } else {
                            frontPolygon.push(alreadyContains);
                            backPolygon.push(alreadyContains);
                        }


                        if (last.z > 0) {
                            /* first ict */
                            frontPolygon.push(pindex);
                        }
                        if (last.z <= 0) {
                            /* second ict */
                            backPolygon.push(pindex);
                        }

                    }

                    last = trPoint;

                }

                var lastIndex = -1;
                for (var k = 0;k<frontPolygon.length;k++) {
                    if (lastIndex == frontPolygon[k]) {
                        frontPolygon.splice(k, 1);
                    }
                    lastIndex = frontPolygon[k];
                }

                lastIndex = -1;
                for (var k = 0;k<backPolygon.length;k++) {
                    if (lastIndex == backPolygon[k]) {
                        backPolygon.splice(k, 1);
                    }
                    lastIndex = backPolygon[k];
                }

                if (frontPolygon.length > 0) {
                    p.point_indices = frontPolygon;
                    this.right.addPolygon(p);
                }

                if (backPolygon.length > 0) {
                    var back = new Three.Polygon3D(backPolygon);
                    back.object = p.object;
                    back.colour = p.colour;
                    back.object.polygons.push(back);

                    this.left.addPolygon(back);

                }

            }
        }
    }

    /* for a given eye position, this returns an array of polygons
     * in the order in which they should be drawn.
     */
    this.traverse = function(eye, n, depth) {

        if (this.polygon == null) {
            return [];
        }

        if (this.polygon.hasPointBehind(eye, n, depth)) {
            var ret = this.left.traverse(eye, n, depth);
            ret.push(this.polygon);
            return ret.concat(this.right.traverse(eye, n, depth));
        } else {
            var ret = this.right.traverse(eye, n, depth);
            ret.push(this.polygon);
            return ret.concat(this.left.traverse(eye, n, depth));
        }

    }

    this.toString = function() {
        if (this.polygon == null) {
            return "null";
        }
        var left = "";
        var right = "";
        if (this.left != null) {
            left = this.left.toString();
        }
        if (this.right != null) {
            right = this.right.toString();
        }
        return "p(" + left + ", " + right + ")";
    }
}

/* a Viewer displays the output of a camera */
Three.Viewer = function() {


    var canvas = document.getElementById("screen");
    var ctx;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
    }


    var winW;
    var winH;

    this.updateDimensions = function() {
        if (parseInt(navigator.appVersion)>3) {
            if (navigator.appName=="Netscape") {
                winH = window.innerHeight;
                winW = window.innerWidth;
            }
            if (navigator.appName.indexOf("Microsoft")!=-1) {
                winH = document.body.offsetHeight;
                winW = document.body.offsetWidth;
            }
        }
        canvas.height = winH - 30;
        canvas.width = winW - 30;

        height = 40 * winH / winW;
    }

    var width = 40;
    var height = 32;

    this.updateDimensions();


    var mid_x = width/2;
    var mid_y = height/2;

    function convertCartToCanvas(p2d) {
        var scale_x = winW / width;
        var scale_y = winH / height;

        return new Three.Point2D(
                (mid_x + p2d.x) * scale_x,
                winH - ((mid_y + p2d.y) * scale_y)
                );
    }

    function ctxLineToPt(p2dorig) {
        var p2d = convertCartToCanvas(p2dorig);
        ctx.lineTo(p2d.x, p2d.y);
    }

    function ctxMoveToPt(p2dorig) {
        var p2d = convertCartToCanvas(p2dorig);
        ctx.moveTo(p2d.x, p2d.y);
    }

    function ctxFillRectPt(p2d0orig, p2d1orig) {
        var p2d0 = convertCartToCanvas(p2d0orig);
        var p2d1 = convertCartToCanvas(p2d1orig);

        var width = p2d1.x - p2d0.x;
        var height = p2d1.y - p2d0.y;

        ctx.fillRect(p2d0.x, p2d0.y, width, height);
    }

    this.clear = function() {
        var old = ctx.fillStyle;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, winW, winH);
        ctx.fillStyle = old;
    }

    this.dot = function(p2d) {
        var size = 0.2;

        var x0 = p2d.x - size/2;
        var x1 = p2d.x + size/2;
        var y0 = p2d.y - size/2;
        var y1 = p2d.y + size/2;


        var old = ctx.fillStyle;
        ctx.fillStyle = "black";
        ctxFillRectPt(new Three.Point2D(x0, y0), new Three.Point2D(x1, y1));
        ctx.fillStyle = old;
    }

    this.line = function(p1, p2) {
        ctx.beginPath();
        ctxMoveToPt(p1);
        ctxLineToPt(p2);
        ctx.stroke();
    }

    this.polygon = function(points, colour) {


        ctx.fillStyle = colour;
        //ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctxMoveToPt(points[0]);
        for (var i = 1;i<points.length;i++) {
            ctxLineToPt(points[i]);
        }
        ctxLineToPt(points[0]);
        ctx.stroke();
        ctx.fill();
    }

}




Three.World3D = function() {


    this.objects = [];
    this.addObject = function(o) {
        this.objects.push(o);
        o.setWorld(this);
    }

    this.bspTree = null;
        
    this.purge = function() {
        this.objects = [];
        this.bspTree = null;
    }

    this.generateBSPTree = function() {

        /* make an array refering to all the polygons */
        var polygons = [];

        var k = 0;
        for (var i = 0;i<this.objects.length;i++) {
            for (var j = 0;j<this.objects[i].polygons.length;j++) {
                polygons.push(this.objects[i].polygons[j]);
            }
        }

        /* shuffle the array */

        for (var i = 0;i<polygons.length;i++) {
            var j = Math.floor(Math.random() * polygons.length);
            var tmp = polygons[j];
            polygons[j] = polygons[i];
            polygons[i] = tmp;
        }


        var bspTree = new Three.BSPTree();
    
        for (var i = 0;i<polygons.length;i++) {
            bspTree.addPolygon(polygons[i]);
        }
        
        this.bspTree = bspTree;
    }

}
