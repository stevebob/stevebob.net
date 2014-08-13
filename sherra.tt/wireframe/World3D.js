
function World3D() {

    /* an array of Point3D objects */
    this.points = [];

    /* the polygons which exist in this world */
    this.polygons = [];

    this.addPolygon = function(p) {
        this.polygons.push(p);
    }
}
