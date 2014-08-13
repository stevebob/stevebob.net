var winH, winW;  //dimensions of window (or canvas element)
var drawArea;

var env = new World(-15, 15, -10, 10);

var mode;

const DRAW_MODE = 0;
const DESC_MODE = 1;
const FRACT_MODE = 2;


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


function popup(link) {

    window.open(link,"help", "width=600,height=600,scrollbars=yes");
    return false;

}


function setUpComponents() {
    
    formatConsole();
    setUpDraw();
    
    beginFractal();

    setUpCanvas();

    adjustSize();
    
    mode = DRAW_MODE;


    var def = "l 8.48528137423857 -2.356194490192345 8.48528137423857 -0.7853981633974483,l 11.180339887498949 2.677945044588987 11.180339887498949 0.4636476090008061,l 8.48528137423857 -2.356194490192345 11.180339887498949 2.677945044588987,l 8.48528137423857 -0.7853981633974483 11.180339887498949 0.4636476090008061,l 10.295630140987 2.6344941491974563 8.845903006477066 2.316215803069055,l 7.615773105863909 1.97568811307998 8.845903006477066 2.316215803069055,l 10.295630140987 0.507098504392337 8.845903006477066 0.8253768505207383,l 7.615773105863909 1.1659045405098132 8.845903006477066 0.8253768505207383,l 7.615773105863909 1.1659045405098132 7.615773105863909 1.97568811307998,r 0.3 -0.6283185307179586 5 -2.513274122871834,r 0.27 0.7853981633974483 2.5 -3.7960911230876664,r 0.3 0.5235987755982988 5 -0.6544984694978735,r 0.28 -0.2617993877991494 5 0.5235987755982988,d 4,s -15 15 -10 10,f 0 0 1 0";
    
    if (document.cookie  == "") {
        parseImportText(def, "cookie");
    } else {
        parseImportText(document.cookie, "cookie");
    }
    
    
    //test();
    drawFractal(env);
    updateData();
}

function resize() {
    adjustSize();
    drawFractal(env);

}


