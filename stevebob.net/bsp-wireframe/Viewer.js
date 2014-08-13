
/* a Viewer displays the output of a camera */
function Viewer() {


    var canvas = document.getElementById("screen");
    var ctx;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
    }


    var winW;
    var winH;

    this.updateDimensions = function() {
        if (parseInt(navigator.appVersion)>3) {
            if (navigator.appName=="Netscape") {
                winH = window.innerHeight;
                winW = window.innerWidth;
            }
            if (navigator.appName.indexOf("Microsoft")!=-1) {
                winH = document.body.offsetHeight;
                winW = document.body.offsetWidth;
            }
        }
        canvas.height = winH;
        canvas.width = winW;

        height = 40 * winH / winW;
    }

    var width = 40;
    var height = 32;

    this.updateDimensions();


    var mid_x = width/2;
    var mid_y = height/2;
    
    function convertCartToCanvas(p2d) {
        var scale_x = winW / width;
        var scale_y = winH / height;

        return new Point2D(
            (mid_x + p2d.x) * scale_x,
            winH - ((mid_y + p2d.y) * scale_y)
        );
    }

    function ctxLineToPt(p2dorig) {
        var p2d = convertCartToCanvas(p2dorig);
        ctx.lineTo(p2d.x, p2d.y);
    }
    
    function ctxMoveToPt(p2dorig) {
        var p2d = convertCartToCanvas(p2dorig);
        ctx.moveTo(p2d.x, p2d.y);
    }

    function ctxFillRectPt(p2d0orig, p2d1orig) {
        var p2d0 = convertCartToCanvas(p2d0orig);
        var p2d1 = convertCartToCanvas(p2d1orig);
        
        var width = p2d1.x - p2d0.x;
        var height = p2d1.y - p2d0.y;

        ctx.fillRect(p2d0.x, p2d0.y, width, height);
    }

    this.clear = function() {
        var old = ctx.fillStyle;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, winW, winH);
        ctx.fillStyle = old;
    }

    this.dot = function(p2d) {
        var size = 0.2;
        
        var x0 = p2d.x - size/2;
        var x1 = p2d.x + size/2;
        var y0 = p2d.y - size/2;
        var y1 = p2d.y + size/2;
        
        
        ctxFillRectPt(new Point2D(x0, y0), new Point2D(x1, y1));
    }

    this.polygon = function(points) {


        ctx.fillStyle = "rgba(150, 200, 150, 0)";
        //ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 4;

        ctx.beginPath();
        ctxMoveToPt(points[0]);
        for (var i = 1;i<points.length;i++) {
            ctxLineToPt(points[i]);
        }
        ctxLineToPt(points[0]);
        ctx.stroke();
        ctx.fill();
    }

}

function viewerTest() {
    var v = new Viewer();
    v.dot(new Point2D(0, 0));
}
