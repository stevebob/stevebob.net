#include <stdio.h>

#define MAXLEN 20

int myStrLen(char *string);
void myStrCat(char *string, char *end);
void myStrCpy(char *dest, char *source);

int main(int argc, char *argv[]) {
    char message[MAXLEN] = {'h', 'e', 'l', 'l', 'o', '\0'};
    char new[MAXLEN];
    
    printf("%s\n", message);

    
    printf("length of string:%d\n", myStrLen(message));

    //concatonate
    myStrCat(message, "world");
    printf("%s\n", message);
    
    //copy - new = message will NOT work
    myStrCpy(new, message);

    printf("new string: %s\n", new);


    return 0;
}

int myStrLen(char *string) {
    int length = 0;

    while (string[length] != '\0') {
        length++;
    }

    return length;
}

void myStrCat(char *string, char *end) {

    int leftLen = myStrLen(string);
    int rightLen = myStrLen(end);
    
    int totalLen = leftLen + rightLen;

    int i;
    for (i = leftLen;i<totalLen;i++) {
        string[i] = end[i - leftLen];
    }
}

void myStrCpy(char *dest, char *source) {
    
    int i;

    for (i = 0;source[i] != '\0';i++) {
        dest[i] = source[i];
    }
    dest[i] = '\0';
}
    
