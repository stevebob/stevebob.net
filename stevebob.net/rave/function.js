//This is the script that controls the interface component for making and controling functions

var selectedElement = -1;
var renaming = 0;

var focus = 0;

function beginFunctions() {

    listFunColours();

    populateFunctionList();
    fillForm(selectedElement);
    
}

function populateFunctionList() {

    var m;
    var functionList = document.getElementById("functionList");
    
    functionList.innerHTML = "";
    
    for (m=0;m<funCount;m++) {
        
        functionList.innerHTML += "<div id='listElement"+m+"' onClick='selectListElement("+m+");' onMouseOut='mouseOutElement("+m+")'; onMouseOver='mouseOverElement("+m+")' class='listElement'><div id='listButtons"+m+"' style='display:none;position:relative;left:20px;float:left;width:60px;height:100%;'><input type='button' value='Rename' style='width:100%;' onClick='beginRenameElement()'><br/><input type='button' value='Delete' style='width:100%;' onClick='deleteListElement("+m+")'></div><div style='position:absolute;left:100px;'>"+f[m].id+"</div></div>";

        
        
    }
    
    functionList.innerHTML += "<div id='adder' onClick='beginAddElement()' onMouseOut='mouseOutAdder()'; onMouseOver='mouseOverAdder();' class='listElementDisabled' style='text-align:center;'>+ new</div>";

    

}




function mouseOverElement(m) {

    var listElement = document.getElementById("listElement" + m);
    
    if (m != selectedElement && !renaming) {
        listElement.style.backgroundColor = "rgb(180, 225, 255)";
    }
}

function mouseOutElement(m) {

    var listElement = document.getElementById("listElement" + m);
    
    if (m != selectedElement && !renaming) {
        listElement.style.backgroundColor = "rgb(225, 255, 255)";
    }
}

function mouseOutAdder() {
    
    document.getElementById("adder").style.backgroundColor = "rgb(200, 200, 200)";

}

function mouseOverAdder() {
    
    document.getElementById("adder").style.backgroundColor = "rgb(180, 225, 255)";

}


function selectListElement(n) {

    var listElement;
    var listButtons;
    var m;
    
    //unfreeze control
    focus=0;
    
    selectedElement = n;
    
    if (!renaming) {
    
        for (m=0;m<funCount;m++) {
            
            listElement = document.getElementById("listElement" + m);
            listButtons = document.getElementById("listButtons" + m);
            
            if (m==n) {
                listElement.style.backgroundColor = "rgb(100, 200, 255)";
                
                listButtons.style.display = "";
            } else {
                listElement.style.backgroundColor = "rgb(225, 255, 255)";
                 
                listButtons.style.display = "none";
            }
        }
    }
    
    fillForm(selectedElement);
    //alert("t1");
    insertValues(selectedElement);
    //alert("t2");
    document.getElementById("funColour").value = cs[f[n].col].id;

    if (f[n].visible) {
   
        document.getElementById("visibleTick").checked = "true";
    } else {
        document.getElementById("visibleTick").checked = "false";
    }
    
    
}

