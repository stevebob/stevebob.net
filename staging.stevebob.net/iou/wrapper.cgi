#!/usr/bin/perl
use CGI qw(:standard);

print "Content-type: text/html; charset=iso-8859-1\n\n";

sub formatHTMLPayment {
    my ($text) = @_;
    return "<div class=\"pay\">" . $text . "</div>";
}

sub formatHTMLError {
    my ($text) = @_;
    return "<div class=\"error\">" . $text . "</div>";
}


$names = param("names"); #"steve,chris,john";
$amounts = param("amounts"); #"12,14,16";

$i=0;
@nameList;
while ($names =~ /([A-Za-z0-9]+)/g) { 
    @nameList[$i] = $1;
    $i = $i + 1;
}

$i=0;
@amountsList;
while ($amounts =~ /([0-9\.]+)/g) { 
    @amountsList[$i] = $1;
    $i = $i + 1;
}


$args = "";
while (<@amountsList>) {
    $args.=($_." ");
}



$result = `./iou $args`;

#print $result;


while ($result =~ /([0-9]*) -> ([0-9]*) : \$([0-9\.]*)/g) {
    print &formatHTMLPayment(@nameList[$1] . " pays " . @nameList[$2] . " \$" . $3 . ".");
}

if ($result =~ /error: ([0-9\.]+)/) {
    print "Inaccuracy: " . $1;
}


