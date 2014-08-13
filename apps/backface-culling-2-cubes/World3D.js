


function World3D() {


    this.objects = [];
    this.addObject = function(o) {
        this.objects.push(o);
        o.setWorld(this);
    }

}
