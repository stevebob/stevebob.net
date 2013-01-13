#include <stdio.h>
#include <string.h>

#define MAXLEN 30

struct date {
    int day;
    int month;
    int year;
}; //don't forget this semicolin

struct person {
    struct date birthday;
    char firstname[MAXLEN];
    char surname[MAXLEN];
    char gender;
}; //everyone always forgets this semicolin

int main(int argc, char *argv[]) {
    
    struct person student;

    student.gender = 'm';
    
    strcpy(student.firstname, "Steve");
    strcpy(student.surname, "Roberts");

    student.birthday.day = 12;
    student.birthday.month = 4;
    student.birthday.year = 1992;

    return 0;
}
