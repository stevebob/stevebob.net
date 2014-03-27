//the lexical analyser

const NULLVAR = -10;
const RESERVEDNAME = -11;

const NOPAREN = -3;
const EMPTY = -2;
const ERROR = -1;

const NUMBER = 0;
const VARIABLE = 1;
const UNDEF = 2;

const COMMA = 5;
const CLOSEPAREN = 6;


const ADD = 10;
const MULTIPLY = 11;
const DIVIDE = 12;
const MINUS = 13;
const POWER = 14;
const FACTORIAL = 15;

const LINE = 20;
const REPEAT = 21;

const RMLINE = 30;
const RMREPEAT = 31;
const CLEARALL = 32;

const SETDEPTH = 40;
const SETUNITSIZE = 41;
const SETCENTRE = 42;
const SETZEROANGLE = 43;

const SCREEN = 50;

const PI = 60;

const IMPORT = 70;
const EXPORT = 71;

var last = "";

var variable = [];

//default variables:
variable["depth"] = 4;


function stringReference(string) {
    this.string = string;
}

function typeVal(type, val) {
    this.type = type;
    this.val = val;
}

function evaluate(expression) {
    var stack = [];
    var frame = -1;
    var next = 0;
    
    var done = 0;

    var output = "";
    
    var nextToken;

    var expRef = new stringReference(expression);

    removeWhiteSpace(expRef);

    var target = assignment(expRef);

    var firstToken = 1;

    if (target == RESERVEDNAME) {
        done = 1;
        output = last + " is reserved and cannot be a variable name";
    } else if (!balanced(expRef.string)) {
        done = 1;
        output = "unbalenced brackets";
    }

    while (!done) {
        nextTypeVal = tokenise(expRef);
        
        nextToken = nextTypeVal.type;

        if (nextToken == EMPTY && firstToken) {
            done = 1;
        } else if (nextToken == ERROR) {
            done = 1;
            output = "unknown token: " + last;
        } else if (nextToken == NOPAREN) {
            done = 1;
            output = "expected '(' after " + last;
        } else if (nextToken == UNDEF) {
            done = 1;
            output = last + " is undefined";

        } else if (nextToken == NUMBER) {
            stack[next] = extractNumber(expRef);
        } else if (nextToken == VARIABLE) {
            stack[next] = nextTypeVal.val;
        } else if (nextToken == COMMA) {
            next++;
        } else if (nextToken == CLOSEPAREN) {
            
            var op = stack[frame];
                
            
            if (op == ADD) {
                stack[frame] = stack[frame+2] + stack[frame+3];
            } else if (op == MINUS) {
                stack[frame] = stack[frame+2] - stack[frame+3];
            } else if (op == MULTIPLY) {
                stack[frame] = stack[frame+2] * stack[frame+3];
            } else if (op == DIVIDE) {
                stack[frame] = stack[frame+2] / stack[frame+3];
            } else if (op == POWER) {
                stack[frame] = Math.pow(stack[frame+2], stack[frame+3]);
            } else if (op == LINE) {
                stack[frame] = "Added line from (" + stack[frame+2] + ", " + stack[frame+3] + ") to ("+stack[frame+4]+", "+stack[frame+5]+").";
                addLineCart(stack[frame+2], stack[frame+3], stack[frame+4], stack[frame+5]);
                drawFractal(env);
                updateData();
            } else if (op == REPEAT) {
                stack[frame] = "Added repetition { scale: " + stack[frame+2] + ", rotate: " + stack[frame+3] + ", offset distance: " + stack[frame+4] + ", offset angle: " + stack[frame+5] + " }";
                addPolarRep(stack[frame+2], stack[frame+3], stack[frame+4], stack[frame+5]);
                drawFractal(env);
                updateData();
            } else if (op == PI) {
                stack[frame] = Math.PI;
            } else if (op == RMLINE) {
                stack[frame] = "Removed line " + stack[frame+2];
                removeLine(stack[frame+2]);
                drawFractal(env);
                updateData();
            } else if (op == RMREPEAT) {
                stack[frame] = "Removed repetition " + stack[frame+2];
                removeRepeat(stack[frame+2]);
                drawFractal(env);
                updateData();
            } else if (op == SETDEPTH) {
                stack[frame] = "Depth: " + stack[frame+2];
                env.fractals[0].depth = stack[frame+2];
                drawFractal(env);
                updateData();
            } else if (op == SETUNITSIZE) {
                stack[frame] = "Initial Unit Size: " + stack[frame+2];
                env.fractals[0].initialUnit = stack[frame+2];
                drawFractal(env);
                updateData();
            } else if (op == SETCENTRE) {
                stack[frame] = "Initial Centre: (" + stack[frame+2] + ", " + stack[frame+3] + ")";
                env.fractals[0].start = new CartPt(stack[frame+2], stack[frame+3]);
                drawFractal(env);
                updateData();
            } else if (op == SETZEROANGLE) {
                stack[frame] = "Initial Global Zero Angle: " + stack[frame+2];
                env.fractals[0].initialAngle = stack[frame+2];
                drawFractal(env);
                updateData();
            } else if (op == SCREEN) {
                stack[frame] = "Changed view window.";
                env.xMin = stack[frame+2];
                env.xMax = stack[frame+3];
                env.yMin = stack[frame+4];
                env.yMax = stack[frame+5];
                env.xRange = env.xMax - env.xMin;
                env.yRange = env.yMax - env.yMin;

                drawFractal(env);
                updateData();
            } else if (op == FACTORIAL) {
                stack[frame] = factorial(stack[frame+2]);
            } else if (op == CLEARALL) {
                stack[frame] = "Removed all lines and repetitions.";
                clearAll();
                drawFractal(env);
                updateData();
            } else if (op == IMPORT) {
                stack[frame] = "Import...";
                showImport();
            } else if (op == EXPORT) {
                stack[frame] = "Export...";
                formatExport();
            }   




            next=frame;
            frame = stack[frame+1];
            
            

        } else {
            stack[next] = nextToken;
            stack[next+1] = frame;
            frame = next;
            next+=2;
            
        }

        firstToken = 0;
        
        if (frame == -1 && !done) {
            done = 1;

            if (target == NULLVAR) {
                output = stack[0];
            } else {
                variable[target] = stack[0];
            }

        }

    }
    
    return output;

}

