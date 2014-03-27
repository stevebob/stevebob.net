function Drawer(name) {
    this.canvas = $("#"+name)[0];
    this.ctx = this.canvas.getContext("2d");

    this.ctx.moveToV = function(v) {
        return this.moveTo(v.elements[0], v.elements[1]);
    }
    this.ctx.lineToV = function(v) {
        return this.lineTo(v.elements[0], v.elements[1]);
    }

    var ctx = this.ctx;
    LineSegment.prototype.draw = function() {
        ctx.beginPath();
        ctx.moveToV(this.elements[0]);
        ctx.lineToV(this.elements[1]);
        ctx.stroke();
    }

    Vector.prototype.draw = function() {
        const WIDTH = 10;
        ctx.beginPath();
        ctx.fillRect(this.elements[0] - WIDTH/2,
                     this.elements[1] - WIDTH/2,
                     WIDTH, WIDTH);
    }
}
