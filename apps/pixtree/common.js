//common canvas functions

var winW, winH;

var ctx, drawArea

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }
    winW = drawArea.width;
    winH = drawArea.height;
}

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
    
    drawArea.height = winH;
    drawArea.width = winW;


}

