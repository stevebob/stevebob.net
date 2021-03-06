
function Input(){}

Input.mousemove_callbacks = [];

Input.register_mousemove_callback = function(name, fn) {
    Input.mousemove_callbacks[name] = fn;
}

Input.keydown_callbacks = [];

Input.down_keys = [];

Input.is_down = function(keys) {
    var chars = keys.split("");

    for (var i in chars) {
        if (Input.down_keys[chars[i]]) {
            return true;
        }
    }
    return false;
}

Input.get_mouse_pos = function() {
    return Input.mouse_pos.slice(0);
}

Input.register_keydown_callback = function(name, keys, fn) {
    var chars = keys.split("");
    for (var i in chars) {
        var key = chars[i];
        if (Input.keydown_callbacks[key] == undefined) {
            Input.keydown_callbacks[key] = [];
        }
        Input.keydown_callbacks[key.toLowerCase()][name] = fn;
    }

}

Input.keyup_callbacks = [];
Input.register_keyup_callback = function(name, keys, fn) {
    var chars = keys.split("");
    for (var i in chars) {
        var key = chars[i];
        if (Input.keyup_callbacks[key] == undefined) {
            Input.keyup_callbacks[key] = [];
        }
        Input.keyup_callbacks[key.toLowerCase()][name] = fn;
    }
}

Input.charFromCode = function(code) {
    switch (code) {
        case 188: return ",";
        case 222: return "'";
        case 190: return ".";
        default:
            return String.fromCharCode(code).toLowerCase();
    }
}

Input.init = function() { 
    $(document).mousemove(function(e) {
        Input.mouse_x = e.pageX - Input.canvas_offset_x;
        Input.mouse_y = e.pageY - Input.canvas_offset_y;
        Input.mouse_pos[0] = Input.mouse_x;
        Input.mouse_pos[1] = Input.mouse_y;

        for (var callback in Input.mousemove_callbacks){ 
            Input.mousemove_callbacks[callback](Input.mouse_pos);
        }
    });

    $(document).keydown(function(e) {
        var key = Input.charFromCode(e.keyCode);

        if (Input.keydown_callbacks[key] != undefined) {

            for (var callback in Input.keydown_callbacks[key]) {
                if (!Input.is_down(key)) {
                    Input.keydown_callbacks[key][callback]();
                }
            }
        }
        
        Input.down_keys[key] = true;
    });

    $(document).keyup(function(e) {
        var key = Input.charFromCode(e.keyCode);

        Input.down_keys[key] = false;
        
        if (Input.keyup_callbacks[key] == undefined) {
            return;
        }

        for (var callback in Input.keyup_callbacks[key]) {
            Input.keydown_callbacks[key][callback]();
        }
    });

}

Input.set_canvas_offset = function(x, y) {
    Input.canvas_offset_x = x;
    Input.canvas_offset_y = y;
    Input.mouse_pos = [0, 0];
}

