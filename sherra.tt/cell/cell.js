var map = [];


map["  #"] = "#";
map[" # "] = "#";
map["#  "] = "#";
map[" ##"] = "#";
map["## "] = " ";
map["###"] = " ";
map["   "] = " ";
map["# #"] = " ";

var ht = 400;

var width = 1200;
//init = "                                                                                                      #                                                      ";
init = "";

for (var i = 0;i<width/2;i++) {
    init += " ";
}
init += "#";
for (var i = 0;i<width/2;i++) {
    init += " ";
}

var bl = 3;
var t;

function begin(line) {
    printIt(line);
    var next = getNext(line);
    t = setTimeout(begin, 1, next);
}

function getNext(tmp) {

    var next = " ";
    var buffer;

    while (tmp.length > bl) {
        buffer = tmp.substr(0, bl);

        if (typeof(map[buffer]) != 'undefined') {
            next += map[buffer];
            tmp = tmp.substr(1, tmp.length - 1);
        }

    }

    if (tmp.length != 0) {
        next += tmp;
    }


    return next;
 }

function printIt(next) {
    area = document.getElementById("cell");
    area.innerHTML += ("<pre style='padding:0px; margin:0px;'>" + next + "</pre>");
    area.scrollTop = area.scrollHeight;
}
