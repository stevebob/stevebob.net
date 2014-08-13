function Wall() {
    
    this.drawBottom = true;

    this.id;
    this.points = [];
    this.topHeights = [];
    this.bottomHeights = [];

    this.addPoint = function(point, topHeight, bottomHeight) {
        this.points.push(point);
        this.topHeights.push(topHeight);
        this.bottomHeights.push(bottomHeight);
    }
    
    this.normal;
    this.calculateNormal = function() {
        var p0 = this.points[0];
        var p1 = this.points[1];

        var v = p0.subtract(p1);

        var normal = new Point2D(v.y, -v.x);

        if (normal.x >= 0 && normal.y <= 0 ||
            normal.x > 0 && normal.y >= 0 && Math.abs(normal.y) < Math.abs(normal.x) ||
            normal.x <= 0 && normal.y < 0 && Math.abs(normal.x) < Math.abs(normal.y)) {
            
            normal.x = -normal.x;
            normal.y = -normal.y;
        }

        this.normal = normal;
    
    }
}

Wall.fromDOM = function(doc) {

    var points = doc.getElementsByTagName("point");

    var ret = new Wall();

    ret.id = parseInt(doc.getAttribute("id"));

    if (doc.hasAttribute("top")) {
        ret.topHeight = parseInt(doc.getAttribute("top"));
    } else {
        ret.topHeight = 0;
    }

    if (doc.hasAttribute("bottom")) {
        ret.bottomHeight = parseInt(doc.getAttribute("bottom"));
    } else {
        ret.bottomHeight = 0;
    }

    var drawBottom = doc.getAttribute("drawBottom");
    if (drawBottom = "false") {
        ret.drawBottom = false;
    }

    for (var i = 0;i<points.length;i++) {
        var topHeight, bottomHeight;

        if (points[i].hasAttribute("top")) {
            topHeight = parseInt(points[i].getAttribute("top"));
        } else {
            topHeight = ret.topHeight;
        }
        
        if (points[i].hasAttribute("bottom")) {
            bottomHeight = parseInt(points[i].getAttribute("bottom"));
        } else {
            bottomHeight = ret.bottomHeight;
        }

        ret.addPoint(Point2D.fromDOM(points[i]), topHeight, bottomHeight);
    }
    
    ret.calculateNormal();

    return ret;
}
