
function Camera3D(world) {
    
    /* the world in which this camera exists */
    this.world = world;

    var depth = 15;

    this.origin = new Vector3D(0, 0, -5, 1);
    this.n = new Vector3D(0, 0, 1, 1);
    this.v = new Vector3D(0, 1, 0, 1);
    this.u = new Vector3D(1, 0, 0, 1);


    function convert3Dto2D(p3d) {

        return Matrix3D.doPerspectiveTransform(depth, p3d);

    }

    var viewer;

    this.registerViewer = function(v) {
        viewer = v;
    }

    this.render = function() {

        var objects = this.world.objects;

        var transformMatrix = Matrix3D.viewingTransform(this.u, this.v, this.n, this.origin);

        /* draw each point */
        /*
        for (var i = 0;i<points.length;i++) {
            var xyzVector = points[i].toVector();
            var uvnVector = transformMatrix.multiplyVector(xyzVector);
            var p3d = uvnVector.toPoint();
            if (p3d.z >= -depth) {
                var p2d = convert3Dto2D(p3d);

                viewer.dot(p2d);
            }
        }
        */
        
        for (var obj_i = 0;obj_i < objects.length;obj_i++) {

            
            var polygons = objects[obj_i].polygons;
            var points = objects[obj_i].points;


            /* draw each polygon in wireframe */
            for (var i = 0;i<polygons.length;i++) {
                var point_indices = polygons[i].point_indices;

                /* got the vector from the eye to the first point
                 * of the polygon
                 */
                var eyeToPolygon = points[point_indices[0]].toVector().addVector(this.origin.addVector(this.n.multiplyScalar(-depth)).multiplyScalar(-1));
                var normal = polygons[i].normal();
                var viewingAngle = eyeToPolygon.dotProduct(normal);
                //console.debug(viewingAngle + " | " + normal.toString() + " | " +eyeToPolygon.toString());

                /* cull the back faces */
                if (viewingAngle >= 0) {
                    continue;
                }
                var clipping_offset = -depth;

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

                if (obj_i == 0) {
                    viewer.setFillStyle("rgb(150, 150, 200)");
                } else {
                    viewer.setFillStyle("rgb(150, 200, 150)");
                }
                viewer.polygon(pts2d);
            }
        }

    }

    this.translate = function(x, y, z) {
        var transformation = Matrix3D.translateTransform(x, y, z);
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
        var transformation = Matrix3D.rotateTransformY(theta);
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
