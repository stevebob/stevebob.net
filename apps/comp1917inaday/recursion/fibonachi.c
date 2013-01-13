#include <stdio.h>

#define MAX 10

int fib(int n);

int main(int argc, char **argv) {
    
    int i;

    for (i=0;i<MAX;i++) {
        printf("%d\n", fib(i));
    }

    return 0;
}

int fib(int n) {
    
    int val;
    
    if (n == 0 || n == 1) {
        val = 1;
    } else {
        val = fib(n - 1) + fib(n - 2);
    }


    return val;
}
