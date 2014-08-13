var ctx;
var winH, winW;  //dimensions of window (or canvas element)
var drawArea;

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


function adjustSize() {
    updateDimensions();

    drawArea.height = winH;
    drawArea.width = winW;
}

function setUpCanvas() {
    drawArea = document.getElementById("screen");
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }


    adjustSize();
}
