
document.onkeydown = keyPressHandle;

var t;

var dotCount = 3000;

var xRange = 10;
var yRange = 10;
var zRange = 10;

var dotSize = 0.2;

var tolerance = 0.1;

var players = [];

var heroPool = dotCount;
var villainPool = 2;

var trails = 0.5;

var spinSpeed = 0.01;

var bgColour = "0, 0, 0";
var dotColour = "255, 255, 255";
var dotOpacity = 0.5;

var scheme = 0;

function Player(pt) {
    this.hero;
    this.villain;
    this.vector = pt;
    this.target = new Vector();
    this.moving = false;
}

function client() {
    
    setUpCanvas();
    adjustSize();
    clear(1);

    var three = new Three();
    
    //testShape(three);
    populate(three);
    assignRoles(three);

    rotate(0, three);
}

function populate(world) {
    
    for (var i = 0;i<dotCount;i++) {
        
        x = -xRange/2 + Math.random() * xRange;
        y = -yRange/2 + Math.random() * yRange;
        z = -zRange/2 + Math.random() * zRange;
        
        addPoint(world, x, y, z);

    }

}

function assignRoles(world) {

    //make a Player for each point
    for (var i in world.point) {
        players[i] = new Player(world.point[i]);
        players[i].hero = players[i];
        players[i].villain = players[i];
    }

    for (var i = 0;i<dotCount;i++) {
        
        if (heroPool == 1 && i == 0) {
                players[0].hero = players[Math.floor(Math.random()*(dotCount-1)+1)];
        }

        while (players[i].hero == players[i]) {
                players[i].hero = players[Math.floor(Math.random()*heroPool)];
        }
        
        if (villainPool == 1 && i == dotCount - 1) {
                players[dotCount - 1].villain = players[Math.floor(Math.random()*(dotCount-1))];
        }
        
        while (players[i].villain == players[i]) {
            players[i].villain = players[dotCount - 1 - Math.floor(Math.random()*villainPool)];
        }

    }

    /*
    for (var i = 0;i<dotCount;i++) {
        players[i].hero = players[Math.floor(Math.random()*dotCount)];
    }
    //players[dotCount - 1].hero = players[0];

    
    for (var i = 1;i<dotCount;i++) {
        players[i].villain = players[0];
    }
    players[0].villain = players[dotCount - 1];
*/
/*
    for (var i = 0;i<dotCount;i++) {
        var ind;

        while (players[i].hero == players[i]) {
            ind = Math.floor(Math.random()*dotCount);
            players[i].hero = players[ind];
        }

        players[i].hero.villain = players[i];
        
        while (players[i].villain == players[i]) {
            ind = Math.floor(Math.random()*dotCount);
            players[i].villain = players[ind];
        }

        players[i].villain.hero = players[i];

    }
*/
}

//conditional destination
function cDestination(player) {
    var h = player.hero.vector;
    var v = player.villain.vector;
    var p = player.vector;


    return addVector(project(minusVector(p, v), minusVector(h, v)), v);
}

function setDestination(player) {
    var cond = cDestination(player);

    var lengthToDest = length(minusVector(cond, player.vector));

    if (lengthToDest > tolerance) {
        player.moving = true;
        
        var dirVtoH = minusVector(player.hero.vector, player.villain.vector);
        var condFromV = minusVector(cond, player.villain.vector);

        var sameSide = (dot(dirVtoH, condFromV) > 0);
        var longer = false;
        
        if (sameSide) {
            longer = (length(condFromV) > length(dirVtoH));
        }
        
        if (longer) {
            player.target.x = cond.x;
            player.target.y = cond.y;
            player.target.z = cond.z;
        } else {
            player.target.x = player.hero.vector.x;
            player.target.y = player.hero.vector.y;
            player.target.z = player.hero.vector.z;
        }

    } else {
        player.moving = false;
    }
}


function moveAll() {

    for (var i = 0;i<dotCount;i++) {
        setDestination(players[i]);
    }

    for (var i = 0;i<dotCount;i++) {
        if (players[i].moving) {
            var full = minusVector(players[i].target, players[i].vector);
            var scale = tolerance/length(full);

            var next =  addVector(players[i].vector, multiplyVector(full, scale));

            players[i].vector.x = next.x;
            players[i].vector.y = next.y;
            players[i].vector.z = next.z;
        }
    }

}

function play(world) {

    moveAll();

    clear(trails);
    drawPerspectivePoints(world);

    t = setTimeout(play, 1, world);
}

function rotate(r, world) {
    var xAngle = -r;
    var yAngle = -r - Math.PI/2;
    


    world.xDir = new Vector(Math.cos(xAngle), Math.sin(xAngle), 0);
    world.yDir = new Vector(Math.cos(yAngle), Math.sin(yAngle), 0);
    
    clear(trails);
    drawPerspectivePoints(world);

    moveAll();
    
    t = setTimeout(rotate, 1, r+spinSpeed, world);
    
}




function keyPressHandle(e) {
    var keyID = (window.event) ? event.keyCode : e.keyCode;
    const R_KEY = 82;
    const I_KEY = 73;
    const H_KEY = 72;

    if (keyID == R_KEY) {
    
        clearTimeout(t);

        client();

    
    } else if (keyID == I_KEY) {
        if (scheme == 0) {
            bgColour = "0, 0, 0";
            dotColour = "255, 255, 255";
            scheme = 1;
        } else {
            bgColour = "255, 255, 255";
            dotColour = "0, 0, 0";
            scheme = 0;
        }
    } else if (keyID == H_KEY) {
         document.getElementById("header").style.display = "none";
    }
}       