function fillForm(n) {
    
    var m;
    
    if (n==-1) {
        document.getElementById("functionCtrlForm").style.display = "none";
    } else {

        if (f[selectedElement].type != 0) {
            
            document.getElementById("funCtrlArea").style.display = "";
        } else {
            document.getElementById("funCtrlArea").style.display = "none";
        }
        
        document.getElementById("functionCtrlForm").style.display = "";
        document.getElementById("functionCtrlHeading").innerHTML = f[n].id;

        var spec = document.getElementById("funSpec");
        
        var funList = document.getElementById("funList");
        
        if (f[selectedElement].type == 0) {
            funList.value = "(choose one)";
            spec.innerHTML = "";
        } else if (f[selectedElement].type == 1) {
            funList.value = "Polynomial";
            spec.innerHTML = "<img src=\"images/pol.png\" alt=\"Polynomial\" style=\"padding:0px;margin:0px;top:0px;height:100%;margin-left:auto;margin-right:auto;\"/> ";
        } else if (f[selectedElement].type == 2) {
            funList.value = "Sine Wave";
            spec.innerHTML = "<img src=\"images/sin.png\" alt=\"Sine Wave\" style=\"padding:0px;margin:0px;top:0px;height:100%;margin-left:auto;margin-right:auto;\"/> ";
        } else if (f[selectedElement].type == 3) {
            funList.value = "Reciprocal";
            spec.innerHTML = "<img src=\"images/rec.png\" alt=\"Sine Wave\" style=\"padding:0px;margin:0px;top:0px;height:100%;margin-left:auto;margin-right:auto;\"/> ";
        }
        
        //clear the param area
        document.getElementById("paramVals").innerHTML = "";
        
        
        //now add the appropriate params
        
        for (m=0;m<f[n].paramfunCount;m++) {
            
            //alert(f[0].paramType[0]);
            
            document.getElementById("paramVals").innerHTML += "<div id=\"param" + m + "\" style=\"position:relative;height:40px;width:auto;background-color:lightgray;margin-bottom:5px;margin-left:0px;margin:right:0px;padding:0px;\"><h2 style=\"width:20px;font-family:sans-serif;left:5px;position:absolute;margin:0px;padding:0px;top:5px;bottom:5px;text-align:left;\">"+numToChar(m)+":</h2><div style=\"position:absolute;float:left;padding:0px;margin:0px;top:0px;bottom:0px;left:40px;right:0px;\">"+fillInParam(n, m)+"</div></div>";
        
        }

        
        document.getElementById("paramRoCs").innerHTML = "";
        
        
        for (m=0;m<f[n].paramfunCount;m++) {
            
            document.getElementById("paramRoCs").innerHTML += "<div id=\"param" + m + "\" style=\"position:relative;height:40px;width:auto;background-color:lightgray;margin-bottom:5px;margin-left:0px;margin:right:0px;padding:0px;\"><h2 style=\"width:20px;font-family:sans-serif;left:5px;position:absolute;margin:0px;padding:0px;top:5px;bottom:5px;text-align:left;\">"+numToChar(m)+":</h2><div style=\"position:absolute;float:left;padding:0px;margin:0px;top:0px;bottom:0px;left:40px;right:0px;\">"+fillInRoC(n, m)+"</div></div>";
        
        }
        
        
            
    }



}

function insertValues(n) {

    var k;
        //alert(n);
    if (mainUp && n >=0) {
        for (k=0;k<f[n].paramfunCount;k++) {
        

            
//alert(k + ", " + f[n].paramfunCount);
            
            
            if (f[n].paramType[k] == 0) {
            
                //if (focus != "paramVal"+k) {
                    document.getElementById("paramVal"+k).value = f[n].param[k];
                //}
                
                //if (focus != "selectSource"+k) {
                    document.getElementById("selectSource"+k).value = "Constant";
              //}  
            } else if (f[n].paramType[k] == 1) {
                
                //if (focus != "selectSource"+k) {
                    document.getElementById("selectSource"+k).value = "Function";
                //}
                //alert(f[n].param[k]);
                //if (focus != "paramVal"+k) {
                    document.getElementById("paramVal"+k).value = f[f[n].param[k]].id;
                    
                //}
            
            }
            
        
        }
    }

}

function setFocus(el) {
    
    

    focus = el;
    //alert(focus);
    
    hideBtns();
    

}


function hideBtns() {

    var m;
    
    for (m=0;m<f[selectedElement].paramfunCount;m++) {

        if (f[selectedElement].paramType[m] == 0) {
        
            document.getElementById("paramVal" + m).style.right = "0px";
            document.getElementById("okBtn" + m).style.display = "none";
        }
        document.getElementById("paramRoC" + m).style.right = "0px";
        document.getElementById("okRoCBtn" + m).style.display = "none";    
    }

}

function revealBtn(n) {
    
    hideBtns();
    
    
    document.getElementById("paramVal" + n).style.right = "35px";
    document.getElementById("okBtn" + n).style.display = "";

}

