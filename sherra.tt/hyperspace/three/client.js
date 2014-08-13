document.onkeydown = keyPressHandle
document.onkeyup = keyUpHandle;
document.onresize = handleResize;

var w, v, c, o;

function handleResize() {
    v.updateDimensions();
}

function main() {
    console.debug("starting...\n");

    w = new Three.World3D();
    o = new Three.Object3D();

    const hallway = 0.5;
    o.currentColour = "rgb(200, 255, 200)";

    o.points[0] = (new Three.Point3D(1, 1, 1));
    o.points[1] = (new Three.Point3D(1, 1, -1));
    o.points[2] = (new Three.Point3D(1, -1, 1));
    o.points[3] = (new Three.Point3D(1, -1, -1));
    o.points[4] = (new Three.Point3D(-1, 1, 1));
    o.points[5] = (new Three.Point3D(-1, 1, -1));
    o.points[6] = (new Three.Point3D(-1, -1, 1));
    o.points[7] = (new Three.Point3D(-1, -1, -1));

    o.addPolygon(new Three.Polygon3D([0, 1, 3, 2]));
    o.addPolygon(new Three.Polygon3D([4, 6, 7, 5]));
    o.addPolygon(new Three.Polygon3D([0, 4, 5, 1]));
    o.addPolygon(new Three.Polygon3D([2, 3, 7, 6]));
    o.addPolygon(new Three.Polygon3D([0, 2, 6, 4]));
    o.addPolygon(new Three.Polygon3D([1, 5, 7, 3]));
    
   // o.turnInsideOut();
    o.basis.uvnMultiplyMatrix(Three.Matrix3D.scaleTransform(10, 10, 10));
    
    o.globalize();
    
    o.currentColour = "rgb(200, 255, 255)";
    var o3 = o.applyMatrix(Three.Matrix3D.translateTransform(0, 0, -320).multiplyMatrix(Three.Matrix3D.rotateTransformY(Math.PI)));

    w.addObject(o);
    
    console.debug("generating BSP tree...");
    w.generateBSPTree();

    c = new Three.Camera3D(w, 10);
    v = new Three.Viewer();
    c.registerViewer(v);
    
    c.moveUp(3);
    c.rotateY(Math.PI);
    c.moveForward(-15);
    c.moveRight(-8);
    

    displayLoop();
    console.debug("done\n");
}

/*

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_COMMA = 188;
const KEY_O = 79;
const KEY_E = 69;

var forward_speed = 0;
var right_speed = 0;
var rotate_speed = 0;

var move_acc = 1;
var rotate_acc = Math.PI/24;

var move_dec = 1;
var rotate_dec = 1;

var max_move_speed = 10;

var max_rotate_speed = Math.PI/6;

function move_forwards() {
    if (forward_speed < max_move_speed) {
        forward_speed+=move_acc;
    }
}

function move_backwards() {
    if (forward_speed > -max_move_speed) {
        forward_speed-=move_acc;
    }
}

function move_left() {
    if (right_speed > -max_move_speed) {
        right_speed-=move_acc;
    }
}

function move_right() {
    if (right_speed < max_move_speed) {
        right_speed+=move_acc;
    }
}


function rotate_left() {
    if (rotate_speed > -max_rotate_speed) {
        rotate_speed-=rotate_acc;
    }
}

function rotate_right() {
    if (rotate_speed < max_rotate_speed) {
        rotate_speed+=rotate_acc;
    }
}

function slow_down() {
    if (forward_speed >= 1) {
        forward_speed-=move_dec;
    } else if (forward_speed <= -1) {
        forward_speed+= move_dec;
    }

    if (Math.abs(forward_speed) < 1 && forward_speed != 0) {
        forward_speed = 0;
    }
    
    if (right_speed >= 1) {
        right_speed-=move_dec;
    } else if (right_speed <= -1) {
        right_speed+= move_dec;
    }

    if (Math.abs(right_speed) < 1 && right_speed != 0) {
        right_speed = 0;
    }

    if (rotate_speed >= 1) {
        rotate_speed-=rotate_dec;
    } else if (rotate_speed <= -1) {
        rotate_speed+= rotate_dec;
    }

    if (Math.abs(rotate_speed) < 1 && rotate_speed != 0) {
        rotate_speed = 0;
    }



}*/

