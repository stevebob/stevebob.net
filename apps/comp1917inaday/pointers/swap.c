#include <stdio.h>

void swap(int *a, int *b);

int main(int argc, char *argv[]) {

    int a = 1;
    int b = 2;

    printf("a: %d\nb: %d\n", a, b);

    printf("Attempting swap...\n");
    swap(&a, &b);

    printf("a: %d\nb: %d\n", a, b);

    return 0;
}

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}
