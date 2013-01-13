#include <stdio.h>

int main(int argc, char *argv[]) {
    int number;
    char letter;
    
    printf("Size of integer: %lu\n"
            "Size of character: %lu\n"
            "Size of float: %lu\n"
            "Size of double: %lu\n", 
            sizeof(number), sizeof(letter),
            sizeof(float), sizeof(double));

    return 0;
}
