
function Polygon3D(point_indices) {

    /* the world in which this polygon exists */
    this.object = null;
    
    this.set_object = function(o) {
        this.object = o;
    }

    /* The indexes into the world's point array in the order
     * they are connected. The first point need not appear twice.
     */
    this.point_indices = point_indices;

    this.setPointIndices = function(new_point_indices) {
        this.point_indices = point_indices;
    }

    this.clone = function() {
        var point_indices = [];
        for (var i = 0;i<this.point_indices.length;i++) {
            point_indices[i] = this.point_indices[i];
        }
        return new Polygon3D(point_indices);
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
        


        console.debug("p: " + this.toString());

        var n = this.normal().normalize();
        var face_pt = this.object.points[this.point_indices[0]];
        
        var inFront = false;
        var behind = false;

        
        /* condition for early exit:
         * both polygons are in the same object and share a point
         */
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
                        console.debug(pt.toString());
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
        }

        for (var i = 0;i<p.point_indices.length;i++) {
            var pt = p.object.points[p.point_indices[i]];
            var vec = face_pt.differenceVector(pt);
            var dp = n.dotProduct(vec);
            console.debug(pt.toString());
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
        console.debug(this.toString());
        var o_points = this.object.points;

        var points = [o_points[this.point_indices[0]],   
                      o_points[this.point_indices[1]]];   
        
        var u = points[1].differenceVector(points[0]).normalize();
        var n = this.normal().normalize().multiplyScalar(1);
        var v = u.crossProduct(n).multiplyScalar(-1);
        return new Basis3D(u, v, n, points[0].toVector());
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

                var ict = new Point3D(ict_x, ict_y, clipping_offset);
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
}

