@lines = ();
foreach $i ("a".."d") {
    @row = ();
    foreach $j ("a".."d") {
        push @row, "this.$i$j * v.$j";
    }
    push @lines, (join " + ", @row);
}
print join ", \n", @lines;
