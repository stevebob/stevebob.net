#include <stdio.h>

#define SIZE 4

int main(int argc, char *argv[]) {

    int list[SIZE];
    int i;

    list[0] = 5;
    list[1] = 2;
    list[2] = 8;
    list[3] = 3;

    for (i = 0;i<SIZE;i++) {
        printf("list[%d] = %d\n", i, list[i]);
    }

    return 0;
}
