#include <stdio.h>

int gcd(int a, int b);

int main(int argc, char *argv[]) {

    int a, b;

    printf("Enter two integers: ");
    scanf("%d %d", &a, &b);

    printf("GCD: %d\n", gcd(a, b));

    return 0;
}

//note that this is known as a naive solution
int gcd(int a, int b) {

    int i;
    int result = 1;

    for (i=1;i<a && i<b;i++) {
        if (a%i == 0 && b%i == 0) {
            result = i;
        }
    }

    return result;
}

