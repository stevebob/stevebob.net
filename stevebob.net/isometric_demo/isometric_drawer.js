/*
 * x_proj and y_proj are vectors
 */
function IsometricDrawer(name, x_proj, y_proj, origin) {
    this.canvas = $("#"+name)[0];
    this.ctx = this.canvas.getContext("2d");
    this.x_proj = x_proj;
    this.y_proj = y_proj;
    this.origin = origin;

    var x_len = x_proj.modulus();
    var y_len = y_proj.modulus();
    this.horizontal_unit = Math.sqrt(x_len*x_len+y_len*y_len);

    this.ctx.moveToV = function(v) {
        return this.moveTo(v.elements[0], v.elements[1]);
    }
    this.ctx.lineToV = function(v) {
        return this.lineTo(v.elements[0], v.elements[1]);
    }

    var drawer = this;
    LineSegment.prototype.draw = function() {
        drawer.ctx.beginPath();
        drawer.ctx.moveToV(drawer.convert(this.elements[0]));
        drawer.ctx.lineToV(drawer.convert(this.elements[1]));
        drawer.ctx.stroke();
    }
    Wall.prototype.draw = function() {
        var c_elements = [];
        for (var i in this.elements) {
            c_elements[i] = drawer.convert(this.elements[i]).subtract($V([0, this.base]));
        }

        drawer.ctx.fillStyle = "white";
        drawer.ctx.strokeStyle = "black";
        drawer.ctx.lineWidth = 2;
        drawer.ctx.beginPath();
        drawer.ctx.moveToV(c_elements[0]);
        drawer.ctx.lineToV(c_elements[1]);
        drawer.ctx.lineToV(c_elements[1].subtract($V([0, this.height])));
        drawer.ctx.lineToV(c_elements[0].subtract($V([0, this.height])));
        drawer.ctx.lineToV(c_elements[0]);
        drawer.ctx.stroke();
        drawer.ctx.fill();

    }

    Region.prototype.draw = function() {
        if (this.visible) {
            var c_elements = [];
            for (var i in this.elements) {
                c_elements[i] = drawer.convert(this.elements[i]);
            }

            drawer.ctx.strokeStyle = "black";
            drawer.ctx.lineWidth = 2;
            drawer.ctx.fillStyle = "white";
            drawer.ctx.beginPath();
            drawer.ctx.moveToV(c_elements[c_elements.length-1].subtract($V([0, this.height])));
            for (var i in c_elements) {
                drawer.ctx.lineToV(c_elements[i].subtract($V([0, this.height])));
            }
            drawer.ctx.fill();
            drawer.ctx.stroke();
        }
        for (var i in this.sprite_segments) {
            this.sprite_segments[i].draw();
        }
    }

    Character.prototype.draw = function() {
        var base = this.base();
        var c_elements = [drawer.convert(base.elements[0]),
                          drawer.convert(base.elements[1])];
        /*
        drawer.ctx.strokeStyle = "red";
        drawer.ctx.lineWidth = 2;
        drawer.ctx.beginPath();
        drawer.ctx.moveToV(c_elements[0]);
        drawer.ctx.lineToV(c_elements[1]);
        drawer.ctx.stroke();
        */
    }

    SpriteSegment.prototype.draw = function() {
        var c_position = drawer.convert(this.position);
        var top_left = c_position.subtract($V([this.image.width/2 - this.start * this.image.width, this.image.height]));
        if (this.end == 1) {
            this.width -= 0.001;
        }
        drawer.ctx.drawImage(
            // image to draw
            this.image,
            // offset into the original image to start drawing
            this.image.width * this.start, 0,
            // amount of original image to draw
            this.width, this.image.height,
            // offset on the canvas to start drawing
            top_left.elements[0], top_left.elements[1],
            // actual size of drawn image on canvas
            this.width, this.image.height
        );
        
        /*
        drawer.ctx.strokeStyle = "blue";
        drawer.ctx.beginPath();
        drawer.ctx.strokeRect(top_left.elements[0], top_left.elements[1], this.width, this.image.height);
        drawer.ctx.stroke();
        */
    }
}

/*
 * takes a vector and returns its position in isometric space
 */
IsometricDrawer.prototype.convert = function(v) {
    return this.origin.add(this.x_proj.multiply(v.elements[0]).add(this.y_proj.multiply(v.elements[1])));
}
IsometricDrawer.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}
