const BIG_INTEGER = 100000000;

function flatten(arr) {
    var flat = [];
    for (i in arr) {
        if (arr[i].constructor == Array) {
            flat = flat.concat(flatten(arr[i]));
        } else {
            flat.push(arr[i]);
        }
    }
    return flat;
}

function zip(xs, ys) {
    var res = [];
    for (var i in xs) {
        res[i] = {_1: xs[i], _2: ys[i]};
    }
    return res;
}

function zip_with(fn, xs, ys) {
    return zip(xs, ys).map(function(x){return fn(x._1, x._2)});
}

// Returns val if pred(val) is true, otherwise null
function check(val, pred) {
    if (pred(val)) {
        return val;
    } else {
        return null;
    }
}

function default_value(value, def) {
    return value == undefined ? def : value;
}

/*
 * Takes a point array representation of a polygon ad returns a line segment 
 * array of the polyon
 */
function polygon_ls(polygon) {
    return polygon.map(function(pt, i, arr) {
        return $LS([pt, arr[(i+1)%arr.length]]);
    });
}

// Returns true iff v is inside the polygon, specified as an array of points
function in_polygon(polygon, v) {

    // converts polygon into a list pf points
    var ls_arr = polygon_ls(polygon);
    var up = $LS([v, $V([v.elements[0], -BIG_INTEGER, 0])]);
    var count = 0;
    if (v.elements.length == 3) {
        v.elements = v.elements.slice(0, 2);
    }

    // a loop is used here rather than a map to allow for early exit
    for (var i in ls_arr) {
        
        ls_arr[i].elements[0].elements[2] = 0;
        ls_arr[i].elements[1].elements[2] = 0;
        if (ls_arr[i].intersection_inc(up) != null) {
            count++;
            if (count == 2) {
                return false;
            }
        }
    }

    return count == 1;
}

function draw_arr(arr) {
    arr.map(function(x){x.draw()});
}

function filter(arr, pred) {
    var ret = [];
    for (var i in arr) {
        if (pred(arr[i])) {
            ret.push(arr[i]);
        }
    }
    return ret;
}
