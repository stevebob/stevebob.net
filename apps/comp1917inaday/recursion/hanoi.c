#include <stdio.h>

int hanoi(int n, int from, int to, int spare);

int main(int argc, char **argv) {
    
    int n;

    printf("Enter number of discs: ");

    scanf("%d", &n);

    printf("How to move %d discs from tower 1 to tower 3:\n", n);

    hanoi(n, 1, 3, 2);

    return 0;
}

int hanoi(int n, int from, int to, int spare) {
    
    if (n == 1) {
        printf("move top of %d to %d leaving %d spare\n", 
                from, to, spare);
    } else {
        hanoi(n-1, from, spare, to);
        hanoi(1, from, to, spare);
        hanoi(n-1, spare, to, from);
    }

    return 0;
}
