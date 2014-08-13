#!/usr/bin/perl


print "Content-type: text/plain; charset=iso-8859-1\n\n";



open(FILE, "< msg.txt");

while ( <FILE> ) {
    print;
}

close FILE;
