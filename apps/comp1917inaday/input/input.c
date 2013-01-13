#include <stdio.h>

#define PI 3.14159

int main(int argc, char *argv[]) {
    
    int radius;
    int height;
    float volume;

    printf("Enter radius, then height (integers): ");

    scanf("%d %d", &radius, &height);
    
    volume = PI * radius * radius * height;

    printf("The volume is: %f\n", volume);

    return 0;
}
