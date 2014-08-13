function Wall() {
    
    this.drawBottom = true;

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
        var points = this.points;
        var highPt, lowPt;
        if (points[0].y >= points[1].y) {
            highPt = points[0];
            lowPt = points[1];
        } else {
            highPt = points[1];
            lowPt = points[0];
        }

        var vector = highPt.subtract(lowPt);
        var normal;
        if (vector.x < 0) {
            normal = new Point2D(-vector.y, vector.x);
        } else {
            normal = new Point2D(vector.y, -vector.x);
        }

        this.normal = normal;
    }
}

Wall.fromDOM = function(doc) {

    var points = doc.getElementsByTagName("point");

    var ret = new Wall();

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
