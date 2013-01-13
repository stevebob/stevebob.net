#include <stdio.h>

#define SIZE 10

void printList(int l[]);

int main(int argc, char *argv[]) {

    int list[SIZE] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

    printList(list);

    return 0;
}

void printList(int l[]) {
    int i;
    for (i = 0;i<SIZE;i++) {
        printf("%d\n", l[i]);
    }
}
