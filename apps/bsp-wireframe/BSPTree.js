
const IN_FRONT = 0;
const BEHIND = 1;
const BOTH = 2;

function BSPTree() {

    this.polygon = null;
    this.left = null;
    this.right = null;
    
    this.addPolygon = function(p) {
        if (this.polygon == null) {
            this.polygon = p;
            this.left = new BSPTree();
            this.right = new BSPTree();
        } else {
            var behind = this.polygon.hasPolygonBehind(p);
            
            console.debug("Comparing:");
            console.debug(this.polygon.toString());
            console.debug(p.toString());

            if (behind == IN_FRONT) {
                this.left.addPolygon(p);
            } else if (behind == BEHIND) {
                this.right.addPolygon(p);
            } else {
                console.debug("cutting");
                console.debug(this.polygon.toString());
                console.debug(p.toString());
                var basis = this.polygon.toBasis();
                console.debug(basis.toString());

                var frontPolygon = [];
                var backPolygon = [];
                var trInvMatrix = Matrix3D.basisTransform(basis.u, basis.v, basis.n, basis.o);
                var trMatrix = Matrix3D.viewingTransform(basis.u, basis.v, basis.n, basis.o);

                console.debug(trMatrix.toString());

                var firstVector = p.object.points[p.point_indices[0]].toVector();
                var last = trMatrix.multiplyVector(firstVector).toPoint();

                for (var i = 1;i<p.point_indices.length + 1;i++) {
                    var index = i % p.point_indices.length;
                    var pindex = p.point_indices[index];
                    var point = p.object.points[pindex];
                    var trPoint = trMatrix.multiplyVector(point.toVector()).toPoint();
                    console.debug("tr: " + trPoint.toString());
                    

                    if (last.z > 0 && trPoint.z > 0) {
                        backPolygon.push(pindex);
                    } else if (last.z <= 0 && trPoint.z <= 0) {
                        frontPolygon.push(pindex);
                    } else {
                        var param = (last.z) / (last.z - trPoint.z);
                        var ict_x = last.x + (trPoint.x - last.x) * param;
                        var ict_y = last.y + (trPoint.y - last.y) * param;

                        var ict = new Point3D(ict_x, ict_y, 0);
                        console.debug("ICT");
                        console.debug(ict.toString());

                        /* add the new point to the object's points */
                        var j = p.object.points.length;

                        var trIct = trInvMatrix.multiplyVector(ict.toVector()).toPoint();
                        
                        console.debug(trIct.toString());
                        
                        p.object.points.push(trIct);
                        /* add the point index to both polygons */
                        frontPolygon.push(j);
                        backPolygon.push(j);
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

                console.debug("front:");
                for (var i = 0;i<frontPolygon.length;i++) {
                    console.debug(frontPolygon[i]);   
                }
                console.debug("back:");
                for (var i = 0;i<backPolygon.length;i++) {
                    console.debug(backPolygon[i]);   
                }
                
                if (frontPolygon.length > 0) {
                    p.point_indices = frontPolygon;
                    this.right.addPolygon(p);
                }

                if (backPolygon.length > 0) {
                    var back = new Polygon3D(backPolygon);
                    back.object = p.object;
                    back.object.polygons.push(back);
                
                    this.left.addPolygon(back);
                    
                }

            }
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
