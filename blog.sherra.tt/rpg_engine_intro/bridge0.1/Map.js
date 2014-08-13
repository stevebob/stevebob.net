function Map() {
    
    this.polygons = [];

    this.addPolygon = function(polygon) {
        var i = 0;
        while(i < this.polygons.length && 
              this.polygons[i].zindex < polygon.zindex) {
            ++i;
        }
        this.polygons.splice(i, 0, polygon);
    }

    this.walls = [];
    this.addWall = function(wall) {
        this.walls.push(wall);
    }

}

Map.fromDOM = function(doc) {

    var polygons = doc.getElementsByTagName("polygon");
    
    var ret = new Map();
    
    for (var i = 0;i!=polygons.length;++i) {
        ret.addPolygon(Polygon2D.fromDOM(polygons[i]));
    }

    /* Now that we have all the polygons, it's time to link up the
     * lazy connections.
     */
    for (var i = 0;i!=ret.polygons.length;++i) {
        var polygon = ret.polygons[i];
        var points = polygon.points;
        for (var j = 0;j!=points.length;++j) {
            var point = points[j];
            if (point.connection) {
                var id = point.lazyConnect;
                for (var k = 0;k!=ret.polygons.length;k++) {
                    var current = ret.polygons[k];
                    if (current.id == id) {
                        point.connectedTo = current;
                        break;
                    }
                }
            }
        }
    }

    var walls = doc.getElementsByTagName("wall");
    for (var i = 0;i!=walls.length;++i) {
        ret.addWall(Wall.fromDOM(walls[i]));
    }
    return ret;
}
