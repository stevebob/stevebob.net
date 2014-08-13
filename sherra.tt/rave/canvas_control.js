
var winH, winW;

function updateDimensions() {

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
}

function resizeElements() {
    
    updateDimensions();   

    document.getElementById("rave").height = winH;
    document.getElementById("rave").width = winW;

}
