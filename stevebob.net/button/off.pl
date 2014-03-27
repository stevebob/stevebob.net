#!/usr/bin/perl

print "Content-type: text/plain; charset=iso-8859-1\n\n";
print "oh look...you can read javascript...woah";
open(FILE, ">status.txt");

print FILE "0";

close FILE;
