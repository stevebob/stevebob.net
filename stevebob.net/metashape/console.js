//defines how the console will behave

document.onkeydown = input;
var PROMPT = "";

var consoleHistory = [];

var eCount = 0;
var current = 0;

function formatConsole() {

    var pr = document.getElementById("prompt");

    pr.innerHTML = PROMPT;

    var promptWidth = pr.clientWidth;
    document.getElementById("consoleinput").style.left = (promptWidth) + "px";
    setFocus();
}

function input(e) {
    const ENTER_CODE = 13;
    const UP_ARROW = 38;
    const DOWN_ARROW = 40;

    var keyID = (window.event) ? event.keyCode : e.keyCode;
    if (keyID == ENTER_CODE) {
        wrapper();
    } else if (keyID == UP_ARROW) {
        if (current == eCount) {
            consoleHistory[current] = document.getElementById("consoleinput").value;
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
    document.getElementById("consoleinput").value = consoleHistory[n];
}

function setFocus() {
    document.getElementById("consoleinput").focus();
}

function wrapper() {
    var entry = readFromConsole();
    //writeToConsole(PROMPT + entry);
    
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
    return document.getElementById("consoleinput").value;
}

function writeToConsole(string) {
    document.getElementById("consoleoutput").innerHTML = string;
    document.getElementById("consoleinput").value = "";
    setFocus();
}
