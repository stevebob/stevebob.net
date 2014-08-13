//defines how the console will behave

//document.onkeypress = input;
document.onkeydown = input;
var PROMPT = "#> ";

var consoleHistory = [];

var eCount = 0;
var current = 0;

function input(e) {
    const ENTER_CODE = 13;
    const UP_ARROW = 38;
    const DOWN_ARROW = 40;

    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == ENTER_CODE) {
        wrapper();
    } else if (keyID == UP_ARROW) {
        if (current == eCount) {
            consoleHistory[current] = document.getElementById("in").value;
        }
        
        if (current > 0) {
            current--;
            browseHistory(current);
        }
    } else if (keyID == DOWN_ARROW) {
        if (current < eCount) {
            current++;
            browseHistory(current);
        }
    }
}

function browseHistory(n) {
    document.getElementById("in").value = consoleHistory[n];
}

function setFocus() {
    document.getElementById("in").focus();
}

function wrapper() {
    var entry = readFromConsole();
    writeToConsole(PROMPT + entry);
    
    if (entry != "") {
        consoleHistory[eCount] = entry;
        eCount++;
        current = eCount;
    }
    
    var output = evaluate(entry) + "";
    if (output != "") {
        writeToConsole(output);
    }
}

function readFromConsole() {
    return document.getElementById("in").value;
}

function writeToConsole(string) {
    var border = document.getElementById("border");
    document.getElementById("term").innerHTML +=  string + "<br/>";
    document.getElementById("in").value = "";
    border.scrollTop = border.scrollHeight;
    setFocus();
}

function setHelpVis(val) {
    
    var help = document.getElementById('help');

    if (val) {
        help.style.display = "";
    } else {
        help.style.display = "none";
    }
}
