

var drawArea;
var ctx;

var recurAngle = Math.PI/6;

var wind = Math.PI/200000;

var bend = 0;

var colour = "rgb(0, 0, 0)";

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



function setUpCanvas() {
    
    updateDimensions(); 
    
    drawArea = document.getElementById("fractArea");
   
    
    if (drawArea.getContext) {
   
        ctx = drawArea.getContext("2d");
    
        
    }
    
    
    drawArea.width = winW;
    drawArea.height = winH-4;


}

function cartPair() {

    this.x;
    this.y;
    

}

function drawLine(a, angle, startPt, baseAngle, width) {
    len = a*0.75;
    var endPt = new cartPair();
    
    endPt.x = startPt.x + len*Math.cos(angle + baseAngle);
    endPt.y = startPt.y + len*Math.sin(angle + baseAngle);
    
    var plusX = winW/2;
    var plusY = winH/2;
    
    ctx.beginPath();
    
    ctx.lineWidth = Math.pow(2, width);
    
    
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

    var a = new cartPair();
    
    a.x = 0;
    a.y = 0;
    ctx.fillStyle = "black";
    ctx.fillRect (0, 0, drawArea.width, drawArea.height); 
    fractal(6, 150, 0, a, recurAngle + bend);
    
    bend += wind;
    

    
    t=setTimeout("fractTest()", 1);
    
}

function fractal(n, len, angle, startPt, recAngle) {
    
    var a = new cartPair();
    
    if (n > 0) {
    
        //draw
        /*
        if (n == 5) {
            ctx.strokeStyle = "rgb(255, 0, 150)";
           // ctx.lineWidth = 6;
        } else if (n==4) {
            ctx.strokeStyle = "rgb(255, 0, 0)";
           // ctx.lineWidth = 5;
        } else if (n==3) {
            
            ctx.strokeStyle = "rgb(255, 150, 0)";
            //ctx.lineWidth = 4;
        } else if (n==2) {
            
            ctx.strokeStyle = "rgb(255, 255, 0)";
           // ctx.lineWidth = 3;

        } else if (n==1) {
            
            ctx.strokeStyle = "rgb(150, 255, 0)";
           // ctx.lineWidth = 2;
        } else if (n==6) {

            ctx.strokeStyle = "rgb(0, 0, 0)";
           // ctx.lineWidth = 6a;
        }
        */
        
        if (n==1) {
        	ctx.strokeStyle = "rgb(0, 255, 0)";
        	ctx.lineWidth = 2;
    	} else {
    		ctx.strokeStyle = "rgb(150, 100, 0)";
    		ctx.lineWidth = 6;
        }
        

        a = drawLine(len, recAngle, startPt, angle + recAngle*1997, n);
        
        //alert(a.x + ", " + a.y);
        
        fractal(n-1, len*0.75, angle + 599*recAngle, a, recAngle);
        
        fractal(n-1, len*0.75, angle + 1001*recAngle, a, recAngle);
        
        fractal(n-1, len*0.75, angle + 101* recAngle, a, recAngle)
        
        fractal(n-1, len*0.75, angle + 2003* recAngle, a, recAngle);
        

        //draw again

    }

}



