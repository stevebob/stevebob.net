function WallBSPTree() {

    const WALL = 0;
    const CHARACTER = 1;

    this.lazyWall;
    this.wall = null;;
    this.left = null;
    this.right = null;

    this.type = WALL;


    /* This is called once during loading */
    this.link = function(walls) {

        for (var i = 0;i!=walls.length;++i) {
            if (walls[i].id == this.lazyWall) {

                this.wall = walls[i];

                break;
            }
        }

        if (this.left != null) {
            this.left.link(walls);
        }
        if (this.right != null) {
            this.right.link(walls);
        }

    }

    this.drawOrder = function() {
        var order;
        if (this.right == null) {
            order = [];
        } else {
            order = this.right.drawOrder();
        }

        order.push({value: this.wall, type: this.type});

        if (this.left != null) {
            order = order.concat(this.left.drawOrder());
        }

        return order;
    }

    this.insertVerticalFaceLeft = function(p) {
        if (this.left == null) {
            this.left = new WallBSPTree();
            this.left.wall = p.value;
            this.left.type = p.type;
        } else {
            this.left.insertVerticalFace(p);
        }
    }

    this.insertVerticalFaceRight = function(p) {
        if (this.right == null) {
            this.right = new WallBSPTree();
            this.right.wall = p.value;
            this.right.type = p.type;
        } else {
            this.right.insertVerticalFace(p);
        }
    }

    this.insertVerticalFace = function(p) {
    
        /* p should have a value, type, p0, and p1, both points */

        /* check to see if the polygon being inserted is in front
         * of the wall
         */
        
        var thisToP0 = p.p0.subtract(this.wall.points[0]);
        var thisToP1 = p.p1.subtract(this.wall.points[0]);


        var dotPP0 = thisToP0.dotProduct(this.wall.normal);

        var dotPP1 = thisToP1.dotProduct(this.wall.normal);
        

        if (dotPP0 >= 0 && dotPP1 >= 0) {
            /* the inserted face is in front of the current wall */
       
            this.insertVerticalFaceLeft(p);

        } else if (dotPP0 < 0 && dotPP1 < 0) {
            /* the inserted face is behind the current wall */
            
            this.insertVerticalFaceRight(p);

        } else {
            /* the inserted face needs to be split */
            
            this.insertVerticalFaceLeft(p);

        }
    }

    this.clone = function() {
        var ret = new WallBSPTree();
        if (this.left != null) {
            ret.left = this.left.clone();
        }
        if (this.right != null) {
            ret.right = this.right.clone();
        }
        ret.wall = this.wall;
        ret.type = this.type;

        return ret;
    }
}

WallBSPTree.fromDOM = function(doc) {
    var ret = new WallBSPTree();
    ret.lazyWall = parseInt(doc.getAttribute("wall"));

    for (var i = 0;i!=doc.childNodes.length;++i) {
        if (doc.childNodes[i].tagName == "left") {
            ret.left = WallBSPTree.fromDOM(doc.childNodes[i]);
        } else if (doc.childNodes[i].tagName == "right") {
            ret.right = WallBSPTree.fromDOM(doc.childNodes[i]);
        }
    }

    return ret;
}
