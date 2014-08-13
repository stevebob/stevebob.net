
function Polygon3D(point_indices) {

    /* the world in which this polygon exists */
    this.world = null;

    /* The indexes into the world's point array in the order
     * they are connected. The first point need not appear twice.
     */
    this.point_indices = point_indices;

    

}
