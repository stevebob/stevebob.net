var mountain_ctx;

var peaks = [];
var mountains = [];

const WIDTH = 400;
const HEIGHT = 100;

const ATTEMPTS = 20;
const PEAK_MAX_SPREAD = 100;
const PEAK_MIN_SPREAD = 50;
const PEAK_COUNT = 5;
const DETAIL_LEVEL = 8;
const DETAIL_VARIANCE = 8;

const SNOW_MIN = 50;
const SNOW_MAX = 120;
const SNOW_DETAIL_LEVEL = 8;



function mountain_reset() {

    mountain_ctx.clearRect(0, 0, WIDTH, HEIGHT);
    peaks = [];
    mountains = [];

    generate_mountains();

    array_shuffle(mountains);


    for (var i in mountains) {
        
        for (var j = 0;j<DETAIL_LEVEL;j++) {
            mountains[i].add_detail();
        }

        mountains[i].set_snow_pts();

        mountains[i].fill();
        mountains[i].draw_lines();
        mountains[i].fill_snow();
    }



}

function mountain_main() {
    init();
    
    mountain_reset();
}


function MountainPoint(x, y) {
    this.x = x;
    this.y = y;

    this.dot = function() {
        dot(this.x, this.y);
    }

}

function MountainLine(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
    

    this.midpoint = function() {
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;

        return new MountainPoint(p0.x + dx/2, p0.y + dy/2);
    }

    this.near_midpoint = function() {
        var midpoint = this.midpoint();

        var scale = this.length() / 100;
        var theta = Math.random() * Math.PI * 2;
        var r = Math.random() * DETAIL_VARIANCE * scale;

        var dx = Math.cos(theta) * r;
        var dy = Math.sin(theta) * r;

        return new MountainPoint(midpoint.x + dx, midpoint.y + dy);
    }

    this.draw = function() {
        mountain_ctx.strokeStyle = "rgb(130, 60, 180)";
        mountain_ctx.fillStyle = "rgb(190, 120, 240)";
        mountain_ctx.lineWidth = 2;

        mountain_ctx.beginPath();

        mountain_ctx.moveTo(p0.x, p0.y);
        mountain_ctx.lineTo(p1.x, p1.y);

        mountain_ctx.stroke();

    }
    
    this.length = function() {
        var dx = this.p0.x - this.p1.x;
        var dy = this.p0.y - this.p1.y;
        return Math.sqrt(dx*dx+dy*dy);
    }
}


function LineList() {
    this.first = null;

    this.push = function(line) {
        if (this.first == null) {
            this.first = new LineLink(line, null);
        } else {
            var current = new LineLink(line, this.first);
            this.first = current;
        }
    }

    this.draw_all = function() {
        
        var tmp = this.first;
        while (tmp != null) {
            tmp.line.draw();
            tmp = tmp.next;
        }

    }

    this.split_all = function() {
        
        var tmp = this.first;
        while (tmp != null) {
            var new_pt = tmp.line.near_midpoint();
            var l0 = new MountainLine(tmp.line.p0, new_pt);
            var l1 = new MountainLine(new_pt, tmp.line.p1);
            var new_link = new LineLink(l1, tmp.next);
            tmp.line = l0;
            tmp.next = new_link;
            tmp = new_link.next;
            
        }

    }

}

function LineLink(line, next) {
    this.line = line;
    this.next = next;
}

