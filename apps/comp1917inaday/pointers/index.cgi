#!/usr/bin/perl
require "../sections.pl";

print "Content-type: html; charset=iso-8859-1\n\n";

opendir(DIR, ".");
@FILES = readdir(DIR);


&blindPrint("../glheader.html");
&blindPrint("lheader.html");

&sectionPrint("intro.html", 1);
&sectionPrint("pointers.html", 1);

&sectionPrint("pointersarrays.html", 0);
&sectionPrint("functions.html", 0);

&blindPrint("../bar.html");

&blindPrint("../end.html");

closedir(DIR);
