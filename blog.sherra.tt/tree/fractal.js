

var drawArea;
var ctx;

var recurAngle = Math.PI/6;

var wind = Math.PI/200000;

var bend = 0;

var colour = "rgb(0, 0, 0)";

var winH, winW;

var depth = 10;

var drawTime;

var nextTimer;

var firstCall = 0;

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



function setUpCanvas() {
    
    updateDimensions(); 
    
    drawArea = document.getElementById("fractArea");
   
    drawArea.width = winW;
    drawArea.height = winH;
    
    if (drawArea.getContext) {
   
        ctx = drawArea.getContext("2d");
    
        
    }
    
    


}

function cartPair() {

    this.x;
    this.y;
    

}

function drawLine(len, angle, startPt, baseAngle) {
    
    var endPt = new cartPair();
    
    endPt.x = startPt.x + len*Math.cos(angle + baseAngle);
    endPt.y = startPt.y + len*Math.sin(angle + baseAngle);
    
    var plusX = winW/2;
    var plusY = winH-60;
    
    ctx.beginPath();
    
    
    
    ctx.moveTo(startPt.x + plusX, plusY - startPt.y);
    ctx.lineTo(endPt.x + plusX, plusY - endPt.y);
    
    ctx.stroke();
    
    return endPt;

}


function test() {

    var a = new cartPair();
    a.x = 0;
    a.y = 0;
    
    var b = new cartPair();
    b = drawLine(4, Math.PI/6, a, Math.PI/2);
    
    
    
    alert(b.x + ", " + b.y);

}

function fractTest() {
    firstCall = 0;
    var a = new cartPair();
    
    length = (Math.floor(Math.random() * 5) + 8)/10;
    a.x = 0;
    a.y = 0;

    ctx.clearRect (0, 0, drawArea.width, drawArea.height); 
    
//    ctx.font = "40pt Arial";
 //   ctx.strokeStyle="green";
 //   ctx.fillStyle="rgb(40, 180, 50)";
 //   ctx.textAlign="center";
 //   ctx.textBaseline="top";
    
    
 //   ctx.fillText("Fractal Tree", winW/2, winH - 60);
 //   ctx.strokeText("Fractal Tree", winW/2, winH -60);
    fractal(depth, 200*length, Math.PI/2 - recurAngle, a, recurAngle);
    
    //bend += wind;
        
    //t=setTimeout("fractTest()", 1);
    
}


function getColour(n) {
    var colour;
    
    var redStart, redEnd;
    var greenStart, greenEnd;
    var blueStart, blueEnd;
    
    
        redStart = 100;
        redEnd = 20;
        
        greenStart = 40;
        greenEnd = 160;
        
        blueStart = 0;
        blueEnd = 0;
        

    colour = "rgb("+((redEnd-redStart)*((depth-n)/depth) + redStart)+", "+((greenEnd-greenStart)*((depth-n)/depth) + greenStart)+", "+((blueEnd-blueStart)*((depth-n)/depth) + blueStart)+")";
    
    return colour;

}



function fractal(n, len, angle, startPt, recAngle) {
    
    var a = new cartPair();
    var choice;
    var spread = Math.floor(Math.random() * 4) + 1;
    var length;
    var ang;
    
    var i;

    if (n > 0) {
    
    		ctx.strokeStyle = getColour(n);
    		ctx.lineWidth = n+1;
        

        a = drawLine(len, recAngle, startPt, angle);

      for (i=0;i<spread;i++) {

        choice = Math.floor(Math.random() * 4);

        length = (Math.floor(Math.random() * 5) + 5)/10;

        
        ang = ((Math.floor(Math.random() * 33) - 16)/16) * 3;
        
        drawTime = setTimeout(fractal, 50, n-1, len*length, angle - ang* recAngle, a, recAngle);

      }

    } else if (firstCall == 0) {
        firstCall = 1;
        clearTimeout(drawTime);
        nextTimer=setTimeout("fractTest();", 2000);
    }

}


