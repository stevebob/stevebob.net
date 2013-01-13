function factorial(n) {
    var value;
    if (n > 1) {
        value = n * factorial(n-1);
    } else {
        value = 1;
    }
    return value;
}

