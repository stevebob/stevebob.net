function TuringAnimation(tm) {

    const tape_height = 40;
    const head_height = 80;
    const cell_width = 40;

    var realCanvas = new SimpleCanvas(document.getElementById("canvas"));
    var canvas = new SimpleVirtualCanvas(realCanvas,
                                        0, 0,
                                        800, 300,
                                        1, 0);

    var tape = new SimpleVirtualCanvas(canvas,
                                        50, 100,
                                        800, tape_height,
                                        1, 0);
    
    var head_area = new SimpleVirtualCanvas(canvas,
                                        50, 90 - head_height,
                                        800, head_height,
                                        1, 0);


    var cells = [];
    
    var running = 0;

    var speed = 3;

    this.slower = function() {
        if (speed <= 15) {
            speed++;
        }
    }
    
    this.faster = function() {
        if (speed > 1) {
            speed--;
        }
    }

    this.displayProperties = function() {
        var buffer = "";

        if (tm.description() != "") {
            buffer += tm.description() + "<br/><br/>";
        }

        buffer += "Tape Alphabet = {" + tm.tape_alphabet().join(", ") + "}<br/>";
        buffer += "Input Alphabet = {" + tm.input_alphabet().join(", ") + "}<br/>";
        buffer += "State Set = {" + tm.states().join(", ") + "}<br/>";

        buffer += "<br/>Transtion Function:<br/>";

        var states = tm.states();
        var tape_alphabet = tm.tape_alphabet();
        var transition = tm.transition();

        for (i in tm.states()) {
            for (j in tm.tape_alphabet()) {
                if (states[i] == "accept" || states[i] == "reject") {
                    continue;
                }
                var result = transition[tape_alphabet[j]][states[i]];
                buffer += "tr(" + states[i] + ", " + tape_alphabet[j] + ") = (" + result[0] + ", " + result[1] + ", " + result[2] + ")</br>";
            }
        }

        document.getElementById("properties").innerHTML = buffer;
    }

    function prepare(input) {
        
        cells = [];
        
        for (i in input) {
            cells.push(new Cell(input[i], new SimpleVirtualCanvas(
                    tape, i * cell_width, 0, cell_width, tape_height, 1, 0
                )
            ));
        }
    }

    function drawTape() {
        
        tape.beginPath();
        //tape.clearRect(0, 0, 800, tape_height);
        tape.fillStyle = "rgb(255, 255, 255)";
        tape.fillRect(-100, -2, 800, tape_height+4);
        //tape.fillRect(0, 0, 800, tape_height);
        tape.fill();

        for (i in cells) {
            cells[i].draw();
        }
    }

    function drawHead(x) {

        
        head_area.beginPath();
        head_area.fillStyle = "rgb(255, 255, 255)";
        head_area.fillRect(-50, 0, 800, head_height);
        head_area.fill();


        head_area.beginPath();
        head_area.moveTo(x + cell_width/2, head_height);
        head_area.lineTo(x, head_height/2);
        head_area.lineTo(x + cell_width, head_height/2);
        head_area.closePath();
        head_area.fillStyle = "rgb(0, 0, 0)";
        head_area.fill();

        head_area.beginPath();
        head_area.font = '30px monospace';
        head_area.textBaseline = 'top';
        head_area.textAlign = 'center';
        head_area.fillText(tm.state(), x + cell_width / 2, 0);
    }
    
    function moveHead() {
        drawHead(tm.position() * cell_width);
    }

    function slideHead(from, to) {
        var res = 8;
        var segments = [];

        for (var i = 0;i<res;i++) {
            var x_val = i * (Math.PI/res);
            segments.push(Math.sin(x_val));    
        }

        console.debug(segments);

        var total = 0;
        for (var i in segments) {
            total += segments[i];
        }

        console.debug(total);

        var divisor = total / Math.abs(to - from);

        console.debug(divisor);
        var actualSegments = [];
        actualSegments[0] = segments[0];
        for (var i = 1;i<segments.length;i++) {
            actualSegments[i] = actualSegments[i-1] + segments[i]/divisor;
        }



        if (to < from) {
            actualSegments.reverse();
            for (var i in actualSegments) {
                actualSegments[i] += to;
            }
        } else {
            for (var i in actualSegments) {
                actualSegments[i] += from;
            }
        }

        console.debug(actualSegments);
        slideHeadStep(actualSegments, 0);
    }
    
    var slideTimer;
    function slideHeadStep(segments, current) {
        if (current == segments.length) {
            clearTimeout(slideTimer);
            return;
        }

        drawHead(segments[current]);
        //canvas.setLeft(-segments[current]);
        //drawTape();
        
        slideTimer = setTimeout(slideHeadStep, 20, segments, current + 1);
    }


    this.test = function() {
        slideHead(0, cell_width);
    }

    function Cell(contents, virtualCanvas) {
        
        this.contents = function() {
            return contents;
        }

        this.draw = function() {
            virtualCanvas.beginPath();
            virtualCanvas.strokeStyle = "rgb(0, 0, 0)";
            virtualCanvas.lineWidth = 2;

            virtualCanvas.beginPath;
            virtualCanvas.drawRect(0, 0, cell_width, tape_height);

           
            virtualCanvas.stroke();

            virtualCanvas.beginPath();
            virtualCanvas.fillStyle = "rgb(0, 0, 0)";
            
            virtualCanvas.font         = '30px monospace';
            virtualCanvas.textBaseline = 'top';
            virtualCanvas.textAlign = 'center';
            virtualCanvas.fillText  (contents, cell_width/2, 0);
        }

    }

    var timer;

    function animate() {
        
        animate_step();

        timer = setTimeout(animate, 100 * speed);
    }

    function animate_step() {
        if (tm.state() == "accept") {
            clearTimeout(timer);
            return;
        } else if (tm.state() == "reject") {
            clearTimeout(timer);
            return;
        }
        
        var current_position = tm.position() * cell_width;
        

        tm.step();
        prepare(tm.input());
        drawTape();
       
        var new_position = tm.position()*cell_width;

        console.debug("current_position: " + current_position);
        console.debug("new_position: " + new_position);

        slideHead(current_position, new_position);
        
    }

    function animate_unstep() {
        
        var current_position = tm.position() * cell_width;
        
        tm.unstep();

        prepare(tm.input());
        drawTape();

       
        var new_position = tm.position()*cell_width;

        slideHead(current_position, new_position);

    }

    this.animate_step = function() {
        animate_step();
    }

    this.animate_unstep = function() {
        animate_unstep();
    }

    this.animate = function() {
        running = 1;
        this.displayProperties();
        animate();
    }

    this.cancel = function() {
        running = 0;
        clearTimeout(timer);
    }

    this.pause = function() {
        running = 0;
        clearTimeout(timer);
    }


    this.running = function() {
        return running;
    }

}
