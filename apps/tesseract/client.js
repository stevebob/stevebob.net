// Generated by CoffeeScript 1.4.0
var Avatar, Pt2D, ThreeDrawer, cam, l1, o, s1;

s1 = null;

l1 = null;

cam = null;

o = null;

$(function() {
  var avatar, f, g;
  cam = new Three.Camera3D(null, 10);
  cam.moveForward(-10);
  cam.moveRight(-10);
  cam.rotateY(Math.PI / 4);
  l1 = $LS4D($V([0, 0, 0, 1]), $V([0, 0, 0, 0]));
  s1 = $S4D($V([0, 0, 0, 2]), $V([1, 0, 0, 0]), $V([0, 1, 0, 0]), $V([0, 0, 1, 0]));
  f = function() {
    var conv, edge, face, i, ict, o3, p1, p2, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;
    o3 = new Three.Object3D();
    o = Object4D.unitHyperCube();
    _ref = o.edges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      edge = _ref[_i];
      conv = s1.intersectWithLineSegment(edge);
      if (conv !== null) {
        if (conv.constructor === LineSegment4D) {
          p1 = new Three.Point3D(conv.e1.elements[0], conv.e1.elements[1], conv.e1.elements[2]);
          o3.points[o3.points.length] = p1;
          p2 = new Three.Point3D(conv.e2.elements[0], conv.e2.elements[1], conv.e2.elements[2]);
          o3.points[o3.points.length] = p2;
          o3.edges[o3.edges.length] = new Three.Edge(p1, p2);
        } else {
          o3.points[o3.points.length] = new Three.Point3D(conv.elements[0], conv.elements[1], conv.elements[2]);
        }
      }
    }
    _ref1 = o.faces;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      face = _ref1[_j];
      ict = s1.intersectWithPolygon(face);
      if (ict !== null) {
        for (_k = 0, _len2 = ict.length; _k < _len2; _k++) {
          i = ict[_k];
          p1 = new Three.Point3D(i.e1.elements[0], i.e1.elements[1], i.e1.elements[2]);
          p2 = new Three.Point3D(i.e2.elements[0], i.e2.elements[1], i.e2.elements[2]);
          o3.edges[o3.edges.length] = new Three.Edge(p1, p2);
        }
      }
    }
    ThreeDrawer.drawObject(o3);
    return setTimeout(f, 30);
  };
  o = Object4D.unitHyperCube();
  g = function() {
    var edge, o3, projPts, pts, _i, _len, _ref;
    o3 = new Three.Object3D();
    _ref = o.edges;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      edge = _ref[_i];
      pts = [edge.e1, edge.e2];
      projPts = pts.map(function(pt) {
        var i, pt3, _j;
        pt3 = $V(pt.elements.slice(0, 3));
        for (i = _j = 0; _j <= 2; i = ++_j) {
          pt3.elements[i] = pt3.elements[i] / (s1.p.elements[3] - pt.elements[3]);
        }
        return new Three.Point3D(pt3.elements[0], pt3.elements[1], pt3.elements[2]);
      });
      o3.points[o3.points.length] = projPts[0];
      o3.points[o3.points.length] = projPts[1];
      o3.edges[o3.edges.length] = new Three.Edge(projPts[0], projPts[1]);
    }
    ThreeDrawer.drawObject(o3);
    return setTimeout(g, 30);
  };
  g();
  avatar = new Avatar(function(x, y) {});
  avatar.bindControls();
  return avatar.loop();
});

