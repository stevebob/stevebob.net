function LineSegment(){}
LineSegment.prototype.setVectors = function(pts) {
    this.elements = pts;
}

/*
 * Returns a line containing the two endpoints of the line segment
 */
LineSegment.prototype.get_extended = function() {
    this.elements[0].elements[2] = 0;
    this.elements[1].elements[2] = 0;
    return $L(this.elements[0], this.elements[1].subtract(this.elements[0]));
}

/*
 * Takes a point colinear to the line formed by extending the line segment
 * and returns true iff that point lies between (inclusive) the endpoints
 * of the line segment.
 */
LineSegment.prototype.contains_colinear_inc = function(v) {

    // horizontal line edge case
    if (this.elements[0].elements[1] == this.elements[1].elements[1]) {
        return (this.elements[0].elements[0] <= v.elements[0] && v.elements[0] <= this.elements[1].elements[0]) ||
               (this.elements[1].elements[0] <= v.elements[0] && v.elements[0] <= this.elements[0].elements[0]);
    }

    // vertical line edge case
    if (this.elements[0].elements[0] == this.elements[1].elements[0]) {
        return (this.elements[0].elements[1] <= v.elements[1] && v.elements[1] <= this.elements[1].elements[1]) ||
               (this.elements[1].elements[1] <= v.elements[1] && v.elements[1] <= this.elements[0].elements[1]);
    }


    return ((this.elements[0].elements[0] <= v.elements[0] && v.elements[0] <= this.elements[1].elements[0]) ||
           (this.elements[1].elements[0] <= v.elements[0] && v.elements[0] <= this.elements[0].elements[0])) &&
           ((this.elements[0].elements[1] <= v.elements[1] && v.elements[1] <= this.elements[1].elements[1]) ||
           (this.elements[1].elements[1] <= v.elements[1] && v.elements[1] <= this.elements[0].elements[1]));
}

//Same as above but exclusive
LineSegment.prototype.contains_colinear_exc = function(v) {

    // horizontal line edge case
    if (this.elements[0].elements[1] == this.elements[1].elements[1]) {
        return (this.elements[0].elements[0] < v.elements[0] && v.elements[0] < this.elements[1].elements[0]) ||
               (this.elements[1].elements[0] < v.elements[0] && v.elements[0] < this.elements[0].elements[0]);
    }

    // vertical line edge case
    if (this.elements[0].elements[0] == this.elements[1].elements[0]) {
        return (this.elements[0].elements[1] < v.elements[1] && v.elements[1] < this.elements[1].elements[1]) ||
               (this.elements[1].elements[1] < v.elements[1] && v.elements[1] < this.elements[0].elements[1]);
    }

    return ((this.elements[0].elements[0] < v.elements[0] && v.elements[0] < this.elements[1].elements[0]) ||
           (this.elements[1].elements[0] < v.elements[0] && v.elements[0] < this.elements[0].elements[0])) &&
           ((this.elements[0].elements[1] < v.elements[1] && v.elements[1] < this.elements[1].elements[1]) ||
           (this.elements[1].elements[1] < v.elements[1] && v.elements[1] < this.elements[0].elements[1]));
}


/*
 * Returns the point of intersection between the lines containing two line segments
 * null if no such point exists
 */
LineSegment.prototype.intersection_between_extensions = function(other) {
    return this.get_extended().intersectionWith(other.get_extended());
}

LineSegment.prototype.intersection_inc = function(other) {
    var ls = this;
    return check(this.intersection_between_extensions(other),
        function(intersection) {
            return intersection != null &&
                   ls.contains_colinear_inc(intersection) &&
                   other.contains_colinear_inc(intersection);
        });
}

LineSegment.prototype.intersection_exc = function(other) {
    var ls = this;
    return check(this.intersection_between_extensions(other),
        function(intersection) {
            return intersection != null &&
                   ls.contains_colinear_exc(intersection) &&
                   other.contains_colinear_exc(intersection);
        });
}

LineSegment.prototype.rotate = function(angle, centre) {
    if (this.elements[0].elements.length == 3) {
        this.elements[0].elements = this.elements[0].elements.slice(0, 2);
        this.elements[1].elements = this.elements[1].elements.slice(0, 2);
    }
    this.elements[0] = this.elements[0].rotate(angle, centre);
    this.elements[1] = this.elements[1].rotate(angle, centre);
}

LineSegment.create = function(pts) {
    var a = new LineSegment();
    a.setVectors(pts.map(
        function(v) {
            if (v.constructor == Array) {
                return $V(v);
            } else {
                return v;
            }
        }
    ));
    return a;
}
$LS = LineSegment.create;
