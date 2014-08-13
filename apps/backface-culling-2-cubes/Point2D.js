
function Point2D(x, y) {

    this.x = x;
    this.y = y;

    this.toString = function() {
        return [x, y].join(", ");
    }
}
