function Screen(canvas) {
    var ctx = canvas.getContext("2d");


    this.drawTopDown = function(map) {
        
        ctx.beginPath();

        for (var i = 0;i!=map.polygons.length;i++) {
            var polygon = map.polygons[i];
            var start = polygon.points[0];
            ctx.moveTo(start.x, start.y);
            for (var j = 1;j!=polygon.points.length;++j) {
                var point = polygon.points[j];
                ctx.lineTo(point.x, point.y);
            }
            ctx.lineTo(start.x, start.y);
        }

        ctx.stroke();

    }



    var isoOrigin = new Point2D(0, 480);
    var isoAngle = Math.PI/6;
    var isoXUnit = new Point2D(Math.cos(isoAngle), -Math.sin(isoAngle));
    var isoYUnit = new Point2D(Math.cos(isoAngle), Math.sin(isoAngle));
   
    this.isoConvert = function(p) {
        return isoOrigin.add(
                    isoXUnit.scalarMultiply( p.x )
                ).add(
                    isoYUnit.scalarMultiply( p.y ));
    }

    var a = true;
    
    this.drawIsometric = function(world) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
 
        var map = world.map;

        for (var i = 0;i!=map.polygons.length;++i) {
            ctx.beginPath();
            
            var polygon = map.polygons[i];
            var start = this.isoConvert(polygon.points[0]);
            var startHeight = polygon.heights[0];
            ctx.moveTo(start.x, start.y - startHeight);
            for (var j = 1;j!=polygon.points.length;++j) {
                var point = this.isoConvert(polygon.points[j]);
                var height = polygon.heights[j];
                ctx.lineTo(point.x, point.y - height);
            }
            ctx.lineTo(start.x, start.y - startHeight);
            
            ctx.stroke();
            ctx.fillStyle="white";
            ctx.fill();
        }

        /* draw the walls */
        const WALL = 0;
        const CHARACTER = 1;
        var bspTree = map.wallBSPTree.clone();
        bspTree.insertVerticalFace({
            type: CHARACTER, value: null, p0: avatar.p0(), p1: avatar.p1()
        });
       
        var wallsInOrder = bspTree.drawOrder();
        
        /*
        if (!debug_bool) {
            console.debug(bspTree);
            console.debug(wallsInOrder);
        }
        */

        
        this.drawFace = function(face) {
            if (face.type == WALL) {

                ctx.beginPath();
                var wall = face.value;
                
                /*
                var wallToAvatar = world.avatar.loc.subtract(wall.points[0]);
                var dotP = wallToAvatar.dotProduct(wall.normal);
                if (dotP > 0) {
                    ctx.fillStyle = "rgb(200, 200, 255)";
                } else {
                    ctx.fillStyle = "rgb(255, 200, 200)";
                }
                */

                var p0 = this.isoConvert(wall.points[0]);
                var p1 = this.isoConvert(wall.points[1]);
                ctx.moveTo(p0.x, p0.y - wall.bottomHeights[0]);
                ctx.lineTo(p0.x, p0.y - wall.topHeights[0]);
                ctx.lineTo(p1.x, p1.y - wall.topHeights[1]);
                ctx.lineTo(p1.x, p1.y - wall.bottomHeights[1]);
                ctx.lineTo(p0.x, p0.y - wall.bottomHeights[0]);
                
                
                ctx.stroke();
                ctx.fill();
     
            } else if (face.type == CHARACTER) {
                this.drawAvatar(avatar);
            }
        }
        
        for (var i = 0;i!=wallsInOrder.length;++i) {
            this.drawFace(wallsInOrder[i]);
        }

    }

    this.drawAvatar = function(avatar) {

        /* now we draw the avatar */
        const CIRCLE_RES = 16;
        const INCR_ANGLE = (Math.PI*2)/CIRCLE_RES;
        var polygon = avatar.currentPolygon;
        var loc = avatar.loc;
        var height = polygon.zfn(loc.x, loc.y);
        var rad = avatar.radius;
        ctx.beginPath();
        var start = loc.add(new Point2D(rad, 0));
        var startIso = this.isoConvert(start);
        var startHeight = polygon.zfn(start.x, start.y);
        ctx.moveTo(startIso.x, startIso.y - startHeight);
        for (var i = 1;i!=CIRCLE_RES;++i) {
            var pt = loc.add(new Point2D(rad*Math.cos(i*INCR_ANGLE), rad*Math.sin(i*INCR_ANGLE)));
            var ptIso = this.isoConvert(pt);
            var ptHeight = polygon.zfn(pt.x, pt.y);
            ctx.lineTo(ptIso.x, ptIso.y - ptHeight);
        }
        ctx.lineTo(startIso.x, startIso.y - startHeight);
        
        var p0 = avatar.p0();       
        var p1 = avatar.p1();       

        var p0iso = this.isoConvert(p0);
        var p1iso = this.isoConvert(p1);

        var offset = polygon.zfn(loc.x, loc.y) - rad;
        var height = 100;

        ctx.moveTo(p0iso.x, p0iso.y - offset); 
        ctx.lineTo(p1iso.x, p1iso.y - offset);
        ctx.lineTo(p1iso.x, p1iso.y - offset - height);
        ctx.lineTo(p0iso.x, p0iso.y - offset - height);
        ctx.lineTo(p0iso.x, p0iso.y - offset); 


        ctx.stroke();
        ctx.fill();
    }
}
