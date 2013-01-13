#include <stdio.h>

#define FALSE 0
#define TRUE 1

int gcd(int a, int b);

int main(int argc, char *argv[]) {

    int a, b;

    printf("Enter two integers: ");
    scanf("%d %d", &a, &b);

    printf("GCD: %d\n", gcd(a, b));

    return 0;
}

//the euclidean algorithm
int gcd(int a, int b) {

    int hi, lo;

    int rem;
    int found = FALSE;
    int result = 1; //this is given an initial value to keep
                    // the compiler happy

    if (a<b) {
        lo = a;
        hi = b;
    } else {
        lo = b;
        hi = a;
    }

    while (!found) {
        rem = hi % lo;

        if (rem == 0) {
            found = TRUE;
            result = lo;
        } else {
            hi = lo;
            lo = rem;
        }
    }

    return result;
}

