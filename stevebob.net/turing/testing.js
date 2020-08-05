var tm;
var tm_graph;

function test() {
tm = new TuringMachine();
tm.addToInputAlphabet("1");
tm.addToInputAlphabet("0");

tm.addToTapeAlphabet("x");

tm.addState("q1");
tm.addState("q2");
tm.addState("q3");
tm.addState("q4");
tm.addState("q5");
tm.addState("q6");
tm.addState("q7");
tm.addState("q8");

//q0 - init
//q1 - going right looking for 1 initially
//q2 - going right looking for 0 initially
//q3 - marking to the right
//q4 - left look for 0
//q5 - go left
//q6 - right look for 1
//q7 - go right
//q8 - final left
//q9 - final right

//remove the first of a type different to the start
tm.T(["q0", "_"], ["accept", "_", "r"]);
tm.T(["q0", "0"], ["q1", "x", "r"]);
tm.T(["q0", "1"], ["q2", "x", "r"]);
tm.T(["q1", "0"], ["q1", "0", "r"]);
tm.T(["q1", "1"], ["q3", "_", "r"]);
tm.T(["q2", "1"], ["q2", "1", "r"]);
tm.T(["q2", "0"], ["q3", "_", "r"]);

//mark the right end of the data
tm.T(["q3", "*"], ["q3", "*", "r"]);
tm.T(["q3", "_"], ["q4", "x", "l"]);

//go left looking for 0s
tm.T(["q4", "_"], ["q4", "_", "l"]);
tm.T(["q4", "1"], ["q4", "1", "l"]);
tm.T(["q4", "0"], ["q5", "_", "l"]);
tm.T(["q4", "x"], ["q8", "x", "r"]);

//go all the way to the left
tm.T(["q5", "*"], ["q5", "*", "l"]);
tm.T(["q5", "x"], ["q6", "x", "r"]);

//go right looking for 1s
tm.T(["q6", "_"], ["q6", "_", "r"]);
tm.T(["q6", "0"], ["q6", "0", "r"]);
tm.T(["q6", "1"], ["q7", "_", "r"]);

//go all the way to the right
tm.T(["q7", "*"], ["q7", "*", "r"]);
tm.T(["q7", "x"], ["q4", "x", "l"]);

//final sweep
tm.T(["q8", "_"], ["q8", "_", "r"]);
tm.T(["q8", "x"], ["accept", "x", "r"]);

tm.setDescription("Accepts strings of 0s and 1s with an equal number of 0s and 1s");

//tm.start(["0", "1", "1", "0", "0"]);
tm.start([1,1,0,1,0,1,1,0,0,0]);



tm_graph = new TuringAnimation(tm);
tm_graph.animate();
//tm_graph.test();

}

function reset() {
    tm_graph.cancel();
    tm.reset();
    tm.start(document.getElementById("input").value.split(""));
    tm_graph = new TuringAnimation(tm);
    tm_graph.animate();
}

function toggle() {
    var button = document.getElementById("toggle");
    if (tm_graph.running()) {
        button.value = "Resume";
        tm_graph.pause();
    } else {
        button.value = "Pause";
        tm_graph.animate();
    }
}

function next() {
    var button = document.getElementById("toggle");
    tm_graph.animate_step();
    button.value = "Resume";
    tm_graph.pause();
}

function previous() {
    var button = document.getElementById("toggle");
    tm_graph.animate_unstep();
    button.value = "Resume";
    tm_graph.pause();
}

function faster() {
    tm_graph.faster();
}

function slower() {
    tm_graph.slower();
}