var forward = 0;
var up = 0;
var left = 0;
var rotate = 0;
var vrotate = 0;

var zVel = 0;
var xVel = 0;
var yVel = 0;
var vrVel =0;
var rVel = 0;
var rvel_max = Math.PI / 72;
var racc = Math.PI/144;
var vel_max = 1;
var acc = 0.025;

function move() {
    var inc = 1;

    if (Math.abs(yVel) < vel_max) {
        yVel -= up * acc;
    }

    if (Math.abs(xVel) < vel_max) {
        xVel -= left * acc;
    }
    
    if (Math.abs(zVel) < vel_max) {
        zVel -= forward * acc;
    }

    if (Math.abs(rVel) < rvel_max) {
        rVel -= rotate * acc;
    }
    
    if (Math.abs(vrVel) < rvel_max) {
        vrVel -= vrotate * acc;
    }

    c.moveForward(zVel);
    c.moveUp(yVel);
    c.moveRight(xVel);
    c.rotateY(rVel);
    //c.rotateX(vrVel);
//        sourceX += xVel;
//        sourceY += yVel;

    if (up == 0 && yVel != 0) {
    if (Math.abs(yVel) < inc) {
        yVel = 0;
    } else {
        yVel -= (inc * yVel/Math.abs(yVel));
    }}

    if (left == 0 && xVel != 0) {
    if (Math.abs(xVel) < inc) {
        xVel = 0;
    } else {
        xVel -= (inc * xVel/Math.abs(xVel));
    }}

    if (forward == 0 && zVel != 0) {
    if (Math.abs(zVel) < inc) {
        zVel = 0;
    } else {
        zVel -= (inc * zVel/Math.abs(zVel));
    }}


    if (rotate == 0 && rVel != 0) {
        if (Math.abs(rVel) < Math.PI/12) {
            rVel = 0;
        } else {
            rVel -= (Math.PI/12 * rVel/Math.abs(rVel));
        }
    }
    
    if (vrotate == 0 && vrVel != 0) {
        if (Math.abs(vrVel) < Math.PI/12) {
            vrVel = 0;
        } else {
            vrVel -= (Math.PI/12 * vrVel/Math.abs(vrVel));
        }
    }
    
}

function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;

    if (keyID == 188 || keyID == 87) {
        forward = -1;
    } else if (keyID == 79 || keyID == 83) {
        forward = 1;
    } else if (keyID == 68 || keyID == 69) {
	left = -1;    
    } else if (keyID ==65) {
	left = 1;    
    } else if (keyID == 37 ) {
        rotate = 1;
    } else if (keyID == 39 ) {
        rotate = -1;
//    } else if (keyID == 38) {
//        vrotate = 1;
//    } else if (keyID == 40) {
//        vrotate = -1;
    } else if (keyID == 38) {
        up = -1;
    } else if (keyID == 40) {
	up = 1;    
    }

}

function keyUpHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == 188 || keyID == 87) {
        forward = 0;
    } else if (keyID == 79 || keyID == 83) {
        forward = 0;
    } else if (keyID == 68 || keyID == 69) {
	left = 0;    
    } else if (keyID ==65) {
	left = 0;    
    } else if (keyID == 37 || keyID == 39 ) {
        rotate = 0;
//    } else if (keyID == 38 || keyID == 40) {
//        vrotate = 0;
    } else if (keyID == 38) {
        up = 0;
    } else if (keyID == 40) {
        up = 0;
    }


}

var t;
function displayLoop() {
  /*  slow_down();
    
    c.moveForward(forward_speed);
    c.moveRight(right_speed);
    c.rotateY(rotate_speed);
   */
    move(); 
    v.clear();
    c.render();


    t = setTimeout(displayLoop, 1);
}

/*
function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
 
    console.debug(keyID);
    
    switch(keyID) {
    
    case KEY_UP:
    case KEY_W:
    case KEY_COMMA:
    move_forwards();
    break;

    case KEY_DOWN:
    case KEY_S:
    case KEY_O:
    move_backwards();
    break;

    case KEY_A:
    move_left();
    break;

    case KEY_E:
    case KEY_D:
    move_right();
    break;

    case KEY_LEFT:
    rotate_left();
    break;
    case KEY_RIGHT:
    rotate_right();
    }
}
*/
