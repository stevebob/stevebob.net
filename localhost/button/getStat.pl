#!/usr/bin/perl


print "Content-type: text/plain; charset=iso-8859-1\n\n";
#print "hello Hello HELLO!";

open(FILE, "< status.txt");

while ( <FILE> ) {
    print;
}


close FILE;
