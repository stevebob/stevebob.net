document.onkeydown = processWrapper;

var sboxConsole;
var interpreter;

//create a new sboxConsole
function initConsole() {
    interpreter = new Interpreter(new Sbox());
    sboxConsole = new Console(new SBConsole(
        document.getElementById("consoleinput"),
        document.getElementById("consoleoutput"),
        interpreter
        ));

    interpreter.connectConsole(sboxConsole);

    interpreter.addFunction("pixelate", function(args) {
        pixSize = args[0];
        return null;
    });
    
    interpreter.addFunction("hits", function(args) {
        sboxConsole.wait();
        $.post("gethits.php", {}, function(data) {
            sboxConsole.resume();
            sboxConsole.write(data);
        });
        return null;
    });

    interpreter.addFunction("url", function(args) {
        sboxConsole.wait();
        document.location = args[0];
        return null;
    });
}

/*
 * Check to see if the key pressed was the ENTER key and if it was
 * process the command.
 */
function processWrapper(e) {

    const ENTER = 13; //the code for the enter key
    const UP = 38;    //the code for the up arrow
    const DOWN = 40;  //the code for the down arrow

    var keyID = (window.event) ? event.keyCode : e.keyCode;

    if (keyID == ENTER) {
        sboxConsole.process();
    }

    if (keyID == UP) {
        sboxConsole.displayPrev();
    }

    if (keyID == DOWN) {
        sboxConsole.displayNext();
    }


    
}

