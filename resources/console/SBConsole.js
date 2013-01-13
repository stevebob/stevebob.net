/**
 * Implements Console
 *
 * This is an implementation of Console with an input element as its
 * input and any html element as its output. The positions and sizes
 * of the input and output are fixed. The up and down keys scoll
 * back and forwards through command history.
 *
 * IMPORTANT:
 * The output element should have its overflow CSS property set to 
 * overflow or hidden.
 *
 * args
 * input: the input element from which input will be read
 * output: the element that will hold output
 * interpreter: the object that will interpret commands
 */
function SBConsole(input, output, interpreter) {

    //this will precede any commands repeated to the output
    const promptStr = "> ";
    
    //flag to repeat commands in output
    var echo = true;
    
    //history of all commands run
    var commandHistory = [];

    //the current place in command history
    var currentCommand;

    //flag to see if processing should occur
    var enabled = true;
    
    /*
     * for public functions, see documentation in Console.js of the
     * functions they implement.
     */

    this.read = function() {
        return input.value;
    }

    this.write = function(text) {
        this.append("<br />" + text);
        //scoll to the bottom of the element
        output.scrollTop = output.scrollHeight;

    }
    
    this.clearInput = function() {
        input.value = "";
    }
    
    this.clearOutput = function() {
        this.write("<div style='height:"+output.offsetHeight+"px;'></div>");
    }
    
    this.process = function() {
        if (enabled) {
            var entry = this.read();

            if (entry != "") {
                addToHistory(entry);
            }

            this.write(promptStr + entry);
            var returnVal = interpreter.evaluate(entry);
            this.clearInput();


            if (returnVal != null) {
                this.write(returnVal);
            }
        }
    }

    this.enable = function() {
        enabled = true;
    }

    this.disable = function() {
        enabled = false;
    }

    this.append = function(text) {
        output.innerHTML += (text);
    }

    this.echoOn = function() {
        echo = true;
    }

    this.echoOff = function() {
        echo = false;
    }

    this.displayNext = function() {
        displayHistory(currentCommand+1);
    }

    this.displayPrev = function() {
        displayHistory(currentCommand-1);
    }
    
    /**
     * Puts the nth command in the input field and updates the value
     * of currentCommand.
     *
     * args
     * n: the index of the command to display
     */
    function displayHistory(n) {
        if (n >= 0 && n < commandHistory.length) {
            if (currentCommand == commandHistory.length && 
                commandHistory[currentCommand-2] != "") {

                addToHistory(input.value);
            }
            
            currentCommand = n;
            input.value = commandHistory[n];
        }
    }

    /**
     * Appends the list of commands with a new command
     *
     * arg
     * command: the command to append to history
     */
    function addToHistory(command) {
        commandHistory[commandHistory.length] = command;
        currentCommand = commandHistory.length;
    }

    var waiting = false;

    this.wait = function() {
        this.disable();
        waiting = true;
        this.write("");
        dots(this, 0);
    }

    this.resume = function () {
        waiting = false;
        this.enable();
    }
    
    var t;
    function dots(c, n) {
        

        if (waiting) {
            if (n == 40) {
                c.write("");
                n = -1;
            } else {
                c.append(".");
            }
            
            output.scrollTop = output.scrollHeight;
            
            t = setTimeout(dots, 50, c, n+1);
        } else {
            clearTimeout(t);
        }
    }

}
