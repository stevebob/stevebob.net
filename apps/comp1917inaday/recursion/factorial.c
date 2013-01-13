#include <stdio.h>

int fact(int n);

int main(int argc, char **argv) {
    
    int n;

    printf("Enter an integer: ");

    scanf("%d", &n);

    printf("%d! = %d\n", n, fact(n));

    return 0;
}

int fact(int n) {
    int val=1;

    if (n>0) {
        val = n*fact(n-1);
    }

    return val;
}
