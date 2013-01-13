#include <stdio.h>
#include <string.h>

#define MAXLENGTH 20

void perm(char *str, int used[], int len, char *permStr, int n);

int main(int argc, char **argv) {

    char str[MAXLENGTH];
    printf("Enter string: ");
    scanf("%s", str);
    int len = strlen(str);
    int used[len];
    char permStr[len+1];
    int i;

    for (i = 0;i<len;i++) {
        used[i] = 0;
    }
    
    permStr[len] = '\0';
    
    printf("Permutations:\n");
    perm(str, used, len, permStr, 0);

    return 0;
}

void perm(char *str, int used[], int len, char *permStr, int n) {
    int i;
    int end = 1;

    for (i=0;i<len;i++) {
        if (!used[i]) {
            end = 0;

            used[i] = 1;
            
            permStr[n] = str[i];

            perm(str, used, len, permStr, n+1);

            used[i] = 0;
        }
    }

    if (end) {
        printf("%s\n", permStr);
    }
}



