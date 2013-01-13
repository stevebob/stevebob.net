#!/usr/bin/perl
require "sections.pl";

print "Content-type: html; charset=iso-8859-1\n\n";
print "Location: htttp://comp1917.ripenetwork.com\n\n";

opendir(DIR, ".");
@FILES = readdir(DIR);


&blindPrint("header.html");

&blindPrint("content.html");

&sectionPrint("article.html");

&blindPrint("bar.html");


&blindPrint("end.html");

closedir(DIR);