function revealRoCBtn(n) {
    
    hideBtns();
    
    
    document.getElementById("paramRoC" + n).style.right = "35px";
    document.getElementById("okRoCBtn" + n).style.display = "";

}

function fillInParam(id, n) {

    var contents = "";
    var k;
    
    
    
    if (f[id].paramType[n] == 0) {
    
        contents += "<div style=\"padding:0px;margin:0px;top:3px;height:30px;top:5px;position:absolute;left:0px;right:50%;\"><input id='paramVal"+n+"' style='position:absolute; border:0px black solid;font-size:25px;left:0px;right:0px;padding:0px;margin:0px;' value='";    
        //contents += f[id].param[n];
        contents += "'  onFocus=\"setFocus('paramVal"+n+"');revealBtn("+n+");\"  /><input id=\"okBtn"+n+"\" type=\"button\" value=\"OK\" style=\"position:absolute;margin:0px;padding:0px;right:0px;width:30px;height:100%;top:0px;display:none;\" onClick=\"changeParam("+id+", "+n+");\"/></div>";
        
    } else if (f[id].paramType[n] == 1) {
        
        contents += "<div style=\"padding:0px;margin:0px;top:3px;height:30px;top:5px;position:absolute;left:0px;right:50%;\"><select id='paramVal"+n+"' style='position:absolute; border:0px black solid;font-size:25px;left:0px;right:0px;padding:0px;margin:0px;' onFocus=\"setFocus('paramVal"+n+"');\" onChange=\"changeFunction("+id+", "+n+");\">";    

        
        for (k=0;k<funCount;k++) {
            
            if (k!=id) {
                contents += "<option>"+f[k].id+"</option>";
            }
        }
        
        contents += "</select></div>"
        
        
    
    }
    
    contents += "<div style=\"text-align:center;position:absolute;top:0px;bottom:0px;right:0px;width:50%;\"><p style=\"margin:0px;padding:0px;position:absolute;right:0px;width:100%;font-family:sans-serif;\">Source</p><select id=\"selectSource"+n+"\" style=\"position:absolute;right:5px;left:5px;height:20px;bottom:2px;\" onFocus=\"setFocus('selectSource"+n+"');\" onChange=\"changeSource("+id+", "+n+");\"><option>Constant</option><option>Function</option></select></div>";
    


    return contents;
    
}



function changeSource(id, param) {

    var value = document.getElementById("selectSource" + param).value;
    
     
    
    if (value == "Constant") {
        f[id].paramType[param] = 0;
    } else if (value == "Function") {
        //alert("F "+id+" P "+param);
        f[id].paramType[param] = 1;
    } 
    
    //setFocus(0);  
    
    //selectListElement(id);

    fillForm(id);

    //alert("test");
    
    changeFunction(id, param);
    
    selectListElement(id);
    
    //fillForm();

    //forceTick();

    
    
}

function getFunNo(funName) {

    var m;
    var found = 0;
    var num = 0;
    
    for (m=0;m<funCount && found==0;m++) {
    
        if (f[m].id == funName) {
        
            found = 1;
            num = m;
        }
    
    }
    
    return num;

}



function changeFunction(id, param) {

    var fun = document.getElementById("paramVal" + param).value;
    var value = getFunNo(fun);
    //alert(fun + value);
    
    f[id].param[param] = value;
    
    //forceTick();
    //setFocus(0);

}

function changeParam(id, param) {

    var value = parseFloat(document.getElementById("paramVal" + param).value);
    
    f[id].param[param] = value;
    
    forceTick();
    setFocus(0);

}

function changeRoC(id, roc) {

    var value = parseFloat(document.getElementById("paramRoC" + roc).value);
    
    f[id].paramRoC[roc] = value;
    
    forceTick();
    setFocus(0);

}



