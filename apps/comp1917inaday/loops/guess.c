#include <stdio.h>

#define ANSWER 42
#define MAXTRIES 10
#define FALSE 0
#define TRUE 1

int main(int argc, char *argv[]) {
    int guess;
    int solved = FALSE;
    int tries = MAXTRIES;

    printf("Try to guess the number (%d tries left): ", tries);

    while (!solved && tries > 0) {
        scanf("%d", &guess);
        tries--;

        if (guess > ANSWER) {
            printf("Too high. ");
        } else if (guess < ANSWER) {
            printf("Too low. ");
        } else {
            printf("Correct!\n");
            solved = TRUE;
        }

        if (solved) {
            printf("You got it in %d tries.\n", MAXTRIES - tries);
        } else if (tries > 0) {
            printf("Guess again (%d tries left): ", tries);
        } else {
            printf("No tries left.\nThe answer was: %d\n", ANSWER);
        }

    }
    

    return 0;
}

