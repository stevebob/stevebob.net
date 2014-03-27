function Wall() {};
Wall.prototype = new LineSegment();
Wall.create = function(pts, ht, base) {
    var w = new Wall();
    w.setVectors(pts.map($V));
    w.height = default_value(ht, 60);

    if (base == undefined) {
        w.base = 0;
    } else {
        w.base = base;
    }
    return w;
}
$W = Wall.create;

Wall.prototype.rotate = function(angle, centre) {
    for (var i in this.elements) {
        this.elements[i] = this.elements[i].rotate(angle, centre);
    }
}
