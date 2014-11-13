function TreeDemo() {

    const width = 300;
    const height = 110;

    const centrePoint = new Point2D(width/2, height/2);

    function Point2D(x, y) {
        const width = 8;
        this.x = x;
        this.y = y;

        this.draw = function() {
            ctx.fillRect(this.x - width/2, this.y - width/2, width, width);
            ctx.fill();
        }

        this.add = function(p) {
            return new Point2D(this.x + p.x, this.y + p.y);
        }
        this.subtract = function(p) {
            return new Point2D(this.x - p.x, this.y - p.y);
        }
    }

    Point2D.createRadial = function(length, angle) {
        return new Point2D(length * Math.cos(angle), length * Math.sin(angle));
    }

    function Cluster() {
        this.points = [];
        this.addPoint = function(p) {
            this.points.push(p);
        }

        this.draw = function() {
            for (var i = 0;i!=this.points.length;++i) {
                this.points[i].draw();
            }
        }
    }

    Cluster.createRandomized = function(centre, n, variance) {
        var xMax = centre.x + variance / 2;
        var xMin = centre.x - variance / 2;
        var yMax = centre.y + variance / 2;
        var yMin = centre.y - variance / 2;
        
        var ret = new Cluster();

        for (var i = 0;i!=n;++i) {
        
            var x = xMin + variance * Math.random();
            var y = yMin + variance * Math.random();
            
            ret.addPoint(new Point2D(x, y));
        }
    
        return ret;   

    }

    Cluster.createRandomizedHorizontal = function(centre, n, variance) {
        
        var xMax = centre.x + variance / 2;
        var xMin = centre.x - variance / 2;
        
        var ret = new Cluster();

        for (var i = 0;i!=n;++i) {
        
            var x = xMin + variance * Math.random();

            var dy = variance * Math.random() - variance / 2 + centre.y;
            
            ret.addPoint(new Point2D(x, dy));
        }
    
        return ret;
    }


    var canvas = document.getElementById("screen");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    
    function Circle(centre, radius, alpha, intensity) {
        this.centre = centre;
        this.radius = radius;
        this.alpha = alpha;
        this.intensity = intensity;
    }

    var leafBuffer = [];
    var leafRead = 0;
    var leafWrite = 0;

    function bufferLeaf(centre, radius, alpha, intensity) {
        leafBuffer[leafWrite] = new Circle(centre, radius, alpha, intensity);
        leafWrite++;
    }

    function drawLeaf() {
        if (leafRead == leafWrite) {
            return;
        }

        var leaf = leafBuffer[leafRead];
        leafRead++;

        circle(leaf.centre, leaf.radius, leaf.alpha, leaf.intensity);
        
        setTimeout(drawLeaf, 100);
    }

    function circle(centre, radius, alpha, intensity) {
        const parts = 10;
        const angleMod = Math.PI*2 / parts;

        var oldStrokeStyle = ctx.strokeStyle;
        var oldLineWidth = ctx.lineWidth;

        ctx.fillStyle = "rgba(40, " + parseInt(120 + intensity * 40) + ", 20, " + alpha + ")";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(centre.x + radius, centre.y);
        for (var i = 1;i!=parts;++i) {
            var angle = angleMod * i;
            ctx.lineTo(centre.x + radius * Math.cos(angle), centre.y + radius * Math.sin(angle));
        }
        ctx.lineTo(centre.x + radius, centre.y);
        ctx.fill();

        ctx.strokeStyle = oldStrokeStyle;
        ctx.lineWidth = oldLineWidth;
    }

    function drawer(line, segment, position) {
        const moveDistance = 10;
        const moveVariance = 5;
        const angleVariance = Math.PI/3;
        const closeEnough = 20;
        
        
        var destIdx = segment + 1;

        var dest = line[destIdx];
       
        var dx = position.x - dest.x;
        var dy = position.y - dest.y;
        var distToDest = Math.sqrt(dx*dx + dy*dy);
        if (distToDest < closeEnough) {
            destIdx++;
            segment++;
            dest = line[destIdx];
        }
        
        if (destIdx == line.length) {
            bufferLeaf(position, 5 + Math.random() * 10, 0.4 + Math.random() * 0.3, 0.4 * Math.random());
            drawLeaf();
            return;
        }       
       
       
        
        var toDest = dest.subtract(position);

        var angle = Math.atan2(toDest.y, toDest.x);

        var newAngle = angle + angleVariance * Math.random() - angleVariance/2;
        var newMove = moveDistance + moveVariance * Math.random() - moveVariance;

        var relativePoint = new Point2D(newMove * Math.cos(newAngle), newMove * Math.sin(newAngle));
        var absolutePoint = relativePoint.add(position);
        
        var greenness = parseInt(50 * (segment / line.length));

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(120, " + (80 + greenness) + ", 50, 0.4)";

        ctx.beginPath();
        ctx.moveTo(position.x, position.y);
        ctx.lineTo(absolutePoint.x, absolutePoint.y);
        ctx.stroke();
        
        if (segment > 4) {
            if (Math.random() < 0.25) {
                bufferLeaf(position, 5 + Math.random() * 10, 0.1 + Math.random() * 0.5, 0.2);
            }
        }

        setTimeout(drawer, 50, line, segment, absolutePoint);
        

    }

    
    const splitFactor = 200;

    this.start_tree = function() {

        var baseCluster = Cluster.createRandomizedHorizontal(new Point2D(centrePoint.x, height - 10), splitFactor, 20);
        var f = new Fractal(new Point2D(centrePoint.x, height - 30), -Math.PI/2, 20, 6);

        var paths = [];
        for (var i = 0;i!=splitFactor;++i) {
            paths[i] = f.passThrough(baseCluster, i);
        }
        
        
        //baseCluster.draw();
        //f.draw();


        for (var i = 0;i!=paths.length;++i) {
            drawer(paths[i], 0, paths[i][0]);
        }

    }

    const modLength = 0.9;
    const modAngle = Math.PI/6;
    function Fractal(point, angle, length, depth) {

        this.point = point;
        this.cluster = Cluster.createRandomized(this.point, splitFactor, (depth + 1) * 1);
        
        this.next = [];
        if (depth > 0) {
            var newLength = modLength * length;
            var newAngle0 = angle + modAngle;
            var newAngle1 = angle - modAngle;
            
            this.next[0] = new Fractal(Point2D.createRadial(newLength, newAngle0).add(this.point), newAngle0, newLength, depth - 1);
            this.next[1] = new Fractal(Point2D.createRadial(newLength, newAngle1).add(this.point), newAngle1, newLength, depth - 1);
        }

        
        this.draw = function() {
            this.cluster.draw();
            
            for (var i = 0;i!=this.next.length;++i) {
                this.next[i].draw();
            }
        }
        
        this.passThrough = function(start, index) {
            if (depth == 0) {
                return [this.cluster.points[index]];
            }
            var idx = Math.floor(this.next.length * Math.random());
            var nextInPath = this.next[idx];
            var proceedingPoints = nextInPath.passThrough(this.cluster, index);
            var pointsFromHere = [start.points[index]];
            return pointsFromHere.concat(proceedingPoints);
        }
    }

    
    
    function pointsBetween(p0, p1) {
        const partFreq = 20;
        const maxChange = 8;
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        var dist = Math.sqrt(dx*dx + dy*dy);

        var partCount = Math.floor(dist / partFreq);
        
        var parts = [];
        for (var i = 0;i!=partCount;++i) {
            var progressX = i * dx / partCount;
            var progressY = i * dy / partCount;
            var cur_dx = Math.random() * maxChange - maxChange;
            var cur_dy = Math.random() * maxChange - maxChange;
            parts[i] = new Point2D(p0.x + progressX + cur_dx, p0.y + progressY + cur_dy);
        }
        return parts;

    }

}

