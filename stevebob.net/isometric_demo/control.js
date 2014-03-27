const KEY_LEFT=37;
const KEY_RIGHT=39;
const KEY_UP=38;
const KEY_DOWN=40;

const KEY_W=87;
const KEY_A=65;
const KEY_S=83;
const KEY_D=68;
const KEY_COMMA=188;
const KEY_O=79;
const KEY_E=69;

function Control(character, acc, max_speed, left, right, up, down){
    this.keys_down = [];
    for (var i = 0;i!=200;++i) {
        this.keys_down[i] = false;
    }

    this.directions = [];
    this.directions[KEY_LEFT] = left;
    this.directions[KEY_RIGHT] = right;
    this.directions[KEY_UP] = up;
    this.directions[KEY_DOWN] = down;
    
    this.directions[KEY_W] = up;
    this.directions[KEY_A] = left;
    this.directions[KEY_S] = down;
    this.directions[KEY_D] = right;
    this.directions[KEY_COMMA] = up;
    this.directions[KEY_O] = down;
    this.directions[KEY_E] = right;

    this.movement = new Movement();
    this.character = character;
    this.acc = acc;
    this.max_speed = max_speed;
}

Control.prototype.key_down = function(code) {
    console.debug(code);
    this.keys_down[code] = true;
}
Control.prototype.key_up = function(code) {
    this.keys_down[code] = false;
}

Control.prototype.bind_keys = function() {
    var control = this;
    document.onkeydown = function(e) {
        control.key_down(e.keyCode);
    }
    document.onkeyup = function(e) {
        control.key_up(e.keyCode);
    }
}

Control.prototype.velocity_change = function(speed) {
    var ret = $V([0, 0]);
    for (var i in this.directions) {
        if (this.keys_down[i]) {
            ret = ret.add(this.directions[i]);
        }
    }
    return ret.toUnitVector().multiply(speed);
}

Control.prototype.tick = function() {
    this.movement.change(this.velocity_change(this.acc), this.max_speed);
    this.movement.decay(0.7, 0.1);
    this.character.position = this.character.position.to2d().add(this.movement.velocity.to2d());
}
