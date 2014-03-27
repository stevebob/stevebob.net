function Movement(){
    this.velocity = $V([0, 0]);
}

Movement.prototype.apply = function(character) {
    character.position = character.position.add(this.velocity);
}

Movement.prototype.decay = function(rate, threshold) {
    this.velocity = this.velocity.multiply(rate);
    if (this.velocity.modulus() < threshold) {
        this.velocity = $V([0, 0]);
    }
}

Movement.prototype.change = function(diff, cap) {
    var new_vel = this.velocity.add(diff);
    if (new_vel.modulus() > cap) {
        new_vel = new_vel.toUnitVector().multiply(cap);
    }
    this.velocity = new_vel;
}
