


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
                console.debug(this.objects[i].polygons[j].toString());
            }
        }
        


        var bspTree = new BSPTree();
    
        for (var i = 0;i<polygons.length;i++) {
            console.debug("adding: " + polygons[i].toString());
            bspTree.addPolygon(polygons[i]);
        }
        
        console.debug(bspTree.toString());
        this.bspTree = bspTree;
    }

}
