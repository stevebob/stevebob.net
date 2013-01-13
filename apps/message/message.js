document.onkeydown = modify;
var t;
var s;
var u;

var synced = true;

var tmp;
var ready = false;
var msgToSync = "";
var msgFromSync = "";

var changed = false;
var syncing = false;

var syncAlpha = 0;

var sendTime = 250;
var syncMinTime = 250;
var syncTime = syncMinTime;
var syncMaxTime = 1000;

function write() {
    msgToSync =  document.getElementById("text").value;
    var params = "msg=" + msgToSync;

    xmlhttp = new XMLHttpRequest();
    
    xmlhttp.open("POST","write.pl",true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(params);
    syncing = true;

    document.getElementById("sync").innerHTML = "sending...";
    syncAlpha = 1;
    syncTime = syncMinTime;
}


function read() {

    var textarea = document.getElementById("text");

    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            tmp=xmlhttp.responseText;
            if (!ready) {
                textarea.value = tmp;
                ready = true;
            }
        }
    }

    xmlhttp.open("GET","read.pl",true);
    
    xmlhttp.send();

    if (syncing && msgToSync == tmp) {
        syncing = false;
    }
    
    if (ready && !changed && !syncing) {
        if (msgFromSync == tmp && syncTime <= syncMaxTime) {
            syncTime *= 2;
        } else if (msgFromSync != tmp) {
            msgFromSync = tmp;
            textarea.value = msgFromSync;
            syncTime = syncMinTime;
        }
        document.getElementById("sync").innerHTML = "synced";
        syncAlpha = 1;
    }

    t = setTimeout(read, syncTime);

}

function modify() {
    var textarea = document.getElementById("text");
    if (textarea.focus) {
        changed = true;
    }
}

function writeWrap() {
    if (changed) {
        write();
        changed = false;
    }
    s = setTimeout(writeWrap, sendTime);
}

function syncFade() {
    document.getElementById("sync").style.color = "rgba(0, 0, 0, " + syncAlpha + ")";
    if (syncAlpha > 0 && !syncing) {
        syncAlpha -= 0.02;
    }
    u = setTimeout(syncFade, 10);
}
