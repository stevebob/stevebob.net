#include <stdio.h>

int power(int base, int index);

int main(int argc, char *argv[]) {

    int baseInput, indexInput;
    int answer;

    printf("Enter base: ");
    scanf("%d", &baseInput);

    printf("Enter index: ");
    scanf("%d", &indexInput);

    answer = power(baseInput, indexInput);
    printf("%d^%d = %d\n", baseInput, indexInput, answer);


    return 0;
}

int power(int base, int index) {
    int answer = 1;
    int i;

    for (i = 0;i<index;i++) {
        answer *= base;
    }

    return answer;
}
