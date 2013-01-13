#include <stdio.h>

int main(int argc, char *argv[]) {
    int a = 5;
    int b = 3;

    int *p;

    p = &a;
    //store the address of a in p
    //p is said to "point to" a

    printf("The value of p is: %p\n", p);
    printf("The value pointed to by p is: %d\n", *p);

    //change the value of a
    a = 2;
    printf("Now the value pointed to by p is: %d\n", *p);

    *p = 4;
    printf("Now the value of a is: %d\n", a);
    
    //now p points to b
    p = &b;
    printf("Now the value of p is: %p\n", p);
    printf("And the value pointed to by p is: %d\n", *p);

    return 0;
}