function fillInRoC(id, n) {

    var contents = "";
    



        contents += "<div style=\"padding:0px;margin:0px;top:3px;height:30px;top:5px;position:absolute;left:0px;right:5px;\"><input id='paramRoC"+n+"' style='position:absolute; border:0px black solid;font-size:25px;left:0px;right:0px;padding:0px;margin:0px;' value='";    
        contents += f[id].paramRoC[n];
        contents += "'  onFocus=\"setFocus('paramRoC"+n+"');revealRoCBtn("+n+");\"  /><input id=\"okRoCBtn"+n+"\" type=\"button\" value=\"OK\" style=\"position:absolute;margin:0px;padding:0px;right:0px;width:30px;height:100%;top:0px;display:none;\" onClick=\"changeRoC("+id+", "+n+");\"/></div>";




    return contents;
    
}

function numToChar(num) {

    var ch = 0;
    
    if (num==0) {
        ch = 'a';
    } else if (num==1) {
        ch = 'b';
    } else if (num==2) {
        ch = 'c';
    } else if (num==3) {
        ch = 'd';
    }
    
    return ch;

}

function getNumParams(f) {

    var num = 0;
    
    if (f==1) {
        num = 3;
    } else if (f==2) {
        num = 4;
    } else if (f==3) {
        num = 3;
    }
    
    return num;

}

function getTypeNo(fName) {

    var type = 0;
    
    if (fName == "Polynomial") {
        type = 1;
    } else if (fName == "Sine Wave") {
        type = 2;
    } else if (fName == "Reciprical") {
        type = 3;
    }
    
    return type;


}

function assignType() {

    var m;
    
    f[selectedElement].type = getTypeNo(document.getElementById("funList").value);
    
    f[selectedElement].paramfunCount = getNumParams(f[selectedElement].type);
    
    for (m=0;m<f[selectedElement].paramfunCount;m++) {
        
        if (f[selectedElement].type == 2) {
        
            if (m==0) {
                f[selectedElement].param[m] = 4; 
            } else if (m==1) {
                f[selectedElement].param[m] = 2; 
            } else {
            
                f[selectedElement].param[m] = 0;
            } 
        
        } else {
        
        
            f[selectedElement].param[m] = 0;   
 
        }    
        
        f[selectedElement].paramType[m] = 0;
        f[selectedElement].paramRoC[m] = 0; 
        
    }   
    
    f[selectedElement].visible = 1;
    f[selectedElement].col = 0;
}

function hideForm() {

    document.getElementById("functionCtrlForm").style.display = "none";
    document.getElementById("funCtrlArea").style.display = "none";
    
}

function beginRenameElement() {

    var m;
    var functionList = document.getElementById("functionList");
    
    renaming = 1;
    updateDimensions();

    var tbWidth = winW / 2 - 140;
    
    //alert(tbWidth);
    
    functionList.innerHTML = "";
    
    
    for (m=0;m<funCount;m++) {
        
        if (m==selectedElement) {
        
            functionList.innerHTML += "<div id='listElement"+m+"' onClick='selectListElement("+m+")' onMouseOut='mouseOutElement("+m+")'; onMouseOver='mouseOverElement("+m+")' class='listElementSelected'><div id='listButtons"+m+"' style='position:relative;left:20px;float:left;width:60px;height:100%;'><input type='button' value='Done' style='width:100%;' onClick='renameListElement("+m+");'><br/><input type='button' value='Cancel' style='width:100%;' onClick='renameCancel();'></div><div style='position:absolute;left:100px;'>"+"<input id='newFunctionName' style='border:0px black solid;height:30px;top:5px;position:absolute;font-size:25px;width:"+tbWidth+"px;' value='"+f[m].id+"'>"+"</div></div>";
        
        } else {
       
            functionList.innerHTML += "<div id='listElement"+m+"' onClick='selectListElement("+m+")' onMouseOut='mouseOutElement("+m+")'; onMouseOver='mouseOverElement("+m+")' class='listElementDisabled'><div style='position:absolute;left:100px;'>"+f[m].id+"</div></div>";
        
        }
        
        
    }

}

function renameListElement(n) {

    f[n].id = document.getElementById("newFunctionName").value;
    renameCancel();

}

function renameCancel() {

    renaming = 0;
    populateFunctionList();

}

