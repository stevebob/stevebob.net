#!/usr/bin/perl
require "../sections.pl";

print "Content-type: html; charset=iso-8859-1\n\n";

opendir(DIR, ".");
@FILES = readdir(DIR);


&blindPrint("../glheader.html");
&blindPrint("lheader.html");

&sectionPrint("intro.html", 0);
&sectionPrint("while.html", 1);
&sectionPrint("for.html", 1);
&sectionPrint("nesting.html", 1);
&sectionPrint("infinite.html", 1);

&blindPrint("../bar.html");

&blindPrint("../end.html");

closedir(DIR);
