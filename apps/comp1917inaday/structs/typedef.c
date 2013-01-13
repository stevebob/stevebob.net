#include <stdio.h>
#include <string.h>

#define MAXLEN 30

typedef struct date Date;

struct date {
    int day;
    int month;
    int year;
}; //don't forget this semicolin

typedef struct person Person;

struct person {
    Date birthday;
    char firstname[MAXLEN];
    char surname[MAXLEN];
    char gender;
}; //everyone always forgets this semicolin

int main(int argc, char *argv[]) {
    
    Person student;

    student.gender = 'm';
    
    strcpy(student.firstname, "Steve");
    strcpy(student.surname, "Roberts");

    student.birthday.day = 12;
    student.birthday.month = 4;
    student.birthday.year = 1992;

    return 0;
}
