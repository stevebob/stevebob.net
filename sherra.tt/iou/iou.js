var count = 0;

var nameList = [];
var spentList = [];

var actualCount = 0;

function formHTML() {
    var result =  '  <div id="c_'+count+'" class="container"> ' +
                     '  <div class="name"> ' +
        '   <div class="label">Name:</div> <input id="name_'+count+'" type=text class="namebox"> ' +
                     '   </div>  ' +
                     '   <div class="spent">  ' +
        '  <div class="label">Spent: $</div> <input id="spent_'+count+'" type=text class="spentbox"> ' +
                     '   </div>  ';


    if (count > 0) {
        result += "<input type=button class='remove' value=x onclick=\"remove(" + count + ");\">";
    }
                  
               result = result + '   </div>  ';


    count++;
    actualCount++;

    return result;
}

function addForm() {
    nameParam();
    spentParam();
    document.getElementById("list").innerHTML += formHTML();
    
    var j = 0;
    for (var i = 0;i<count - 1;i++) {
        if (document.getElementById("spent_" + i)) {

            document.getElementById("name_" + i).value = nameList[j];
            document.getElementById("spent_" + i).value = spentList[j];
            j++;
        }
    }
}

function nameParam() {
    var names = "";
    var j = 0;
    for (var i = 0;i<count;i++) {
        if (document.getElementById("name_" + i)) {
            var name = document.getElementById("name_" + i).value;
            names += name;
            nameList[j] = name;
            if (j < actualCount - 1) {
                names += ",";
            }
            j++;
        }
    }
    return names;
}


function spentParam() {
    var spents = "";
    var j = 0;
    for (var i = 0;i<count;i++) {
        if (document.getElementById("spent_" + i)) {
            var spent = document.getElementById("spent_" + i).value;
            spents += spent;
            spentList[j] = spent;
            if (j < actualCount - 1) {
                spents += ",";
            }
            j++;
        }
    }
    return spents;
}


function calculate() {
    
 //   alert(nameParam());
 //   alert(spentParam());

    $.post("wrapper.cgi", {names: nameParam(), amounts: spentParam()}, function(data) {
        display(data);
    });

}


function display(data) {

    document.getElementById("output").innerHTML = data;

}

function remove(n) {
    var el = document.getElementById("c_" + n);
    el.parentNode.removeChild(el);
    actualCount--;
}
