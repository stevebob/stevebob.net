/**
 * This is the interface for a language interpreter.
 *
 * args
 * i: an implementation of this interface
 */
function Interpreter(i) {
    
    /**
     * Evaluates a command given as a string and returns the value
     * of the command (in the event that the command is an
     * expression).
     *
     * args
     * 1: a string containing a command
     *
     * return
     * the value of the command
     */
    this.evaluate = i.evaluate;

    /**
     * Connects a console to the interpreter so functions can 
     * affect the console (e.g. print text, read text)
     *
     * args
     * 1: the Console object to connect
     */
    this.connectConsole = i.connectConsole;

    /**
     * Adds low level user defined javascript functions to the
     * interpreter. Use this to add implementation specific
     * functions which can't be coded in sboxscript.
     *
     * args
     * 1: name of function to be understood by the interpreter
     * 2: the
     */
    this.addFunction = i.addFunction;
}
