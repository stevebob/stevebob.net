#!/usr/bin/perl

print "Content-type: text/plain; charset=iso-8859-1\n\n";
print "you think your so clever...";
open(FILE, ">status.txt");

print FILE "1";

close FILE;