function Mountain(peak, left, right) {
    this.peak = peak;
    this.left = left;
    this.right = right;
    
    var snow_height = HEIGHT - (Math.random() * (SNOW_MAX-SNOW_MIN) + SNOW_MIN);
    
    var snow_lines = [];

    var lines = new LineList();
    lines.push(new MountainLine(this.peak, this.right));
    lines.push(new MountainLine(this.left, this.peak));

    this.draw_lines = function() {
        lines.draw_all();
    }
    
    this.fill = function() {
        var tmp = lines.first;
        mountain_ctx.fillStyle = "rgb(190, 120, 240)";
        mountain_ctx.beginPath();
        mountain_ctx.moveTo(tmp.line.p0.x, tmp.line.p0.y);

        while (tmp != null) {
            mountain_ctx.lineTo(parseInt(tmp.line.p1.x), parseInt(tmp.line.p1.y));
            tmp = tmp.next;
        }


        mountain_ctx.fill();
        mountain_ctx.closePath();

    }

    this.add_detail = function() {
        lines.split_all();
    }
    
    this.set_snow_pts = function() {
        var tmp = lines.first;
        var complete = false;
        var started = false;
        var left, right;

        while (tmp != null) {
            if (tmp.line.p0.y <= snow_height && tmp.line.p1.y >= snow_height) {
                left = tmp.line.midpoint();
                var line = new MountainLine(tmp.line.p0, left);
                snow_lines.push(line);

                complete = true;
                break;
            }
            if (tmp.line.p0.y >= snow_height && tmp.line.p1.y <= snow_height) {
                right = tmp.line.midpoint();
                var line = new MountainLine(right, tmp.line.p1);
                
                snow_lines.push(line);

                started = true;
                tmp = tmp.next;
                continue;
            }
            
            if (started) {
                snow_lines.push(tmp.line);
            }

            tmp = tmp.next;
        }
        
        if (complete) {
            var bottom = new LineList();
            bottom.push(new MountainLine(left, right));

            for (var i = 0;i<SNOW_DETAIL_LEVEL;i++) {
                bottom.split_all();
            }
            
            tmp = bottom.first;
            while (tmp != null) {
                snow_lines.push(tmp.line);
                tmp = tmp.next;
            }
        }

    }

    this.fill_snow = function() {
        if (snow_lines.length == 0) {
            return;
        }
        
        mountain_ctx.fillStyle = "rgb(255, 255, 255)";
        mountain_ctx.beginPath();
        mountain_ctx.moveTo(snow_lines[0].p0.x, snow_lines[0].p0.y);
       
        for (var i in snow_lines) {
            mountain_ctx.lineTo(snow_lines[i].p1.x, snow_lines[i].p1.y);
        } 
        
        mountain_ctx.strokeStyle = "rgb(200, 200, 200)";
        mountain_ctx.lineWidth = 2;
        mountain_ctx.fill();
        mountain_ctx.stroke();
        mountain_ctx.closePath();


    }

    this.get_snow_lines = function() {
        return snow_lines;
    }
}


function get_mountain(peak) {
    
    var c = peak.y - peak.x;
    var x = HEIGHT - c;

    var left = new MountainPoint(x, HEIGHT);
    var right = new MountainPoint(x - 2*(x-peak.x), HEIGHT);
    return new Mountain(peak, left, right);   

}

function distance(p0, p1) {
    var dx = p0.x-p1.x;
    var dy = p0.y-p1.y;
    return Math.sqrt(dx*dx + dy*dy);
}

function init() {
    var tmp = document.getElementById("mountain");
    if (tmp.getContext) {
        mountain_ctx = tmp.getContext("2d");
    }

}

function dot(x,y) {
    mountain_ctx.fillRect(x-5, y-5, 10, 10);
    mountain_ctx.fill();
}

function generate_mountains() {
    generate_peaks();
    for (var i in peaks) {
        mountains.push(get_mountain(peaks[i]));
    }


}

function generate_peaks() {

    var x = HEIGHT;
    while (x < WIDTH) {

        x += Math.random() * (PEAK_MAX_SPREAD - PEAK_MIN_SPREAD) + PEAK_MIN_SPREAD;
        y = Math.random() * HEIGHT / 2;
        peaks.push(new MountainPoint(x, y));

    }

}

function array_shuffle(array) {
    
    for (var i in array) {
        var x = parseInt(Math.random() * array.length);
        var tmp = array[i];
        array[i] = array[x];
        array[x] = tmp;
    }

}
