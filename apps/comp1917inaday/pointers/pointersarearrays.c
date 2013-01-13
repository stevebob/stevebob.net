#include <stdio.h>

int main(int argc, char *argv[]) {

    int list[10] = {9, 2, 4, 5, 0, 8, 6, 7, 1, 3}; //some values
    int *p;
    int i;
    
    printf("The memory address of list[0] is: %p\n", &list[0]);
    printf("Actual value of list: %p\n", list);
    printf("Notice that they are the same.\n\n");

    printf("The value stored in list[0] is: %d\n", list[0]); 
    printf("If we dereference list with * we get: %d\n", *list);
    printf("These are also the same.\n");

    printf("The value stored in list[1] is: %d\n", list[1]);
    printf("If we dereference list + 1 we get: %d\n", *(list + 1));
    printf("These are also the same.\n");

    //make p point to list[0]
    p = &list[0];
    //it would be equivelent to say: p = list;

    //we can now use p as we would use list
    
    for (i = 0;i<10;i++) {
        printf("p[%d] = %d\n", i, p[i]);
    }

    //or eqivalently
    printf("And again...\n");

    for (i=0;i<10;i++) {
        printf("p[%d] = %d\n", i, *p);
        p++;
    }


    return 0;
}
