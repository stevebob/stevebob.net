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

int gcd(int a, int b) {

    int i;
    int result = 1;
    
    int start;
    int found = FALSE;

    //find the lowest input
    if (a<b) {
        start = a;
    } else {
        start = b;
    }

    for (i=start;i>0 && !found;i--) {
        if (a%i == 0 && b%i == 0) {
            result = i;
            found = TRUE;
        }
    }

    return result;
}

