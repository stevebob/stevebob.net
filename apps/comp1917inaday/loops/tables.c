#include <stdio.h>

#define SIZE 12

int main(int argc, char *argv[]) {
    int table;
    int value;
    int i;

    printf("Which times table would you like: ");
    scanf("%d", &table);

    for (i = 1;i <= SIZE;i++) {
        value = i*table;
        printf("%d x %d = %d\n", table, i, value);
    }

    return 0;
}
