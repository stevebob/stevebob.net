#!/usr/bin/perl
1; #make sure we return true


sub codePrint {
    my ($name, $handle, $code) = @_;
    
    open FILE, $name or die $!;
    
    my @lines = <FILE>;
    my $count = 1;

    my $top = length(@lines);

    print "<div class='codeblock'>";
    if ($code) {
        print "<strong>Download: ";
        print "<a href='" . $name ."'>" . $name . "</a>";
        print "</strong></br>";

        print "<a href=\"javascript:toggleLineNos('" . $handle . "');\">Toggle Line Numbers</a>";
        
        print "<pre id='" . $handle . "lines"  ."' class='code'>";
    

        foreach(@lines) {
            my $line = &escape($_);
    
            print (sprintf("%0".$top."d", $count));
            print ": " . $line;
            $count++;
        }

        print "</pre>";

    }

    print "<pre id='" . $handle  . "nolines" . "' class='code'";
    
    if ($code) {
        print "style='display:none;'";
    }

    print ">";

    foreach(@lines) {
        my $line = &escape($_);

        print $line;
    }

    print "</pre>";
    print "</div>";
    close FILE;

}

sub escape {
    my ($line) = @_;
    
    $line =~ s/>/&gt/g;
    $line =~ s/</&lt/g;

    return $line;
}

sub sectionPrint {

    my ($name, $breaks) = @_;

    open FILE, $name or die $!;

    my $pre = 0;

    my @lines = <FILE>;
    
    print "<div class='section'>\n<p>\n";

    foreach(@lines) {
        my $line = $_;

        if ($line =~ m/codefile: (.*) handle: (.*) code: (.*)/) {
            &codePrint($1, $2, $3);
        } else {
        
            print $line;

            if ($line =~ m/<pre/) {
                $pre = 1;
            }
            if ($line =~ m/<\/pre>/) {
                $pre = 0;
            } else {

                if ($pre == 0 && $breaks == 1) {
                    print "</br>";
                }
            }
        }
    }

    print "</p>\n</div>\n";

    close FILE;
}

sub blindPrint {
    my ($name) = @_;

    open FILE, $name or die $!;
    my @lines = <FILE>;
    foreach(@lines) {
        print $_;
    }

    close FILE;
}
