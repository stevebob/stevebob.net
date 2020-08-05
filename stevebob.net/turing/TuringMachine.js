
const HALT = 0;
const INIT = 1;
const NORM = 2;

const LEFT = 0;
const RIGHT = 1;

function State(name, type) {
    this.name = name;
    this.type = type;
    this.active = true;
}

function ThreeTuple(_1, _2, _3) {
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
}

function TuringMachine() {
    
    /* the characters this machine can read and write */
    this.characters = [" "];
    
    /* when a character is "deleted", it's just deactivated in the map */
    this.active_map = [];
    this.active_map[" "] = true;

    /* the indication of which characters can be written */
    this.output_map = [];
    this.output_map[" "] = true;

    /* whether each character can be deleted */
    this.can_delete = [];
    this.can_delete[" "] = false;
    
    

    /* these are the non-default mappings of the transition function */
    this.transition_function = [];
    this.states = [];



    this.add_character = function(ch, output) {
        console.debug("adding " + ch);
        if (this.active_map[ch] == undefined) {
            this.characters.push(ch);
            this.active_map[ch] = true;
            this.output_map[ch] = output;
            this.can_delete[ch] = true;
            
            for (var i = 0;i<this.states.length;i++) {
                this.transition_function[this.states[i].name][ch] = new ThreeTuple(this.states[i].name, ch, LEFT);
            }


        } else {
            this.active_map[ch] = true;
        }
    }

    this.delete_character = function(ch) {
        if (this.can_delete[ch]) {
            this.active_map[ch] = false;
        }
    }

    this.add_character("0", true);
    this.add_character("1", true);

    /* add a named state to the turing machines set of states */
    this.add_state = function(state_name, type) {
        /* add the state to the state list */
        this.states[this.states.length] = new State(state_name, type);

        /* initialize the transition function's mappings from this state */
        this.transition_function[state_name] = [];
        
        for (var i = 0;i<this.characters.length;i++) {
            if (this.transition_function[state_name][this.characters[i]] == undefined) {
                this.transition_function[state_name][this.characters[i]] = new ThreeTuple(state_name, this.characters[i], LEFT);
            }
        }
    }

    this.add_state("INIT", INIT);
    this.add_state("ACCEPT", HALT);
    this.add_state("REJECT", HALT);

    this.delete_state = function(state_name) {
        for (var i = 0;i<this.states.length;i++) {
            if (this.states[i].name == state_name) {
                this.states[i].active = false;
            }
        }
    }
    
    /* add a mapping to the transition function */
    this.add_mapping = function(from_state_name, input_char, to_state_name, output_char, direction) {
        assert(direction == LEFT || direction == RIGHT);

        /* save the tuple that the input maps to (which should already exist) */
//        var result = new ThreeTuple(to_state_name,
//        this.transition_function[from_state_no][input_char] = result;
        
    }

    this.state_by_name = function(state_name) {
        for (var i = 0;i<this.states.length;i++) {
            if (this.states[i].name == state_name) {
                return this.states[i];
            }
        }

        return null;
    }

    this.tape = [];
    this.head_pos = 0;
    this.current_state = this.state_by_name("INIT");

    this.set_tape = function(str) {
        var arr = str.split('');
        for (var i = 0;i<arr.length;i++) {
            if (this.active_map[arr[i]] == undefined || this.active_map[arr[i]] == false) {
                return false;
            }
        }
        this.tape = arr;
        return true;
    }

    this.reset = function() {
        this.head_pos = 0;
        this.current_state = this.state_by_name("INIT");
    }

    this.progress = function() {

        if (this.current_state.type == HALT) {
            return false;
        }

        var current_char = this.tape[this.head_pos];
        if (current_char == undefined) {
            current_char = ' ';
        }
        
        
        var next = this.transition_function[this.current_state.name][current_char];
        
        this.current_state = this.state_by_name(next._1);

        this.tape[this.head_pos] = next._2;
        
        if (next._3 == LEFT) {
            if (this.head_pos > 0) {
                this.head_pos--;
            }
        } else {
            this.head_pos++;
        }
        
        this.enlarge_if_necessary();

        return true;
    }

    this.enlarge_if_necessary = function() {
        if (this.head_pos >= this.tape.length) {
            this.tape[this.head_pos] = ' ';
        }
    }

}
