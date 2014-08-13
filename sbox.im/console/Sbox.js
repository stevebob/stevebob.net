
Sbox.TOKEN = [];

//Different types of token
Sbox.LITERAL = 0;
Sbox.VARIABLE = 1;
Sbox.UNASSIGNED = 2



//Syntax
Sbox.LOOP = 30;
Sbox.DO = 31;
Sbox.ASSIGN = 32;
Sbox.FNASSIGN = 33;
Sbox.IF = 34;
Sbox.LIST = 35;

Sbox.TOKEN["loop"] = Sbox.LOOP;
Sbox.TOKEN["do"] = Sbox.DO;
Sbox.TOKEN["if"] = Sbox.IF;
Sbox.TOKEN["assign"] = Sbox.ASSIGN;
Sbox.TOKEN["fnassign"] = Sbox.FNASSIGN;
Sbox.TOKEN["list"] = Sbox.LIST;


/**
 * Implements Interpreter
 *
 * This is the class definition for a sboxscript interpreter.
 */
function Sbox() {

    //the console in which the interpreter is operating
    var console;

    //maps for user defined variables and functions
    var variables = [];
    var functions = [];

    //maps for built in functions
    var builtin = [];

    /*
     * a flag which is set when a syntax error is detected
     * It lets the program know that an error message has already
     * been displayed and need not display another
     */
    var errorCaught;
    
    /*
     * Now we will populate the array of built in functions.
     * An array of function pointers is used here rather than
     * hardcoded functions so the language can easily be extended
     * to include more built-ins. For example, if a site needs
     * a hits() function, it would be implemented somewhere else
     * and added to the interpreter with the addFunction() function.
     */

    /**
     * Mathematical Operations
     */
    builtin["add"] = function(args) {
        return args[0] + args[1];
    }
    builtin["gt"] = function(args) {
        return args[0] > args[1];
    }
    builtin["multiply"] = function(args) {
        return args[0] * args[1];
    }
    builtin["lt"] = function(args) {
        return args[0] < args[1];
    }
    builtin["ge"] = function(args) {
        return args[0] >= args[1];
    }
    builtin["le"] = function(args) {
        return args[0] <= args[1];
    }
    builtin["or"] = function(args) {
        return args[0] || args[1];
    }
    builtin["and"] = function(args) {
        return args[0] && args[1];
    }
    builtin["minus"] = function(args) {
        return args[0] - args[1];
    }
    builtin["divide"] = function(args) {
        return args[0] / args[1];
    }
    builtin["not"] = function(args) {
        return !args[0];
    }
    builtin["id"] = function(args) {
        return args[0];
    }

    /**
     * List Operations
     */
    builtin["append"] = function(args) {
        var newList = [];
        for (var i in args[0]) {
            newList[i] = args[0][i];
        }
        newList[newList.length] = args[1];
        return newList;
    }

    /**
     * Assignment Statements
     */
    builtin[Sbox.ASSIGN] = function(args) {
        variables[args[0]] = args[1];
        return null;
    }
    builtin[Sbox.FNASSIGN] = function(args) {
        functions[args[0].value] = args[1];
        return null;
    }

    /**
     * Console Operations
     */
    builtin["print"] = function(args) {
        console.append(args[0]);
        return null;
    }
    builtin["println"] = function(args) {
        console.write(args[0]);
        return null;
    }

    /**
     * Network Operations
     */
    builtin["url"] = function(args) {
        document.location = args[0];
        return null;
    }

    /**
     * The interpreter uses a token tree to evaluate expressions.
     * A node represents a single vertex in this token tree.
     *
     * args
     * token: the type of node. may be literal, variable, unasigned
     *        or a string containing the name of a function
     * value: the actual value of the node. the literal value, 
     *        variable name or unasigned order
     */
    function Node(token, value) {
        this.token = token;
        this.value = value;

        //an array of next nodes
        this.next = [];
        
        //evaluate the current node
        this.evaluate = function() {
            
            /*
             * do
             */

            if (this.token == Sbox.DO) {
                
                var result = null;

                for (var i = 0;i<this.next.length;i++) {
                    result = this.next[i].evaluate();
                }

                return result;
            
            /*
             * list
             */
            
            } else if (this.token == Sbox.LIST) {

                var list = [];

                for (var i in this.next) {
                    list[i] = this.next[i].evaluate();
                }

                return list;


            /*
             * function assignment
             */
            
            } else if (this.token == Sbox.FNASSIGN) {
                
                return operation(Sbox.FNASSIGN, this.next);


            /*
             * loop
             */

            } else if (this.token == Sbox.LOOP) {
                
                var variant = true;

                while (variant) {
                    variant = this.next[0].evaluate();
                    if (variant) {
                        this.next[1].evaluate();
                    }
                }

                return null;


            /*
             * if statement
             *
             * This can't be evaluated normally because of recursion.
             * Recursive functions need a separation of their base
             * case and recursive case, and only one case can be
             * expanded at each step, because otherwise when it
             * comes time to evaluate the base case, the recursive
             * case will still be expanded.
             */

            } else if (this.token == Sbox.IF) {

                var condition = this.next[0].evaluate();

                if (condition) {

                    return this.next[1].evaluate();
                } else {
                    return this.next[2].evaluate();
                }
            
            
            /*
             * all other expressions
             */

            } else {
                
                /*
                 * if there are no arguements, it is either a 
                 * no arg function, a literal value, a variale
                 * or an unassigned value.
                 */

                if (this.next.length == 0) {

                    /*
                     * unassigend
                     *
                     * If the token is unassigned, there weren't 
                     * enough arguements supplied to the function.
                     * This is a syntax error.
                     */

                    if (this.token == Sbox.UNASSIGNED) {
                        
                        console.write("Insufficient arguments"+
                        " supplied to " + this.token);

                        errorCaught = true;
                        return null;
                    
                    /*
                     * literal value
                     */
                    
                    } else if (this.token == Sbox.LITERAL) {
                        return this.value;
                    
                    /*
                     * variable reference
                     */
                    
                    } else if (this.token == Sbox.VARIABLE) {
                        
                        //variable is defined

                        if (variables[this.value] != undefined) {
                            return variables[this.value];
                        
                        //no such variable
                        } else {
                            console.write(this.value + " is undefined.");
                            errorCaught = true;
                            return null;
                        }
                    
                    /*
                     * no args function (user defined or built in)
                     */

                    } else if (functions[this.token] != undefined || 
                               builtin[this.token] != undefined) {
                        
                        return operation(this.token);
                
                    /*
                     * since variables have a token type, they can 
                     * be checked internally.
                     * functions however, cannot.
                     * we only get down to here if an undefined
                     * function is called.
                     */
                    } else {
                        console.write("No such function " + this.token);
                        errorCaught = true;
                        return null;

                    }

                } else {
                    
                    /*
                     * function calls with at least one argument
                     */
                    
                    /*
                     * this will hold the evaluation of each of the
                     * function's arguments.
                     */
                    var results = [];
                    
                    //for each argument
                    for (var i = 0;i<this.next.length;i++) {

                        //evaluate the argument
                        results[i] = this.next[i].evaluate();

                        /*
                         * null returns can only be used if they
                         * aren't passed as arguments to other
                         * functions.
                         */
                        if (results[i] == null) {
                            if (!errorCaught) {
                                
                                console.write("Expected expression "+
                                    "- null received");
                                
                                errorCaught = true;
                            }
                            return null;
                        }
                    }
                    
                    /*
                     * finally, perform the necessary operation on the
                     * arguments.
                     */
                    return operation(this.token, results);
                
                }
            }
        }

        //add an argument to a node
        this.addArg = function(arg) {
            this.next[this.next.length] = arg;
        }


    }

    /**
     * This takes the necessary operation given by a function.
     * 
     * args
     * token: the function to evaluate
     * args: an array of arguements to the function
     */
    function operation(token, args) {
        
        /*
         * built in functions
         */
        if (builtin[token] != undefined) {

            return builtin[token](args);

        /*
         * User Defined Functions
         */
        } else {

            if (functions[token] != undefined) {
                
                /*
                 * This is a "prototype" of the function to create.
                 * We will create copies based on the prototype,
                 * as there may be many chained functions of the
                 * same type.
                 */
                var proto = functions[token];
                
                //we will use this array as a stack in dfs
                var toVisit = [];
                
                /*
                 * create a copy of the prototype for the initial
                 * node in the dfs
                 */ 
                toVisit[0] = new Node(proto.token, proto.value);
                toVisit[0].argIndex = proto.argIndex;
                
                /*
                 * keep a reference of the first node, as the start
                 * of the stack won't always contain the top node
                 */
                var fn = toVisit[0];

                /*
                 * This is another stack which will be used 
                 * simultaneously with toVisit. This is dfsing
                 * the prototype, as the copy is created.
                 */
                var protoStack = [];
                protoStack[0] = proto;
    
                // the current depth of the search
                var j = 1;

                // DFS time
                while (j > 0) {
                    j--;

                    var token = toVisit[j].token;

                    /*
                     * replace unassigned placeholders with
                     * the function's arguments
                     */
                    if (token == Sbox.UNASSIGNED) {
                        var ind = toVisit[j].value;
                        if (args[ind] != undefined) {
                            toVisit[j].token = Sbox.LITERAL;
                            toVisit[j].value = args[ind];
                        }
                    }
                    
                    /*
                     * create the new nodes to add to the token
                     * tree
                     */
                    var current = protoStack[j];
                    var currentNew = toVisit[j];
                    for (var i = current.next.length - 1; i >= 0;i--) {
                        
                        protoStack[j]=current.next[i];
                        toVisit[j] = new Node(protoStack[j].token, protoStack[j].value);
                        currentNew.next[i] = toVisit[j];

                        j++;
                    }
                
                }
                
                //finally, evaluate the sub tree we just created
                return fn.evaluate();

            } else {

                /*
                 * no such function
                 */
                errorCaught = true;
                console.write(token + " is undefined.");
                return null;
            }

        }
    }
    
    /*
     * connects the interpreter to a console so it can perform
     * operations on it
     */
    this.connectConsole = function(c) {
        console = c;
    }

    /*
     * evaluate input
     */
    this.evaluate = function(input) {
        errorCaught = false;
        if (input == "") {
            return null;
        }
        
        var stripped = new StringStorage(stripWhiteSpace(input));
        
        
        var sugared = new StringStorage(sugar(stripped.value));

        var head = tokenise(sugared);

        
        if (head == null) {
            return null;
        }

        return head.evaluate();

    }

    /*
     * add a function to the interpreter
     */
    this.addFunction = function(name, newFunction) {
        
        builtin[name] = newFunction;

    }
    
    /*
     * remove white space from input
     */
    function stripWhiteSpace(str) {
        if (str == "") {
            return "";
        }

        var i = 0;
        var last = 0;
        while (str[i] != " " && i < str.length) {
            i++;
        }
        last = i;
        while (str[i] == " " && i < str.length) {
            i++;
        }
        
        return str.substring(0, last) + stripWhiteSpace(str.substring(i, str.length));
    }

    /*
     * a simple wrapper for a string so a reference to the same
     * string may be passed around
     */
    function StringStorage(string) {
        this.value = string;
    }

    /*
     * This is the tokeniser part of the interpreter.
     * It takes a string, and creates a tree of tokens based 
     * upon it, which can then be evaluated.
     */
    function tokenise(str) {
        
        var buffer = "";

        var i = 0;

        if (str.value[i] == ")") {

            //last argument has been tokenised

            str.value = str.value.substring(1, str.value.length);
            return null;
        } else if (str.value[i] == ":") {
            i++;
            buffer = "";
            while (isNumber(str.value[i])) {
                buffer += str.value[i];
                i++;
            }
            
            if (str.value[i] == ",") {
                i++;
            }

            str.value = str.value.substring(i, str.value.length);
            return new Node(Sbox.UNASSIGNED, parseInt(buffer));
            

        } else if (isNumber(str.value[i]) || str.value[i] == "-") {
            buffer = "";
            var dotCount = 0;
            var startIndex = i;

            while (isNumber(str.value[i]) || 
                   (str.value[i] == "." && dotCount == 0) ||
                   (str.value[i] == "-" && i == startIndex)) {

                buffer+=str.value[i];
                i++;
            }
            
            if (str.value[i] == ",") {
                i++;
            }
            
            str.value = str.value.substring(i, str.value.length);
            return new Node(Sbox.LITERAL, parseFloat(buffer));

        } else if (str.value[i] == '"') {
            buffer = "";

            i++;

            while(str.value[i] != '"') {
                
                buffer+=str.value[i];
                i++;
            
            }

            i++;
            
            if (str.value[i] == ",") {
                i++;
            }

            str.value = str.value.substring(i, str.value.length);
            return new Node(Sbox.LITERAL, buffer);

        } else if (i<str.value.length && isLetter(str.value[i])) {
            
            buffer = "";

            while (i < str.value.length && isLetter(str.value[i])) {
                buffer+=str.value[i];
                i++;
            }


            if (i==str.value.length || isTerm(str.value[i])) {
                //it must be a variable
                
                if (str.value[i] == ",") {
                    i++;
                }
                
        

                str.value = str.value.substring(i, str.value.length);
                return new Node(Sbox.VARIABLE, buffer);

            } else if (str.value[i] == "(") {
                //it must be a function 
                
                
                
                var token;
                if (Sbox.TOKEN[buffer] == undefined) {
                    token = new Node(buffer);
                } else {
                    token = new Node(Sbox.TOKEN[buffer]);
                }
                
                i++;
                str.value = str.value.substring(i, str.value.length);

                var parsedAll = false;
                var argCount = 0;
                while (!parsedAll) {
                    var next = tokenise(str);
                    if (next == null) {
                        parsedAll = true;
                    } else {
                        token.next[argCount] = next;
                        argCount++;
                    }
                }

                if (str.value[0] == ",") {
                    str.value = str.value.substring(1, str.value.length);
                }

                return token;

            } 

        } else {
            console.write("Parse error - unexpected token: " + str.value[0]);
            errorCaught = true;
            return null;

        }

    }

    function isNumber(ch) {
        var parsed = parseInt(ch);
        return 0<=parsed && parsed <= 9;
    }

    function isLetter(ch) {
        return ch.match(/[a-zA-Z]/);
    }

    function isTerm(ch) {
        return ch == ")" || ch == ",";
    }

    /*
     * This is a preprocessor which replaces syntactic sugar for
     * certain built in functions with their functional notation.
     */
    function sugar(text) {
        
      //var varReg = new RegExp(
      


        var tmp = text;
        
        var v;

        while (v = tmp.match(/([a-zA-Z]+)=(.+)/)) {

            var name = v[1];
            var rest = v[2];

            var exp = firstBalanced(rest);

            var reg = new RegExp(name + "=" + exp, "g");
            text = text.replace(reg, "assign(\"" + name + "\"," + exp + ")");

            tmp = rest.substring(exp.length);

        }

        



        var fn = text.match(/^([a-zA-Z]+)\((.*)\)=(.+)/);

        if (fn != null) {
        
            var name = fn[1];
            var args = fn[2];
            var def = fn[3];


            var tmp = args;
            var i = 0;
            while (tmp != "") {
                    
                var j = 0;
                var arg = "";

                while(j < tmp.length && tmp[j] != ",") {
                    arg+=tmp[j];
                    j++;
                }

                tmp = tmp.substring(j+1, tmp.length);
        
                
                var reg = new RegExp(arg + "([,\)])", "g");
                def = def.replace(reg, ":" + i + "$1");

                var reg = new RegExp("^" + arg + "$");
                def = def.replace(reg, ":" + i);
        

                i++;
            }

            text = "fnassign(\"" + name + "\"," + def + ")";
            
        }
        return text;

    }


    /*
     * Returns a string up until the point when its brackets
     * become unbalanced.
     */
    function firstBalanced(str) {
        
        var result = "";
        var i = 0;

        while (i<str.length && str[i] != "(" && str[i] != ")" && str[i] != ",") {
            result += str[i];
            i++;
        }
        
        if (str[i] == "(") {
            var score = 1;

            while (score != 0 && i < str.length) {
                result += str[i];
                
                if (str[i] == "(") {
                    score++;
                } else if (str[i] == ")") {
                    score--;
                }
                
                i++;
            }
        }
        return result;
    }




}
