// Generated by CoffeeScript 1.4.0
var allZeros, rotateXW, rotateXY, rotateXZ, rotateYW, rotateYZ, rotateZW, zip, zipWith;

zip = function(xs, ys) {
  var rest;
  if (!(xs.length && ys.length)) {
    return [];
  }
  rest = zip(xs.slice(1), ys.slice(1));
  rest.unshift({
    _1: xs[0],
    _2: ys[0]
  });
  return rest;
};

zipWith = function(xs, ys, fn) {
  return (zip(xs, ys)).map(function(x) {
    return fn(x._1, x._2);
  });
};

allZeros = function(arr) {
  if (arr.length === 0) {
    return true;
  } else {
    if (arr[0] === 0) {
      return allZeros(arr.slice(1));
    } else {
      return false;
    }
  }
};

rotateXY = function(theta) {
  return $M([[Math.cos(theta), Math.sin(theta), 0, 0], [-(Math.sin(theta)), Math.cos(theta), 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
};

rotateXW = function(theta) {
  return $M([[Math.cos(theta), 0, 0, Math.sin(theta)], [0, 1, 0, 0], [0, 0, 1, 0], [-(Math.sin(theta)), 0, 0, Math.cos(theta)]]);
};

rotateYW = function(theta) {
  return $M([[1, 0, 0, 0], [0, Math.cos(theta), 0, -(Math.sin(theta))], [0, 0, 1, 0], [0, Math.sin(theta), 0, Math.cos(theta)]]);
};

rotateZW = function(theta) {
  return $M([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, Math.cos(theta), -(Math.sin(theta))], [0, 0, Math.sin(theta), Math.cos(theta)]]);
};

rotateYZ = function(theta) {
  return $M([[1, 0, 0, 0], [0, Math.cos(theta), Math.sin(theta), 0], [0, -(Math.sin(theta)), Math.cos(theta), 0], [0, 0, 0, 1]]);
};

rotateXZ = function(theta) {
  return $M([[Math.cos(theta), 0, -(Math.sin(theta)), 0], [0, 1, 0, 0], [Math.sin(theta), 0, Math.cos(theta), 0], [0, 0, 0, 1]]);
};
