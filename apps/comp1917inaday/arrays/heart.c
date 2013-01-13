#include <stdio.h>

#define HT 20
#define WD 30

float power(float base, int index);

int main(int argc, char *argv[]) {

    int grid[WD][HT]; //the grid that will store the shape

    int i, j; //counters

    float x, y; //for storing x and y values of points


    //store the heart shape as a grid of 1s and 0s
    for (i = 0;i<HT;i++) {
        
        y = (i - HT/2)/(HT/3.0);

        for (j = 0;j<WD;j++) {
            
            x = (j - WD/2)/(WD/2.5);
            
            //check if a the point lies in the heart shape
            if (power((power(x, 2) + power(y, 2) - 1), 3) - 
                (power(x, 2)*power(y, 3)) <= 0) {

                //if so store a 1
                grid[j][HT-i-1] = 1;
            } else {
                //otherwise store a 0
                grid[j][HT-i-1] = 0;
            }
        }
    }

    //print a heart of hashes
    for (i = 0;i<HT;i++) {
        for (j = 0;j<WD;j++) {
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

float power(float base, int index) {
    float answer = 1;
    int i;

    for (i = 0;i<index;i++) {
        answer *= base;
    }

    return answer;
}
