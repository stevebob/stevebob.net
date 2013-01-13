#!/usr/bin/perl
require "../sections.pl";

print "Content-type: html; charset=iso-8859-1\n\n";

opendir(DIR, ".");
@FILES = readdir(DIR);


&blindPrint("../glheader.html");
&blindPrint("lheader.html");

&sectionPrint("intro.html", 0);
&sectionPrint("return.html", 0);
&sectionPrint("sizeof.html", 1);
&sectionPrint("style.html", 1);
&sectionPrint("constants.html", 1);

&blindPrint("../bar.html");

&blindPrint("../end.html");

closedir(DIR);
