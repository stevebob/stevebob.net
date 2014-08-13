var winH, winW;
var ctx;
var canvas;

var maxCurrent = 100;

var reProb = 1;

var maxLength = 20;
var minLength = 5;
var maxSize = 50;
var minSize = 20;

var t;

var stream = [];


function Stream() {
    this.active;
    this.length;
    this.current;
    this.str;
    this.startX;
    this.startY;
    this.size;
    this.complete;
}


function getSize() {
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

function canvasInit() {
    
    drawArea = document.getElementById("matrix");
    
    resizeCanvas();
    
    if (drawArea.getContext) {
        ctx = drawArea.getContext("2d");
    }

    ctx.fillStyle="black";
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();
    startFeed();
}

function resizeCanvas() {
    getSize();

    drawArea.width = winW;
    drawArea.height = winH-4;
}

function startFeed() {

    var i;

    for (i=0;i<maxCurrent;i++) {
        stream[i] = new Stream();
        newStream(i);
    }

    drawChar(0, 0, 0);


}

function newStream(n) {

    var i;

    if (Math.floor(Math.random()*reProb) == 0) {
        stream[n].active = 1;
        stream[n].length = Math.floor(Math.random()*(maxLength-minLength))+minLength;
        stream[n].str = "";
        for (i=0;i<stream[n].length;i++) {
            stream[n].str = stream[n].str + String.fromCharCode(Math.floor(Math.random()*128));
        }

        stream[n].startX = Math.floor(Math.random()*winW);
        stream[n].startY = Math.floor(Math.random()*(winH+winH/2))-winH/2;
        stream[n].size =   Math.floor(Math.random()*(maxSize-minSize))+minSize;
        stream[n].current = 0;
        //alert(stream[n].startX);
    } else {
        stream[n].active = 0;
    }
}



function drawChar(x, y, n) {

    var i, j, k;

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, winW, winH);
    ctx.fill();

    for (i=0;i<maxCurrent;i++) {
        stream[i].complete = 0;
    }

    for (j=0;j<=maxLength;j++) {    
                
        for (i=0;i<maxCurrent;i++) {
            if (stream[i].active == 1 && j<stream[i].current && stream[i].complete == 0) {    
                
                ctx.font = stream[i].size+"pt monospace";
                

                ctx.fillStyle = "rgba(0, 255, 0, "+2*j/stream[i].length+")";
                ctx.fillText(stream[i].str.substr(j, 1) , stream[i].startX, stream[i].startY + j * stream[i].size);
                ctx.fill();

                


            } else if (stream[i].current < stream[i].length && stream[i].complete == 0 && stream[i].active) {
                
        //alert(i);
                stream[i].complete = 1;
                stream[i].current++;
            
                ctx.font = stream[i].size+"pt Courier";
                
                ctx.fillStyle = "rgb(150, 255, 150)";
                //alert(stream[i].startX + ", " + stream[i].startY);
                ctx.fillText(stream[i].str.substr(j, 1), stream[i].startX, stream[i].startY + j * stream[i].size);
                ctx.fill();
            } else if (stream[i].current == stream[i].length) {
                stream[i].active = 0;
            }

        }

    

    }
    
    for (i=0;i<maxCurrent;i++) {
        if (stream[i].active) {
            if (Math.floor(Math.random()*4) == 0) {
                for (j=0;j<stream[i].length;j++) {
                    stream[i].str = stream[i].str.substr(0, j-1) + String.fromCharCode(Math.floor(Math.random()*128)) + stream[i].str.substr(j+1, stream[i].length);
                }
            }
        } else {
            newStream(i);
        }
    
    }

    

    t=setTimeout(drawChar, 1, x, y+30, n+1);
        
}
