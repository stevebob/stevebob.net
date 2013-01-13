#!/usr/bin/perl
require "../sections.pl";

print "Content-type: html; charset=iso-8859-1\n\n";

opendir(DIR, ".");
@FILES = readdir(DIR);


&blindPrint("../glheader.html");
&blindPrint("lheader.html");

&sectionPrint("Terminology.section", 0);
&sectionPrint("TerminalIntro.section", 1);
&sectionPrint("TextEditor.section", 1);
&sectionPrint("Compiler.section", 1);

&blindPrint("../bar.html");
&blindPrint("htmlEnd");

closedir(DIR);
