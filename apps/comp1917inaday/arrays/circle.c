#include <stdio.h>

#define SIZE 30
#define RAD 10

int power(int base, int index);

int main(int argc, char *argv[]) {

    int grid[SIZE][SIZE]; //the grid that will store the circle

    int i, j; //counters

    int x, y; //for storing x and y values of points


    //store the circle
    for (i = 0;i<SIZE;i++) {
        
        y = i - SIZE/2;

        for (j = 0;j<SIZE;j++) {
            
            x = j - SIZE/2;
            
            //check if a the point lies in the circle
            if (power(x, 2) + power(y, 2) <= power(RAD, 2)) {
                //if so store a 1
                grid[j][i] = 1;
            } else {
                //otherwise store a 0
                grid[j][i] = 0;
            }
        }
    }

    //print a circle of hashes
    for (i = 0;i<SIZE;i++) {
        for (j = 0;j<SIZE;j++) {
            if (grid[j][i] == 1) {
                printf("#");
            } else {
                printf(" ");
            }
        }
        printf("\n");
    }



    return 0;
}

int power(int base, int index) {
    int answer = 1;
    int i;

    for (i = 0;i<index;i++) {
        answer *= base;
    }

    return answer;
}
