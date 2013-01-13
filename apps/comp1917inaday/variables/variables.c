#include <stdio.h>

int main(int argc, char *argv[]) {
    int number = 4;
    char letter;

    printf("The value of number is: %d\n", number);

    number = number + 2; //add 2 to the number
    printf("The value of number is: %d\n", number);

    number += 2; //+= means "increment by".
                 //this line has the same effect as line 8
                 //the "+" can be replaced by other signs
    printf("The value of number is: %d\n", number);
    
    number *= 3; //multiply by 3
    printf("The value of number is: %d\n", number);
    
    number++; //++ means "increment by 1"
              //-- can be used to decrement
    printf("The value of number is: %d\n", number);

    number = number % 2; // % is the syntax for modulo
    printf("The value of number is: %d\n", number);

    letter = 'a';

    printf("\nletter: %c\n", letter);
    printf("The ASCII value of letter is: %d\n", letter);

    return 0;
}
