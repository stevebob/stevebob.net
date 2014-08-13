


function World3D() {


    this.objects = [];
    this.addObject = function(o) {
        this.objects.push(o);
        o.setWorld(this);
    }

    this.bspTree = null;

    this.generateBSPTree = function() {

        /* make an array refering to all the polygons */
        var polygons = [];

        var k = 0;
        for (var i = 0;i<this.objects.length;i++) {
            for (var j = 0;j<this.objects[i].polygons.length;j++) {
                polygons.push(this.objects[i].polygons[j]);
            }
        }
        
        /* shuffle the array */
        
        for (var i = 0;i<polygons.length;i++) {
            var j = Math.floor(Math.random() * polygons.length);
            var tmp = polygons[j];
            polygons[j] = polygons[i];
            polygons[i] = tmp;
            console.debug(j);
        }


        var bspTree = new BSPTree();
    
        for (var i = 0;i<polygons.length;i++) {
            bspTree.addPolygon(polygons[i]);
        }
        
        this.bspTree = bspTree;
    }

}
