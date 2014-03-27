function DrawOrder() {}

/*
 * This determines an order in which a collection of walls may be drawn
 * such that 
 */
DrawOrder.arrange = function(walls, away) {
    /* initial setup:
     * set each wall to be not added
     * annotate each will with projection lines from its end points
     */
    for (i in walls) {
        walls[i].added = false;
        walls[i].proj = walls[i].elements.map(function(v) {
            return $L(v, away);
        });
        walls[i].extended = walls[i].get_extended();
    }

    /* this will store the walls in their draw order */
    var order = [];
    for (var rem = 0;rem!=walls.length;++rem) {
        /* we don't actually use rem in this loop, but it can
         * be proven that once this loop terminates, all
         * the walls have been put in order
         */



        var to_add = null;
        for (var i in walls) {if (!walls[i].added) {
            /* this will find and add exactly one wall to the
             * resulting sequence
             */
            var found = true;
            for (var j in walls) {if (!walls[j].added && i!=j) {
                /* if one of walls[i]'s away-projections inctercects
                 * with wall[j]
                 */
                for (var k in [0,1]) {
                    var proj = walls[i].proj[k];
                    /* check if proj interects walls[j] */
                    var intersection = proj.intersectionWith(walls[j].extended);
                    if (intersection == null) {continue}

                    if (walls[j].contains_colinear_exc(intersection) &&
                        intersection.subtract(proj.anchor).dot(away) > 0) {

                        found = false;
                        break;
                    }
                }

                if (!found) {break}
            }}

            if (!found) {continue}

            /* if we get here, found is still true */

            /* now look for walls whose towards-camera projetions
             * intersect with walls[i]
             */
            for (var j in walls) {if (!walls[j].added && i!=j) {
                for (var k in [0,1]) {
                    var proj = walls[j].proj[k];
                    var intersection = proj.intersectionWith(walls[i].extended);
                    if (intersection == null) {continue}
                    if (walls[i].contains_colinear_exc(intersection) &&
                        intersection.subtract(proj.anchor).dot(away) < 0) {

                        found = false;
                        break;
                    }
                }

                if (!found) {break}
            }}

            if (found) {
                to_add = walls[i];
                walls[i].added = true;
                break;
            }
        }}

        if (to_add == null) {console.debug("ERROR")}

        order.push(to_add);
        to_add = null;
    }

    return order;
}
