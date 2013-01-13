#include <stdio.h>
#include <string.h>

#define MAXLEN 20

int main(int argc, char *argv[]) {
    char message[MAXLEN] = {'h', 'e', 'l', 'l', 'o', '\0'};
    char new[MAXLEN];
    
    printf("%s\n", message);

    
    printf("length of string:%d\n", (int)strlen(message));

    //concatonate
    strcat(message, "world");
    printf("%s\n", message);
    
    //copy - new = message will NOT work
    strcpy(new, message);

    printf("new string: %s\n", new);


    return 0;
}
