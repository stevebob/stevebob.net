/**
 * This is the interface for a console.
 *
 * usage
 * var c = new Console(new ConsoleImplementation(args...));
 *
 * args
 * i: instance of implementing class
 */
function Console(i) {

    /**
     * Read any text the user has enterred.
     *
     * return
     * the text enterred into the console
     */
    this.read = i.read;

    /**
     * Place some more text onto the command line.
     *
     * args
     * 1: the text to write to the command line
     */
    this.write = i.write;

    /**
     * Clear the output of the command line.
     */
    this.clearOutput = i.clearOutput;

    /**
     * Clear the input field.
     */
    this.clearInput = i.clearInput;

    /**
     * Read the input, do something useful with it, and possibly
     * print some output to the command line.
     */
    this.process = i.process;

    /**
     * Disables the processing of input
     */
    this.disable = i.disable;

    /**
     * Enables the processing of input
     */
    this.enable = i.enable;

    /**
     * Adds some text to the end of the current line of output
     * 
     * args
     * 1: the text to append
     */
    this.append = i.append;

    /**
     * Sets the console to repeat all commands to the output
     */
    this.echoOn = i.echoOn;

    /**
     * Sets the console to not repeat all commands to the output
     */
    this.echoOff = i.echoOff;

    /**
     * Sets the contents of the input field to the previous command
     */
    this.displayPrev = i.displayPrev;
    
    /**
     * Sets the contents of the input field to the next command
     */
    this.displayNext = i.displayNext;

    /**
     * Some action to perform while waiting
     */
    this.wait = i.wait;

    /**
     * Resumes the console
     */
    this.resume = i.resume;
}
