function populateBGCSList() {

    var i;
    
    var list = document.getElementById("bgcs");

    //empty the list
    list.innerHTML = "";

    for (i=0;i<colCount;i++) {

        list.innerHTML += "<option>" + cs[i].id + "</option>";

    }

}

function loadEnvSettings() {

    populateBGCSList();

}



function getColId(name) {




    var i;
    
    var list = document.getElementById("bgcs");
        
    var idNum = 0;

    for (i=0;i<colCount;i++) {
        
        if (cs[i].id == list.value) {
            idNum = i;
        }

    }

    return idNum;
}

function beginChangeBG() {
    changeBGCol(getColId(document.getElementById("bgcs")));
}

function changeBGCol(id) {
    
    bgCol = id;
}