function deleteListElement(n) {

    var m, l;
    
    var okToDelete = 1;
    var dependent = [];
    var depCount = 0;
    
    for (m=0;m<funCount;m++) {
    
        if (m != n) {
        
            for (l=0;l<f[m].paramfunCount;l++) {
            
                if (f[m].paramType[l] == 1 && f[m].param[l] == n) {
                
                    okToDelete = 0;
            
                    dependent[depCount] = m;
                    //alert(m);
                    depCount++;
                
                }
            
            }
        
        }
    
    }
    
    if (okToDelete) {
        
        for (m=n;m<funCount-1;m++) {
            
            f[m] = f[m+1];
            
        }
        
        cleanUp(n);
        
        funCount--;
        
        selectedElement = -1;
        
        populateFunctionList();
        
        
        
        //hideForm();
        
    } else {
        var msg = "Unable to delete " + f[n].id + " as it is used by ";
        
        for (m=0;m<depCount;m++) {
            
            if (m != 0 && m<depCount-1) {
                msg += ", ";
            } else if (m!=0) {
                msg += " and ";
            }
            
            msg += f[dependent[m]].id;
            
               
            
        }
        
        alert(msg);
    }
}

function beginAddElement() {

    var m;
    var functionList = document.getElementById("functionList");
    hideForm();
    renaming = 1;
    //updateDimensions();

    //var tbWidth = winW / 3 - 140;
    
    //alert(tbWidth);
    
    functionList.innerHTML = "";
    
    
    for (m=0;m<funCount;m++) {
        
        

       
        functionList.innerHTML += "<div id='listElement"+m+"' onClick='selectListElement("+m+")' onMouseOut='mouseOutElement("+m+")'; onMouseOver='mouseOverElement("+m+")' class='listElementDisabled'><div style='position:absolute;left:100px;'>"+f[m].id+"</div></div>";
        
        
        
        
    }
    
    functionList.innerHTML += "<div id='listElement"+m+"' onMouseOut='mouseOutElement("+m+")'; onMouseOver='mouseOverElement("+m+")' class='listElementSelected' style=\"position:relative;\"><div id='listButtons"+m+"' style='position:relative;left:20px;float:left;width:60px;height:100%;'><input type='button' value='Add' style='width:100%;' onClick='addListElement("+m+");'><br/><input type='button' value='Cancel' style='width:100%;' onClick='renameCancel();'></div><input id='newFunctionName' style='border:0px black solid;height:30px;top:5px;position:absolute;font-size:25px;right:5px;left:100px;'></div>";

}

function addListElement() {
    
    var newElement = funCount;
    
    f[funCount] = new fun();
    
    f[funCount].id = document.getElementById("newFunctionName").value;
    
    f[funCount].type = 0;
    
    f[funCount].col = 0;
    f[funCount].visible = 1;
    
    

    funCount++;
    
    renaming = 0;
    
    populateFunctionList();
    

    selectListElement(newElement);
}



function cleanUp(n) {

    var l, m;
    
    for (m=0;m<funCount;m++) {
        for (l=0;l<f[m].paramfunCount;l++) {
        
            if (f[m].param[l] > n && f[m].paramType[l] == 1) {
                
                f[m].param[l] = f[m].param[l]-1;
                
            }
        }
    }


}




function listFunColours() {

    var colList = document.getElementById("funColour");

    var m;

    colList.innerHTML = "";
    
    for (m=0;m<colCount;m++) {

        colList.innerHTML += "<option>" + cs[m].id + "</option>";

    }

}


function displayFunction(n) {

    var visTick = document.getElementById("visibleTick");

    if (visTick.checked) {
        
        f[n].visible = 1;
    } else {
        f[n].visible = 0;
    }

    forceTick();

    //fillForm(n);
}

function colourFunction(n) {

    var colName = document.getElementById("funColour").value;

    var m;

    var found = 0;
    var colNum = 0;
    
    for (m=0;m<colCount && found==0;m++) {
        if (cs[m].id == colName) {
            found = 1;
            colNum = m;
        }
    }

    

    f[n].col = colNum;
    forceTick();

}