//returns the next token and removes it from the string
function tokenise(stringRef) {
    
    var token = ERROR;

    var first = stringRef.string.substr(0, 1);

    var digitFirst = parseInt(first);

    var value = 0;
    
    if (stringRef.string.length == 0) {
        token = EMPTY;
    } else if (digitFirst > 0 || digitFirst <= 0 || first == "-") {
        token = NUMBER;
    } else if (first == ")") {
        token = CLOSEPAREN;
        stringRef.string = stringRef.string.substr(1);
    } else if (first == ",") {
        token = COMMA;
        stringRef.string = stringRef.string.substr(1);
    } else {
        var command = "";
        var buffer = first;

        var count = 0;

        while (buffer != "(" && buffer != "," && buffer != ")" && count < stringRef.string.length) {
            count++;
            command += buffer;
            buffer = stringRef.string.substr(count, 1);
        }
        

        token = tokenFromString(command);
        
        stringRef.string = stringRef.string.substr(count);
       
        if (buffer == "(") {
            stringRef.string = stringRef.string.substr(1);
        } else {
            if (token != ERROR) {
                token = NOPAREN;
            } else {
                var test = variable[command];
                if (test == undefined) {
                    token = UNDEF;
                } else {
                    token = VARIABLE;
                    value = test;
                }
            }
            
        }



       
        last = command;
    }
    
    return new typeVal(token, value);

}

function tokenFromString(string) {
    var token = ERROR;

    if (string == "add") {
        token = ADD;
    } else if (string == "multiply") {
        token = MULTIPLY;
    } else if (string == "divide") {
        token = DIVIDE;
    } else if (string == "minus") {
        token = MINUS;
    } else if (string == "power") {
        token = POWER;
    } else if (string == "line") {
        token = LINE;
    } else if (string == "repeat") {
        token = REPEAT;
    } else if (string == "pi") {
        token = PI;
    } else if (string == "rmline") {
        token = RMLINE;
    } else if (string == "rmrepeat") {
        token = RMREPEAT;
    } else if (string == "setdepth") {
        token = SETDEPTH;
    } else if (string == "setunitsize") {
        token = SETUNITSIZE;
    } else if (string == "setcentre") {
        token = SETCENTRE;
    } else if (string == "setzeroangle") {
        token = SETZEROANGLE;
    } else if (string == "screen") {
        token = SCREEN;
    } else if (string == "factorial") {
        token = FACTORIAL;
    } else if (string == "clearall") {
        token = CLEARALL;
    } else if (string == "import") {
        token = IMPORT;
    } else if (string == "export") {
        token = EXPORT;
    }

    return token;
}

//returns the next number and removes it from the string
function extractNumber(stringRef) {

    var buffer = stringRef.string.substr(0, 1);

    var bufferInt = parseInt(buffer);

    var numString = "";
    var count = 0;

    while (bufferInt >= 0 || buffer == "-" || buffer == ".") {
        numString += buffer;
        count++;
        buffer = stringRef.string.substr(count, 1);
        bufferInt = parseInt(buffer);
    }

    stringRef.string = stringRef.string.substr(count);
//alert("number: " + numString);
    return parseFloat(numString);
}

function assignment(stringRef) {
    
    var assign = stringRef.string.match(/^[a-zA-z][a-zA-Z0-9_/']*=/);
    
    var vName = NULLVAR;

    if (assign != null) {
        vName = assign + "";
        vName = vName.substr(0, vName.length-1);
        
        if (tokenFromString(vName) == ERROR) {
            stringRef.string = stringRef.string.substr(vName.length+1);
        } else {
            last = vName;
            vName = RESERVEDNAME;
        }
    }
    return vName;
}

        

function balanced(string) {
    var valid = 1;

    var tracker = 0;
    var ch;

    for (var i = 0;i<string.length && valid;i++) {
        ch = string.substr(i, 1);
        if (ch == "(") {
            tracker++;
        } else if (ch == ")") {
            tracker--;
        }

        if (tracker < 0) {
            valid = 0;
        }
    }

    if (tracker != 0) {
        valid = 0;
    }

    return valid;
}

function isLetterOrDigit(ch) {
    return ch.match(/[a-zA-Z0-9.-]/) != null;
}

function removeWhiteSpace(stringRef) {
    var i, j;
    for (i = 0;stringRef.string.substr(i, 1) == " ";i++);
    for (j = 0;stringRef.string.substr(stringRef.string.length - j - 1, 1) == " ";j++);

    stringRef.string = stringRef.string.substr(i, stringRef.string.length - i - j);

    for (i = 0;i<stringRef.string.length - 2;i++) {
        if (stringRef.string.substr(i+1, 1) == " " && !(
            isLetterOrDigit(stringRef.string.substr(i, 1)) &&
            isLetterOrDigit(stringRef.string.substr(i+2, 1)))) {

            stringRef.string = stringRef.string.substr(0, i+1) + stringRef.string.substr(i+2);
        }
    }
}

function factorial(n) {
    if (n==1) {
        return 1;
    } else {
        return n*factorial(n-1);
    }
}
