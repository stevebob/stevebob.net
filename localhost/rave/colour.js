
var mousePosX, mousePosY;

var initX, initY;

var diffX, diffY;

var moveMeInitX, moveMeInitY;

var locked = 0;

var slideTimer;


function getMousePosition() {

   mousePosX = window.event.screenX;
   mousePosY = window.event.screenY;

    moveMe();

    pseudoSnap();
   
}

function startLogging() {

    
    

    initX = mousePosX;
    initY = mousePosY;
    var strX, strY;
    
    strX = document.getElementById("moveMe").style.left;
    strY = document.getElementById("moveMe").style.top;

    moveMeInitX = parseInt(strX.substr(0, strX.length-2));
    moveMeInitY = parseInt(strY.substr(0, strY.length-2));


}

function getDiffs() {

    diffX = mousePosX - initX;
    diffY = mousePosY - initY;

}

function lock() {

    startLogging();
    
    locked = 1;
    document.getElementById("moveMe").style.backgroundColor = "red";
}

function unLock(type) {
    locked = 0;
    document.getElementById("moveMe").style.backgroundColor = "blue";

    if (type==0) {
        clearTimeout(slideTimer);
        slideTo(0, 0);
    } else {
        snapTo(0, 0);
        
    }
    startLogging();
    getDiffs();
    
    
}

function moveMe() {

    if (locked) {

        
        getDiffs();

        var destX = parseInt(moveMeInitX + diffX);
        var destY = parseInt(moveMeInitY + diffY);

        var strW = document.getElementById("moveMe").style.width;
        var strH = document.getElementById("moveMe").style.height;

        var destRt = destX + parseInt(strW.substr(0, strW.length-2));
        var destBt = destY + parseInt(strH.substr(0, strH.length-2));

        var boundsWStr = document.getElementById("csCtrl").style.width;
        //var boundsHStr = document.getElementById("csCtrl").style.;

        //alert(boundsHStr);
        
        
        if (destX > 0) {
            document.getElementById("moveMe").style.left = destX + "px";
        } else {
            document.getElementById("moveMe").style.left = "0px";
        }
        if (destY > 0) {
            document.getElementById("moveMe").style.top = destY + "px";
        } else {
            document.getElementById("moveMe").style.top = "0px";
        }   
    }

}


function snapTo(a, b) {

    document.getElementById("moveMe").style.left = a + "px";
    document.getElementById("moveMe").style.top = b + "px";
}

function slideTo(a, b) {

    startLogging();

    var startX = moveMeInitX;
    var startY = moveMeInitY;

    var distance = Math.sqrt((startX - a)*(startX - a) + (startY - b)*(startY - b));

    var angle = Math.atan((startY - b)/(startX - a));

    slidePart(0, angle, distance, 10);

}

function slidePart(n, theta, distance, total) {

    var moveDist = (total-n)*(distance/total);
    
    var moveLeft = moveDist * Math.cos(theta);
    var moveTop = moveDist * Math.sin(theta);

    //alert(moveLeft+ ", " + moveTop);
        
    document.getElementById("moveMe").style.left = moveLeft + "px";
    document.getElementById("moveMe").style.top = moveTop + "px";

    if (n < total) {
        slideTimer = setTimeout(slidePart, 10, n+1, theta, distance, total);

        //slidePart(n+1, theta, distance, total);
    }
    
}

function pseudoSnap() {

    var snapArea = document.getElementById("snapArea");
    var moveObj = document.getElementById("moveMe");

    var objHeight = parseInt((moveObj.style.height).substr(0, (moveObj.style.height).length-2));
    
    var saTop = parseInt((snapArea.style.top).substr(0, (snapArea.style.top).length-2));
    var saLeft = parseInt((snapArea.style.left).substr(0, (snapArea.style.left).length-2));
    
    var saRight = saLeft + parseInt((snapArea.style.width).substr(0, (snapArea.style.width).length-2));

    getDiffs();

    if (diffY > saTop - (objHeight/2) && locked) {
        makeNewSlider(snapArea, saLeft, diffX);
    }
}



function makeNewSlider(snapArea, saLeft, glLeft) {

    var locLeft = glLeft - saLeft;
    
    snapArea.innerHTML += "<div style=\"position:absolute;top:0px;left:"+locLeft+"px;width:40px;height:40px;background-color:black;\"></div>";

    unLock(1);
    //snapTo(0, 0);
    
}