Avatar = (function() {

  function Avatar(moveTo) {
    this.moveTo = moveTo;
    this.x = 0;
    this.y = 0;
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.turnLeft = false;
    this.turnRight = false;
    this.upVelocity = 0;
    this.rightVelocity = 0;
    this.maxVelocity = 2;
    this.deceleration = 4;
    this.acceleration = 2;
    this.increaseW = false;
    this.decreaseW = false;
    this.turnPosXW = false;
    this.turnNegXW = false;
    this.turnPosYW = false;
    this.turnNegYW = false;
    this.turnPosZW = false;
    this.turnNegZW = false;
    this.turnPosXY = false;
    this.turnNegXY = false;
    this.turnPosXZ = false;
    this.turnNegXZ = false;
    this.turnPosYZ = false;
    this.turnNegYZ = false;
  }

  Avatar.prototype.bindControls = function() {
    var self;
    self = this;
    document.onkeydown = function(event) {
      console.debug(event.keyCode);
      switch (event.keyCode) {
        case 37:
          return self.turnLeft = true;
        case 39:
          return self.turnRight = true;
        case 38:
        case 188:
        case 87:
          return self.moveDown = true;
        case 40:
        case 79:
        case 83:
          return self.moveUp = true;
        case 68:
        case 69:
          return self.moveRight = true;
        case 65:
          return self.moveLeft = true;
        case 89:
          return self.increaseX = true;
        case 70:
          return self.increaseY = true;
        case 71:
          return self.increaseZ = true;
        case 67:
          return self.increaseW = true;
        case 84:
          return self.decreaseW = true;
        case 49:
          return self.turnPosXW = true;
        case 50:
          return self.turnNegXW = true;
        case 51:
          return self.turnPosYW = true;
        case 52:
          return self.turnNegYW = true;
        case 53:
          return self.turnPosZW = true;
        case 54:
          return self.turnNegZW = true;
        case 55:
          return self.turnPosXY = true;
        case 56:
          return self.turnNegXY = true;
        case 57:
          return self.turnPosXZ = true;
        case 48:
          return self.turnNegXZ = true;
        case 219:
        case 189:
          return self.turnPosYZ = true;
        case 221:
        case 187:
          return self.turnNegYZ = true;
      }
    };
    return document.onkeyup = function(event) {
      switch (event.keyCode) {
        case 37:
          return self.turnLeft = false;
        case 39:
          return self.turnRight = false;
        case 38:
        case 188:
        case 87:
          return self.moveDown = false;
        case 40:
        case 79:
        case 83:
          return self.moveUp = false;
        case 68:
        case 69:
          return self.moveRight = false;
        case 65:
          return self.moveLeft = false;
        case 89:
          return self.increaseX = false;
        case 70:
          return self.increaseY = false;
        case 71:
          return self.increaseZ = false;
        case 67:
          return self.increaseW = false;
        case 84:
          return self.decreaseW = false;
        case 49:
          return self.turnPosXW = false;
        case 50:
          return self.turnNegXW = false;
        case 51:
          return self.turnPosYW = false;
        case 52:
          return self.turnNegYW = false;
        case 53:
          return self.turnPosZW = false;
        case 54:
          return self.turnNegZW = false;
        case 55:
          return self.turnPosXY = false;
        case 56:
          return self.turnNegXY = false;
        case 57:
          return self.turnPosXZ = false;
        case 48:
          return self.turnNegXZ = false;
        case 219:
        case 189:
          return self.turnPosYZ = false;
        case 221:
        case 187:
          return self.turnNegYZ = false;
      }
    };
  };

  Avatar.prototype.move = function() {
    if (this.increaseW) {
      s1.p.elements[3] += 0.01;
    }
    if (this.decreaseW) {
      s1.p.elements[3] -= 0.01;
    }
    if (this.turnPosXW) {
      o.applyMatrix(rotateXW(Math.PI / 36));
    }
    if (this.turnNegXW) {
      o.applyMatrix(rotateXW(-Math.PI / 36));
    }
    if (this.turnPosYW) {
      o.applyMatrix(rotateYW(Math.PI / 36));
    }
    if (this.turnNegYW) {
      o.applyMatrix(rotateYW(-Math.PI / 36));
    }
    if (this.turnNegZW) {
      o.applyMatrix(rotateZW(Math.PI / 36));
    }
    if (this.turnPosZW) {
      o.applyMatrix(rotateZW(-Math.PI / 36));
    }
    if (this.turnPosXY) {
      o.applyMatrix(rotateXY(Math.PI / 36));
    }
    if (this.turnNegXY) {
      o.applyMatrix(rotateXY(-Math.PI / 36));
    }
    if (this.turnPosXZ) {
      o.applyMatrix(rotateXZ(Math.PI / 36));
    }
    if (this.turnNegXZ) {
      o.applyMatrix(rotateXZ(-Math.PI / 36));
    }
    if (this.turnPosYZ) {
      o.applyMatrix(rotateYZ(Math.PI / 36));
    }
    if (this.turnNegYZ) {
      o.applyMatrix(rotateYZ(-Math.PI / 36));
    }
    if (this.turnLeft) {
      cam.rotateY(-Math.PI / 36);
    }
    if (this.turnRight) {
      cam.rotateY(Math.PI / 36);
    }
    if (this.moveUp) {
      this.upVelocity = Math.max(this.upVelocity - this.acceleration, -this.maxVelocity);
    } else if (this.moveDown) {
      this.upVelocity = Math.min(this.upVelocity + this.acceleration, this.maxVelocity);
    }
    if (this.moveRight) {
      this.rightVelocity = Math.min(this.rightVelocity + this.acceleration, this.maxVelocity);
    } else if (this.moveLeft) {
      this.rightVelocity = Math.max(this.rightVelocity - this.acceleration, -this.maxVelocity);
    }
    this.tryToMove(this.rightVelocity, this.upVelocity);
    cam.moveForward(this.upVelocity);
    cam.moveRight(this.rightVelocity);
    if (this.upVelocity > 0) {
      this.upVelocity = Math.max(this.upVelocity - this.deceleration, 0);
    } else if (this.upVelocity < 0) {
      this.upVelocity = Math.min(this.upVelocity + this.deceleration, 0);
    }
    if (this.rightVelocity > 0) {
      return this.rightVelocity = Math.max(this.rightVelocity - this.deceleration, 0);
    } else if (this.rightVelocity < 0) {
      return this.rightVelocity = Math.min(this.rightVelocity + this.deceleration, 0);
    }
  };

  Avatar.prototype.tryToMove = function(dx, dy) {
    return this.moveTo(dx, dy);
  };

  Avatar.prototype.loop = function() {
    var loopFn;
    loopFn = function(self) {
      self.move();
      return setTimeout(loopFn, 25, self);
    };
    return loopFn(this);
  };

  return Avatar;

})();

Pt2D = (function() {

  function Pt2D(x, y) {
    this.x = x;
    this.y = y;
  }

  return Pt2D;

})();

ThreeDrawer = (function() {

  function ThreeDrawer() {}

  ThreeDrawer.drawObject = function(o) {
    var v, w;
    w = new Three.World3D();
    o.basis.uvnMultiplyMatrix(Three.Matrix3D.scaleTransform(10, 10, 10));
    w.addObject(o);
    o.globalize();
    w.generateBSPTree();
    cam.world = w;
    v = new Three.Viewer();
    cam.registerViewer(v);
    return cam.render();
  };

  return ThreeDrawer;

})();
