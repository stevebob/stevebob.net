#!/usr/bin/perl
require "../sections.pl";

print "Content-type: html; charset=iso-8859-1\n\n";

opendir(DIR, ".");
@FILES = readdir(DIR);


&blindPrint("../glheader.html");
&blindPrint("lheader.html");

&sectionPrint("intro.html", 1);
&sectionPrint("style.html", 1);
&sectionPrint("tips.html", 1);

&blindPrint("../bar.html", 1);

&blindPrint("../end.html");

closedir(DIR);
