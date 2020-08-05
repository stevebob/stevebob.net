function GUI() {
    
    this.tm = new TuringMachine();

    var char_table = [];

    function state_html(state) {
        var html = 
'<div class="state_entry">' + 
'<div class="id">'+state.name+'</div>';

        if (state.type == NORM) {
            html +=
'<input type="button" class="delete_button" value="Delete" onclick="gui.delete_state(\'' + state.name +'\')"/>'
        }

        html +=
'</div>' + 
'<div class="divider"></div>';

        return html;
    }
    
    
    function function_html(tm, state, character) {
        
        var map = tm.transition_function[state.name][character];

        var html =        
'<tr class="function_entry">' +
'<td>&#948(' + state.name + ',</td><td>\'' + character + '\'</td><td>) = ( </td><td>' +
'<select id="'+state.name+'|'+character+'|state" onchange="gui.update_fn(\''+state.name+'\', \''+character+'\')">';
        for (var i = 0;i<tm.states.length;i++) {
            if (tm.states[i].active) {
                html +=
'<option value="' + tm.states[i].name + '"';
                if (tm.states[i].name == map._1) {
                    html +=
' selected="selected"';
                }

                html +=
'>' + tm.states[i].name + '</option>';
            }
        }
        
        html +=
'</select>' +
',</td><td>' +
'<select id="'+state.name+'|'+character+'|character" onchange="gui.update_fn(\''+state.name+'\', \''+character+'\')">';
    
        for (var i = 0;i<tm.characters.length;i++) {
            if (tm.active_map[tm.characters[i]]) {
                html +=
'<option value="' + tm.characters[i] + '"';
                
                if (map._2 == tm.characters[i]) {
                    html +=
' selected="selected"';
                }

                html +=
'>\'' + tm.characters[i] + '\'</option>';
            }
        }

        html +=
'</select>' +
',</td><td>' +
'<select id="'+state.name+'|'+character+'|direction" onchange="gui.update_fn(\''+state.name+'\', \''+character+'\')">' +
'    <option value="left"';
        if (map._3 == LEFT) {
            html +=
' selected="selected"';
        }

        html +=
'>LEFT</option>' +
'    <option value="right"';
        if (map._3 == RIGHT) {
            html +=
' selected="selected"';
        }
        html +=
'>RIGHT</option>' +
'</select>' +
' )</td>' +
'</tr>'; 

    return html;

    }

    this.characters_changed = function() {
        var chars = document.getElementById("alphabet_field").value;
        var char_array = chars.split('');

        var new_table = [];

        /* work out which characters need to be added */
        for (var i = 0;i<char_array.length;i++) {
            if (char_table[char_array[i]] == undefined) {
                this.tm.add_character(char_array[i], true);
            }
            new_table[char_array[i]] = 1;
        }

        for (var i = 0;i<this.tm.characters.length;i++) {
            if (this.tm.can_delete[this.tm.characters[i]] && this.tm.active_map[this.tm.characters[i]]) {
                if (new_table[this.tm.characters[i]] == undefined) {
                    this.tm.delete_character(this.tm.characters[i]);
                }
            }
        }

        this.update();
    }

    
    this.update = function() {
        var buffer = "";
        for (var i=0;i<this.tm.states.length;i++) {
            if (this.tm.states[i].active) {
                buffer += state_html(this.tm.states[i]);
            }
        }
        document.getElementById("state_list").innerHTML = buffer;

        document.getElementById("state_name_field").value = "q" + (this.tm.states.length-3);

        buffer = "";
        for (var i=0;i<this.tm.states.length;i++) {
            if (this.tm.states[i].active && this.tm.states[i].type != HALT) {
                for (var j = 0;j<this.tm.characters.length;j++) {
                    if (this.tm.active_map[this.tm.characters[j]]) {
                        buffer += function_html(this.tm, this.tm.states[i], this.tm.characters[j]);    
                    }
                }
            }
        }
        document.getElementById("function_list").innerHTML = buffer;

        char_table = [];
        buffer = "";
        for (var i = 0;i<this.tm.characters.length;i++) {
            if (this.tm.can_delete[this.tm.characters[i]] && this.tm.active_map[this.tm.characters[i]]) {
                char_table[this.tm.characters[i]] = 1;
                buffer += this.tm.characters[i];
            }
        }
        document.getElementById("alphabet_field").value = buffer;


    }

    this.test = function() {
        this.update();
    }

    this.add_state = function() {
        var name = document.getElementById("state_name_field").value;
        this.tm.add_state(name, NORM);
        this.update();
    }

    this.delete_state = function(name) {
        this.tm.delete_state(name);
        this.update();
    }

    this.update_fn = function(state_name, character) {
        var output_state = document.getElementById(state_name + '|' + character + '|state').value;
        var output_character = document.getElementById(state_name + '|' + character + '|character').value;
        var output_direction_str = document.getElementById(state_name + '|' + character + '|direction').value;

        var output_direction;
        if (output_direction_str == "left") {
            output_direction = LEFT;
        } else {
            output_direction = RIGHT;
        }


        var map = this.tm.transition_function[state_name][character];
        map._1 = output_state;
        map._2 = output_character;
        map._3 = output_direction;

        //this.update();
    }

    this.stack = [];
    this.step_count = 0;

    this.prepare = function() {
        this.stack = [];
        this.step_count = 0;
        this.tm.reset();
        clearTimeout(t);

        var input = document.getElementById("tape_input").value;
        if (this.tm.set_tape(input)) {
            this.config_update();
        } else {
            alert("Invalid character in input tape.");
        }
    }
    
    this.start_emulation = function() {
        this.stack = [];
        this.step_count = 0;
        this.tm.reset();
        clearTimeout(t);
        var input = document.getElementById("tape_input").value;
        if (this.tm.set_tape(input)) {
            this.config_update();
            start_progress_loop();
        } else {
            alert("Invalid character in input tape.");
        }
    }

    this.resume_emulation = function() {
        start_progress_loop();  
    }

    this.pause_emulation = function() {
        clearTimeout(t);
        running = false;
    }

    this.config_update = function() {

        document.getElementById("current_state_name").innerHTML = this.tm.current_state.name;
        document.getElementById("current_head_position").innerHTML = this.tm.head_pos;
        buffer = "";
        var head_buffer = "";
        var index_buffer = "";
        var input_buffer = "";
        for (var i = 0;i<this.tm.tape.length;i++) {
            
            buffer +=
"<td class='tape_cell'>" + this.tm.tape[i] + "</td>";
            head_buffer += "<td class='head_cell' id='head_position_" + i + "'> </td>";
            index_buffer += "<td class='index_cell'>" + i + "</td>";
            input_buffer += this.tm.tape[i];
        }
        document.getElementById("tape_row").innerHTML = buffer;
        document.getElementById("head_row").innerHTML = head_buffer;
        document.getElementById("index_row").innerHTML = index_buffer;

        for (var i = 0;i<this.tm.tape.length;i++) {
            var str = "head_position_" + i;
            document.getElementById(str).innerHTML = "";
        }
        var str = "head_position_" + this.tm.head_pos;
        
        document.getElementById(str).innerHTML = "&#8659";

        document.getElementById("current_step_count").innerHTML = this.step_count;

        document.getElementById("tape_input").value = input_buffer;
    }

    this.progress = function() {
        var frame = new ThreeTuple(this.tm.current_state, this.tm.head_pos, this.tm.tape[this.tm.head_pos]);
        if (this.tm.progress()) {
            this.step_count++;
            this.config_update();
            this.stack.push(frame);
        } else {
            running = false;
            clearTimeout(t);
        }
    }

    this.rewind = function() {
        if (this.step_count == 0) {
            return;
        }
        var last = this.stack.pop();
        this.tm.current_state = last._1;
        this.tm.head_pos = last._2;
        this.tm.tape[last._2] = last._3;
        this.step_count--;
        this.config_update();
    }

    this.change_tape = function() {
        var input = document.getElementById("tape_input").value;
        this.tm.set_tape(input);
        this.config_update();
    }

    
    /* all zeroes */
    this.example_0 = function() {

        this.tm.transition_function["INIT"][' ']._1 = "ACCEPT";
        this.tm.transition_function["INIT"]['0']._1 = "INIT";
        this.tm.transition_function["INIT"]['0']._3 = RIGHT;
        this.tm.transition_function["INIT"]['1']._1 = "REJECT";

        this.update();
        
        document.getElementById("tape_input").value = "00001011010";

        this.prepare();
    }

    /* symetrical 1s and 0s */
    this.example_1 = function() {

this.tm.transition_function['INIT'][' ']._1 = 'ACCEPT';
this.tm.transition_function['INIT'][' ']._2 = ' ';
this.tm.transition_function['INIT'][' ']._3 = 0;
this.tm.transition_function['INIT']['0']._1 = 'q2 - 0 walk';
this.tm.transition_function['INIT']['0']._2 = ' ';
this.tm.transition_function['INIT']['0']._3 = 1;
this.tm.transition_function['INIT']['1']._1 = 'q0 - 1 walk';
this.tm.transition_function['INIT']['1']._2 = ' ';
this.tm.transition_function['INIT']['1']._3 = 1;
this.tm.add_state('q0 - 1 walk', NORM);
this.tm.transition_function['q0 - 1 walk'][' ']._1 = 'q1 - 1 check';
this.tm.transition_function['q0 - 1 walk'][' ']._2 = ' ';
this.tm.transition_function['q0 - 1 walk'][' ']._3 = 0;
this.tm.transition_function['q0 - 1 walk']['0']._1 = 'q0 - 1 walk';
this.tm.transition_function['q0 - 1 walk']['0']._2 = '0';
this.tm.transition_function['q0 - 1 walk']['0']._3 = 1;
this.tm.transition_function['q0 - 1 walk']['1']._1 = 'q0 - 1 walk';
this.tm.transition_function['q0 - 1 walk']['1']._2 = '1';
this.tm.transition_function['q0 - 1 walk']['1']._3 = 1;
this.tm.add_state('q1 - 1 check', NORM);
this.tm.transition_function['q1 - 1 check'][' ']._1 = 'ACCEPT';
this.tm.transition_function['q1 - 1 check'][' ']._2 = ' ';
this.tm.transition_function['q1 - 1 check'][' ']._3 = 0;
this.tm.transition_function['q1 - 1 check']['0']._1 = 'REJECT';
this.tm.transition_function['q1 - 1 check']['0']._2 = '0';
this.tm.transition_function['q1 - 1 check']['0']._3 = 0;
this.tm.transition_function['q1 - 1 check']['1']._1 = 'q4 - return';
this.tm.transition_function['q1 - 1 check']['1']._2 = ' ';
this.tm.transition_function['q1 - 1 check']['1']._3 = 0;
this.tm.add_state('q2 - 0 walk', NORM);
this.tm.transition_function['q2 - 0 walk'][' ']._1 = 'q3 - 0 check';
this.tm.transition_function['q2 - 0 walk'][' ']._2 = ' ';
this.tm.transition_function['q2 - 0 walk'][' ']._3 = 0;
this.tm.transition_function['q2 - 0 walk']['0']._1 = 'q2 - 0 walk';
this.tm.transition_function['q2 - 0 walk']['0']._2 = '0';
this.tm.transition_function['q2 - 0 walk']['0']._3 = 1;
this.tm.transition_function['q2 - 0 walk']['1']._1 = 'q2 - 0 walk';
this.tm.transition_function['q2 - 0 walk']['1']._2 = '1';
this.tm.transition_function['q2 - 0 walk']['1']._3 = 1;
this.tm.add_state('q3 - 0 check', NORM);
this.tm.transition_function['q3 - 0 check'][' ']._1 = 'ACCEPT';
this.tm.transition_function['q3 - 0 check'][' ']._2 = ' ';
this.tm.transition_function['q3 - 0 check'][' ']._3 = 0;
this.tm.transition_function['q3 - 0 check']['0']._1 = 'q4 - return';
this.tm.transition_function['q3 - 0 check']['0']._2 = ' ';
this.tm.transition_function['q3 - 0 check']['0']._3 = 0;
this.tm.transition_function['q3 - 0 check']['1']._1 = 'REJECT';
this.tm.transition_function['q3 - 0 check']['1']._2 = '1';
this.tm.transition_function['q3 - 0 check']['1']._3 = 0;
this.tm.add_state('q4 - return', NORM);
this.tm.transition_function['q4 - return'][' ']._1 = 'INIT';
this.tm.transition_function['q4 - return'][' ']._2 = ' ';
this.tm.transition_function['q4 - return'][' ']._3 = 1;
this.tm.transition_function['q4 - return']['0']._1 = 'q4 - return';
this.tm.transition_function['q4 - return']['0']._2 = '0';
this.tm.transition_function['q4 - return']['0']._3 = 0;
this.tm.transition_function['q4 - return']['1']._1 = 'q4 - return';
this.tm.transition_function['q4 - return']['1']._2 = '1';
this.tm.transition_function['q4 - return']['1']._3 = 0;
this.update();
document.getElementById('tape_input').value = '11011011';
this.prepare();
    }


    this.extract = function() {
        
        var buffer = "";
        for (var i=0;i<this.tm.states.length;i++) {
            if (this.tm.states[i].active && this.tm.states[i].type != HALT) {
                
                if (this.tm.states[i].type == NORM) {
                    buffer +=
"gui.tm.add_state('" + this.tm.states[i].name + "', NORM);";
                }

                for (var j = 0;j<this.tm.characters.length;j++) {
                    if (this.tm.active_map[this.tm.characters[j]]) {
                        buffer += 
"gui.tm.transition_function['" + this.tm.states[i].name + "']['" + this.tm.characters[j] + "']._1 = '" +
this.tm.transition_function[this.tm.states[i].name][this.tm.characters[j]]._1 + "';";

                        buffer += 
"gui.tm.transition_function['" + this.tm.states[i].name + "']['" + this.tm.characters[j] + "']._2 = '" +
this.tm.transition_function[this.tm.states[i].name][this.tm.characters[j]]._2 + "';";

                        buffer += 
"gui.tm.transition_function['" + this.tm.states[i].name + "']['" + this.tm.characters[j] + "']._3 = " +
this.tm.transition_function[this.tm.states[i].name][this.tm.characters[j]]._3 + ";";
                    }
                }
            }
        }

        buffer += "gui.update();\n";

        buffer += 
"document.getElementById('tape_input').value = '" + 
document.getElementById('tape_input').value + "';";

        buffer += "gui.prepare();";

        console.debug(buffer);

    }
}


var t;
function start_progress_loop() {
    running = true;
    t = setTimeout(progress_loop, delay);
}

var delay = 250;
var running = false;
function progress_loop() {
    gui.progress();

    if (running) {
        t = setTimeout(progress_loop, delay);
    }
}
