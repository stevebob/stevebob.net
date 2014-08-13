
function Character(startx, starty) {
 
    this.loc = new Point2D(startx, starty);   

    this.radius = 20;

    this.currentPolygon = null;

    this.crossing = false;

    
    var width = 15;

    this.p0 = function() {
        return new Point2D(this.loc.x + width, this.loc.y + width)
    };

    this.p1 = function() {
        return new Point2D(this.loc.x - width, this.loc.y - width)
    };

    function between(a, b, c) {
        if (a <= b && b <= c) {
            return true;
        }
        if (a >= b && b >= c) {
            return true;
        }

        return false;
    }
    
    function betweenLeftInclusive(a, b, c) {
        if (a <= b && b < c) {
            return true;
        }
        if (a >= b && b > c) {
            return true;
        }

        return false;
    }
    
    function inPolygon(e0, polygon) {
        var e1 = new Point2D(e0.x, e0.y+10000);
        
        var count = 0;

        var points = polygon.points;
        var last = points[0];
        for (var i = 1;i!=points.length + 1;++i) {
            var current;
            if (i == points.length) {
                current = points[0];
            } else {
                current = points[i];
            }

            if (segmentsIntersect(e0, e1, last, current)) {
                ++count;
            }

            last = current;
        }


        return count % 2 == 1;

    }

    function segmentsIntersect(l0e0, l0e1, l1e0, l1e1) {
        
        /* when doing point-in-polygon testing, the second line
         * must be part of the polygon */

        /* make sure that e1 is higher than e0 */
        if (l0e0.y > l0e1.y) {
            var tmp = l0e0;
            l0e0 = l0e1;
            l0e1 = tmp;
        }

        if (l1e0.y > l1e1.y) {
            var tmp = l1e0;
            l1e0 = l1e1;
            l1e1 = tmp;
        }

        var dx0 = l0e0.x - l0e1.x;
        var dy0 = l0e0.y - l0e1.y;
        var dx1 = l1e0.x - l1e1.x;
        var dy1 = l1e0.y - l1e1.y;

        if (dx0 == 0 && dx1 == 0) {
            /* both lines are vertical, so parallel */
            return false;
        }

        /* at least one of the lines is not vertical */
        
        var m0 = dy0/dx0;
        var m1 = dy1/dx1;
        var c0 = l0e0.y - m0*l0e0.x;
        var c1 = l1e0.y - m1*l1e0.x;

        if (dx0 == 0) {
            /* l0 is vertical, l1 is not */
            var yint = m1 * l0e0.x + c1;
            return betweenLeftInclusive(l1e0.x, l0e0.x, l1e1.x) && between(l0e0.y, yint, l0e1.y);
        }

        if (dx1 == 0) {
            /* l1 is vertical, l1 is not */
            var yint = m0 * l1e0.x + c0;
            return between(l0e0.x, l1e0.x, l0e1.x) && betweenLeftInclusive(l1e0.y, yint, l1e1.y);
        }

        /* neither line is vertical - m0 and m1 both have values */

         if (m0 == m1) {
             /* parallel lines */
             return false;
         }

         /* the lines are not parallel */

        var xint = (c1 - c0) / (m0 - m1);
        
        return between(l0e0.x, xint, l0e1.x) && betweenLeftInclusive(l1e0.x, xint, l1e1.x);
    }   

    this.move = function(x, y) {

        var targetX = this.loc.x + x;
        var targetY = this.loc.y + y;
        
        var tmpX = targetX;
        var tmpY = targetY;

        if (this.currentPolygon != null) {
            var points = this.currentPolygon.points;
            var first = points[0];
            var last = first;

            for (var i = 1;i!=points.length+1;++i) {
                
                var collision = false;
                
                var current;
                if (i == points.length) {
                    current = first;
                } else {
                    current = points[i];
                }
                
                var toPointX = tmpX - current.x;
                var toPointY = tmpY - current.y;

                var backupX = tmpX;
                var backupY = tmpY;

                if (Math.sqrt(toPointX*toPointX + toPointY*toPointY) <= this.radius) {
                    collision = true;
                    tmpX = this.loc.x;
                    tmpY = this.loc.y;
                }
                
                var dx = current.x - last.x;
                var dy = current.y - last.y;


                if (Math.abs(dx) <= 0.001) {
                    /* vertical line */

                    
                    if (Math.abs(current.x - tmpX) <= this.radius) {
                        if (between(current.y, tmpY, last.y)) {
                            if (this.loc.x >= current.x) {
                                tmpX = current.x + this.radius;
                            } else {
                                tmpX = current.x - this.radius;
                            }
                            collision = true;
                        }
                    }

                } else if (Math.abs(dy) <= 0.001) {
                    /* horizontal line */
                    if (Math.abs(current.y - tmpY) <= this.radius) {
                        if (between(current.x, tmpX, last.x)) {
                            if (this.loc.y >= current.y) {
                                tmpY = current.y + this.radius;
                            } else {
                                tmpY = current.y - this.radius;
                            }
                            collision = true;
                        }
                    }

                } else {


                }
                
                if (collision) {
                    if (last.connection && current.connection && current.connectedTo == last.connectedTo) {
                        tmpX = backupX;
                        tmpY = backupY;

                        if (inPolygon(new Point2D(targetX, targetY), current.connectedTo)) {
                            this.currentPolygon = current.connectedTo;
                        }

                    }
                }

                last = current;
            }
            
        }
        this.loc.x = tmpX;
        this.loc.y = tmpY;
    }

}
