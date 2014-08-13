document.onkeydown = keyPressHandle;
document.onkeyup = keyReleaseHandle;

var map;
var a;
var world_blog;
var avatar;
var screen;

function main_blog() {
 
    
    screen = new Screen(document.getElementById("screen_blog"));
    
    

    $.get("testc.xml", {}, function(doc) {
        a = doc;
        map = Map.fromDOM(doc);
        world_blog = new World_blog(map);
        avatar = new Character(200, 200);
        avatar.currentPolygon = map.polygons[2];

        world_blog.avatar = avatar;

        render_loop();
        avatar_loop();
    });


}


function render_loop() {
    
    screen.drawIsometric(world_blog);

    setTimeout(render_loop, 10);
}


var avatarMoveUp = false;
var avatarMoveDown = false;
var avatarMoveLeft = false;
var avatarMoveRight = false;

var avatarUpVelocity = 0;
var avatarRightVelocity = 0;
var avatarMaxVelocity = 8;

const avatarDeceleration = 2;
const avatarAcceleration = 4;

function avatar_loop() {
    
    const moveAmount = 5;
    
    var avatarMoveX = 0;
    var avatarMoveY = 0;

    if (avatarMoveUp) {
        avatarUpVelocity = Math.max(avatarUpVelocity - avatarAcceleration, -avatarMaxVelocity);
    } else if (avatarMoveDown) {
        avatarUpVelocity = Math.min(avatarUpVelocity + avatarAcceleration, avatarMaxVelocity);
    }

    if (avatarMoveRight) {
        avatarRightVelocity = Math.min(avatarRightVelocity + avatarAcceleration, avatarMaxVelocity);
    } else if (avatarMoveLeft) {
        avatarRightVelocity = Math.max(avatarRightVelocity - avatarAcceleration, -avatarMaxVelocity);
    }

    avatar.move(avatarUpVelocity, avatarRightVelocity);

    if (avatarUpVelocity > 0) {
        avatarUpVelocity = Math.max(avatarUpVelocity - avatarDeceleration, 0);
    } else if (avatarUpVelocity < 0) {
        avatarUpVelocity = Math.min(avatarUpVelocity + avatarDeceleration, 0);
    }

    if (avatarRightVelocity > 0) {
        avatarRightVelocity = Math.max(avatarRightVelocity - avatarDeceleration, 0);
    } else if (avatarRightVelocity < 0) {
        avatarRightVelocity = Math.min(avatarRightVelocity + avatarDeceleration, 0);
    }

    setTimeout(avatar_loop, 40);
}


function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    
    if (keyID == 38 || keyID == 188 || keyID == 87) {
        avatarMoveDown = true;
    } else if (keyID == 40 || keyID == 79 || keyID == 83) {
        avatarMoveUp = true;
    } else if (keyID == 39 || keyID == 68 || keyID == 69) {
        avatarMoveRight = true;
    } else if (keyID == 37 || keyID ==65) {
        avatarMoveLeft = true;
    }

}

function keyReleaseHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    
    if (keyID == 38 || keyID == 188 || keyID == 87) {
        avatarMoveDown = false;
    } else if (keyID == 40 || keyID == 79 || keyID == 83) {
        avatarMoveUp = false;
    } else if (keyID == 39 || keyID == 68 || keyID == 69) {
        avatarMoveRight = false;
    } else if (keyID == 37 || keyID ==65) {
        avatarMoveLeft = false;
    }

}


