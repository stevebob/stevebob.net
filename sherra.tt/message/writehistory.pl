#!/usr/bin/perl

use CGI qw/:all/;

print "Content-type: text/plain; charset=iso-8859-1\n\n";

my $msg = param("msg");

open(FILE, ">> history.txt");

print FILE "\n------------------\n";
print FILE $msg;

close FILE;
