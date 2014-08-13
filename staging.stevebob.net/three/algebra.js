//scalar refers to floating point

function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

//Dot Product: vector, vector -> scalar
function dot(a, b) {
    return a.x*b.x + a.y*b.y + a.z*b.z;
}

//Length: vector -> scalar
function length(a) {
    return Math.sqrt(dot(a, a));
}

//Power: float, integer -> float
function power(base, index) {
    var answer = 1;
    for (var i = 0;i<index;i++) {
        answer *= base;
    }
    return answer;
}

//Vector Addition: vector, vector -> vector
function addVector(a, b) {
    return new Vector(a.x+b.x, a.y+b.y, a.z+b.z);
}

//Vector Scalar Multiplication: vector, scalar -> vector
function multiplyVector(a, s) {
    return new Vector(a.x*s, a.y*s, a.z*s);
}

//Projection of Vector a on Vector b: vector, vector -> vector
function project(a, b) {
    return multiplyVector(b, dot(a, b)/power(length(b), 2));
}

//Length of projected vector: vector, vector -> scalar
function projLen(a, b) {
    return length(project(a, b));
}

//Signed Length of projection: vector, vector -> scalar
function sLength(a, b) {
    return dot(a, b)/power(length(b), 2);
}
