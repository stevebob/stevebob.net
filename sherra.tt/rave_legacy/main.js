function main() {

    setUpCanvas();
    
    var squares = [];

    setMid();

    
    for (var i = 0;i<count;i++) {
        squares[i] = new Square(-mid_x + between*i, 0);
    }

    sine(squares);
}
