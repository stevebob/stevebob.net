function Point2D(x, y) {
    this.x = x;
    this.y = y;
    
    this.connection = false;
    this.lazyConnect = 0;
    this.connectedTo = null;

    this.add = function(p) {
        return new Point2D(this.x+p.x, this.y+p.y);
    }

    this.scalarMultiply = function(s) {
        return new Point2D(this.x*s, this.y*s);
    }

    this.subtract = function(p) {
        return new Point2D(this.x - p.x, this.y - p.y);
    }
    
    this.dotProduct = function(p) {
        return this.x * p.x + this.y * p.y;
    }
}

Point2D.fromDOM = function(doc) {
    var ret = new Point2D(parseInt(doc.getAttribute("x")), parseInt(doc.getAttribute("y")));
    if (doc.hasAttribute("connectedTo")) {
        ret.connection = true;
        ret.lazyConnect = parseInt(doc.getAttribute("connectedTo"));
    }
    
    return ret;
}
