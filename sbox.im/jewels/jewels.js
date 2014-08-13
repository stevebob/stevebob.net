

//canvas stuff

var drawArea;
var ctx;

//timer
var timer;
var gravTime;

//Environment Settings

var colVariety =3;

var xBoxCount = 20;
var yBoxCount = 20;

var borderWidth = 8;

var winH, winW;

var boxWidth;
var boxHeight;
var clumpSize = 4;
var tick = 20;

var grid = new Array(xBoxCount);
var marked = new Array(xBoxCount);
var xCur, yCur;
var colCur;

var colour = new Array(colVariety + 1);
var removeComplete;
var matchFlag;

colour[0] = "rgb(0, 0, 0)";
colour[1] = "rgb(150, 0, 0)";
colour[2] = "rgb(0, 150, 0)";
colour[3] = "rgb(0, 0, 150)";
colour[4] = "rgb(150, 150, 0)";
colour[5] = "rgb(150, 0, 150)";
colour[6] = "rgb(0, 150, 150)";


function initialiseGrid() {
    var i, j;

    for (i=0;i<xBoxCount;i++) {
        marked[i] = new Array(yBoxCount);
        
    }

    for (i=0;i<xBoxCount;i++) {
        grid[i] = new Array(yBoxCount);
        for (j=0;j<yBoxCount;j++) {
            if (i==xBoxCount) {
                grid[i][j] = -1;
            } else {
                grid[i][j] = 0;
            }
        }
    }
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
    

    boxWidth = ((winW-(xBoxCount+1)*borderWidth) / xBoxCount);
    boxHeight = ((winH-(yBoxCount+1)*borderWidth) / yBoxCount);
    
}



function setUpCanvas() {
    
    updateDimensions(); 
    initialiseGrid();

    drawArea = document.getElementById("jewelcase");
   
    drawArea.width = winW;
    drawArea.height = winH-4;
    
    if (drawArea.getContext) {
   
        ctx = drawArea.getContext("2d");
    
        
    }
    
    
    generate();

}


function drawJewels() {


    var i, j;

    ctx.fillStyle="rgb(20, 20, 20)";
    ctx.fillRect(0, 0, winW, winH);

    ctx.fill();



    for (i=0;i<yBoxCount;i++) {
        for (j=0;j<xBoxCount;j++) {
            
            if (i==yCur && j==xCur) {
                ctx.fillStyle = colour[colCur];
            } else {
                ctx.fillStyle = colour[grid[j][i]];
            }

            ctx.fillRect(j*boxWidth + j*borderWidth + borderWidth,
                         i*boxHeight+ i*borderWidth + borderWidth, 
                         boxWidth, boxHeight);
        }
    }

    ctx.fill();
}



function generate() {

    var xStart = Math.floor(Math.random() * xBoxCount);
    var newCol = Math.floor(Math.random() * colVariety) + 1;


    xCur = xStart;
    colCur = newCol;
    fall(0);
}


function fall(height) {
    yCur = height;

    drawJewels();


    if (height < yBoxCount && grid[xCur][height + 1] == 0) {

        timer = setTimeout(fall, tick, height+1);
    } else {
        grid[xCur][height] = colCur;

        removeComplete = 0;

        while (removeComplete == 0) {
        
            matchFlag = 0;
            prepareToRemove();
        
            if (matchFlag == 0) {
                removeComplete = 1;
            }
        }


//prepareToRemove();
        if (gameOver()) {
            
            initialiseGrid();
            generate();
        } else {
            timer = setTimeout(generate, tick);
        }
    }
    

}



function floodMark(x, y, count) {
 

    
    marked[x][y] = 2;


if (x<xBoxCount-1) {
    if (grid[x+1][y] == grid[x][y] && marked[x+1][y] == 0) {
        count = floodMark(x+1, y, count + 1);
    } 
}
if (y<yBoxCount-1) {
    if (grid[x][y+1] == grid[x][y] && marked[x][y+1] == 0) {
        count = floodMark(x, y+1, count + 1);
    }
}
if (x>0) {
    if (grid[x-1][y] == grid[x][y] && marked[x-1][y] == 0) {
        count = floodMark(x-1, y, count + 1);
    }
}
if (y>0) {
    if (grid[x][y-1] == grid[x][y] && marked[x][y-1] == 0) {
        count = floodMark(x, y-1, count + 1);
    }
}
    
    return count;
}

function floodRemove(x, y) {
    
    matchFlag = 1;
    marked[x][y] = 1;
    grid[x][y] = 0;
    
    gravity(x, y);

if (x<xBoxCount-1) {
    if (marked[x+1][y] == 2) {
        floodRemove(x+1, y);
    }
}
if (y<yBoxCount-1) {
    if (marked[x][y+1] == 2) {
        floodRemove(x, y+1);
    }
}
if (x>0) {
    if (marked[x-1][y] == 2) {
        floodRemove(x-1, y);
    }
}
if (y>0) {
    if (marked[x][y-1] == 2) {
        floodRemove(x, y-1);
    }
}
}

function floodFix(x, y) {

    marked[x][y] = 1;

    if (x<xBoxCount-1) {
        if (marked[x+1][y] == 2) {
            floodFix(x+1, y);
        }
    }
    if (y<yBoxCount-1) {
        if (marked[x][y+1] == 2) {
            floodFix(x, y+1);
        }
    }
    if (x>0) {
        if (marked[x-1][y] == 2) {
            floodFix(x-1, y);
        }
    }
    if (y>0) {
        if (marked[x][y-1] == 2) {
            floodFix(x, y-1);
        }
    }
}

function prepareToRemove() {
    var i, j;

    var consCount;

    for (i=0;i<yBoxCount;i++) {
        for (j=0;j<xBoxCount;j++) {
            if (grid[j][i] != 0) {
                marked[j][i] = 0;
            } else {
                marked[j][i] = 1;
            }
        }
    }

    for (i=0;i<yBoxCount;i++) {
        for (j=0;j<xBoxCount;j++) {
            if (marked[j][i] == 0) {
                consCount = floodMark(j, i, 1);
                if (consCount >= clumpSize) {
                    floodRemove(j, i);
                } else {
                    floodFix(j, i);
                }
            }

        }
    }


}

function gravity(x, y) {
    var i;

    for (i=y;i>0;i--) {
        marked[x][i] = 1;
        grid[x][i] = grid[x][i-1];
    }
}

    




function gameOver() {
    var i;
    var over = 0;
    for (i=0;i<xBoxCount;i++) {
        if (grid[i][0] != 0) {
            over = 1;
        }
    }
    return over;
}


function shPanel() {

    var panel = document.getElementById("panel");

    if (panel.style.display == "") {
        panel.style.display = "none";
    } else {
        panel.style.display = "";
    }
}

function handleResize() {
    
    updateDimensions();
    drawArea.width=winW;
    drawArea.height=winH;
}


function getValues() {
    //clearTimeout(timer);

    var newX, newY, newCl, newFa;

    newX = document.getElementById("width").value;
    newY = document.getElementById("height").value;
    newCl=document.getElementById("clump").value;
    newFa=document.getElementById("fall").value;

    if (newX > 0 && newY > 0 && newCl > 0 && newFa >= 0) {
        xBoxCount = newX;
        yBoxCount = newY;
        clumpSize = newCl;
        tick = newFa;
    }

    handleResize();


    grid = new Array(xBoxCount);
    marked=new Array(xBoxCount);

    initialiseGrid();
    //generate();
}
