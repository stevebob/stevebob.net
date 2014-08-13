function get_colour(val, rMin, rMax) {
    var red;
    var green;
    var blue;

    if (val >= rMax) {
        red = 0;
        green = 0;
        blue = 255;
    } else if (val <= rMin) {
        red = 0;
        green = 255;
        blue = 0;
    } else {
         n  = 1-(val - rMin)/(rMax - rMin);
    
    var expand = n*4;
    var section = Math.floor(expand);
    var progress = expand - section;




    if (section == -1) {
        red = 255;
        green = 0;
        blue = 255;
    } else if (section == 0) {
        red = 255 * progress;
        green = 0;
        blue = 255;
    } else if (section == 1) {
        red = 255;
        green = 0;
        blue = 255*(1-progress);
    } else if (section == 2) {
        red = 255;
        green = 255 * progress;
        blue = 0;
    } else if (section == 3) {
        red = 255 * (1-progress);
        green = 255;
        blue = 0;
    } else if (section == 4) {
        red = 255 * progress;
        green = 255;
        blue = 255 * progress;
    } else if (section == 6) {
        red = 255;
        green = 255;
        blue = 255;
    }
    }
    red = Math.floor(red);
    green = Math.floor(green);
    blue = Math.floor(blue);
    
    return "rgba(" + red + ", " + green + ", " + blue + ", 0.7)";
}
