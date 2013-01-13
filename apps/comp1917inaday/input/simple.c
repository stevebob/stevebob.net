#include <stdio.h>

int main(int argc, char *argv[]) {
    char ch1, ch2, ch3;

    printf("Enter some text:\n");

    ch1 = getchar();
    ch2 = getchar();
    ch3 = getchar();

    printf("ch1 = %c\nch2 = %c\nch3 = %c\n", ch1, ch2, ch3);

    return 0;
}
