#include <stdio.h>

int main(int argc, char *argv[]) {
    int input;

    printf("Enter an integer: ");
    scanf("%d", &input);

    if (input % 2 == 0 || input % 3 == 0) {
        printf("The number is divisible by 2 or 3.\n");
    } else {
        printf("The number is not divisible by 2 or 3.\n");
    }

    return 0;
}
