
function Polygon3D(point_indices) {

    /* the world in which this polygon exists */
    this.world = null;
    
    this.set_world = function(w) {
        this.world = w;
    }

    /* The indexes into the world's point array in the order
     * they are connected. The first point need not appear twice.
     */
    this.point_indices = point_indices;

    this.normal = function() {
        var points = [this.world.points[this.point_indices[0]],   
                      this.world.points[this.point_indices[1]],   
                      this.world.points[this.point_indices[2]]];
        
        var v0 = points[1].differenceVector(points[0]);
        var v1 = points[1].differenceVector(points[2]);

        var n = v0.crossProduct(v1);
        
        return n;
    }

}
