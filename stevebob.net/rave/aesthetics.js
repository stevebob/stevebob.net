
var faceTimer;

//protection from rounding errors causing loops not to terminate
var roundSafe = 0.01;

//number of moves per second - higher number for better quality
var faceTick = 10;

//percentage of window height of main panel
var mainHeight = 75;

//number of seconds for a peep
var faceTime = 100;

var selectedTab = 0;

//  Tabs:
//  0:  Functions
//  1:  Fills
//  2:  Colour Schemes
//  3:  Environment

var mainUp = 0;

var firstTime = 1;

function peepMain() {

    var panel = document.getElementById("mainPanel");
    
    var multi = mainHeight / sumSteps();
    
    var currentHeight;
    
    if  (firstTime) {
        currentHeight = 0;
        firstTime = 0;
    } else {
        currentHeight = parseFloat(panel.style.height.substr(0, panel.style.height.length-1));
    }

    
    
    clearTimeout(faceTimer);
    

    if (mainUp) {
    
        document.getElementById("mainPanelContents").style.display = "none";
        peepMainDown(panel, 0, currentHeight, multi);
        
        mainUp = 0;
    } else {
        
        peepMainUp(panel, 0, currentHeight, multi);
        
        //document.getElementById("mainPanelContents").style.display = "";
        mainUp = 1;
    }
    

}



function peepMainUp(panel, n, panelHeight, multi) {

    
    
    panelHeight += ((0 - (n * n) + (faceTick * n))*multi + roundSafe);
    
    panel.style.height = panelHeight + "%";
    //drawArea.style.height = (100 - panelHeight) + "%";
   
    
    if (panelHeight < mainHeight) {
        //alert(panelHeight);
        faceTimer = setTimeout(peepMainUp, faceTime/faceTick, panel, n+1, panelHeight, multi);
    } else {
        clearTimeout(faceTimer);
        document.getElementById("mainPanelContents").style.display = "";
        
         
        
        beginFunctions();
        
    }

}


function peepMainDown(panel, n, panelHeight, multi) {

    //alert(3);
    
    panelHeight -= ((0 - (n * n) + (faceTick * n))*multi + roundSafe);
    
    panel.style.height = panelHeight + "%";
    //drawArea.style.height = (100 - panelHeight) + "%";
    
    
    if (panelHeight > 0) {
        //alert(panelHeight);
        faceTimer = setTimeout(peepMainDown, faceTime/faceTick, panel, n+1, panelHeight, multi);
    } else {
        clearTimeout(faceTimer);
        panel.style.height = 0 + "%";
    }

}


function sumSteps() {

    var m;
    var sum = 0;
    
    for (m=0;m<faceTick;m++) {
    
        sum += (0 - (m * m) + (faceTick * m));
    
    }
    
    return sum;

}


function btnOver(element) {

    document.getElementById(element).style.backgroundColor = "darkgrey";
    
}

function btnOut(element) {

    document.getElementById(element).style.backgroundColor = "grey";
    
}


function tabClick(tab) {

    var m;

 
    
        
    selectedTab = tab;
        
    
    //deal with the aesthetics
    for (m=0;m<4;m++) {
    
        if (m != selectedTab) {
            
            document.getElementById("tab" + m).style.backgroundColor = "gray";
            
        } else {
            document.getElementById("tab" + tab).style.backgroundColor = "black";
        }
    }

    //display the relavent controls

    document.getElementById("function_tab").style.display = "none";
    document.getElementById("fill_tab").style.display = "none";
    document.getElementById("colour_tab").style.display = "none";
    document.getElementById("environment_tab").style.display = "none";

    if (tab==0) {
        document.getElementById("function_tab").style.display = "";
    } else if (tab==1) {
        document.getElementById("fill_tab").style.display = "";
    } else if (tab==2) {
        document.getElementById("colour_tab").style.display = "";
    } else if (tab==3) {
        document.getElementById("environment_tab").style.display = "";
    }
}

function tabHeadOver(tab) {

    if (tab != selectedTab) {
    
        document.getElementById("tab" + tab).style.backgroundColor = "darkgrey";
    
    }

}


function tabHeadOut(tab) {

    if (tab != selectedTab) {
    
        document.getElementById("tab" + tab).style.backgroundColor = "gray";
    
    }

}







