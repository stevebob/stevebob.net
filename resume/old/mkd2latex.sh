#!/bin/bash - 
#=============================================================================
#
#          FILE: mkd2latex.sh 
# 
#         USAGE: ./mkd2latex somefile.mkd <fontsize>
# 
#   DESCRIPTION: Converts markdown files to LaTeX and performs
#   various cleanup tasks for foreign characters, etc.
# 
#       OPTIONS: ---
#  REQUIREMENTS: multimarkdown, latex
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Jonathan Kulp (),
#  ORGANIZATION: 
#       CREATED: 10/14/2012 06:52:09 AM CDT
#      REVISION:  ---
#=============================================================================

# get the environment sorted out first

infile=$(readlink -f $1)
stem=$(basename $infile | sed -e 's/\..*$//')
basedir=$(dirname "$infile")
outdir="$basedir/out"
nohtml="$outdir/$stem-nohtml.mkd"
tempfile="$outdir/$stem.tmp"
outfile="$basedir/$stem.tex"
createdon=$(date +%m\/%d\/%Y,\ %r)

#---------------------------------------------------------------------------
# make a place to put the garbage
#---------------------------------------------------------------------------

if [ -e "$outdir" ] ; then
    echo "Output directory already exists"
  else
    mkdir "$outdir"
fi

#---------------------------------------------------------------------------
#  check to see if fontsize is specified, if not default to 11
#---------------------------------------------------------------------------
if [ -z "$2" ] ; then
    size="11"
  else
    size="$2"
fi

#---------------------------------------------------------------------------
#  Default output of multimarkdown has no preamble, do that here.
#  Change options as desired.
#---------------------------------------------------------------------------

preamble(){
cat >> $tempfile << EOFpreamble
  \documentclass[$size pt,oneside,letterpaper]{article} 
  \usepackage{fullpage,amsmath,tabu,hyperref} 
  \begin{document}
  \thispagestyle{empty}
EOFpreamble
} # ----------  end of function preamble ----------

remove_tags (){
  sed -f - $infile > $nohtml << EOFnotags
  s/]*>/#/
  s/]*>/##/
  s/]*>/###/
  s/<\/h[1-3]>//
EOFnotags
} # ----------  end of function remove_tags  ----------

run_multimarkdown(){
  multimarkdown -t latex $nohtml >> $tempfile
} # ----------  end of function run_multimarkdown ----------

#---------------------------------------------------------------------------
#   Put the LaTeX \end{document} command, creation date, etc.
#---------------------------------------------------------------------------
postamble(){
cat >> $tempfile << EOFpostamble
  \hspace*{\fill} \\\\
  \begin{center} \begin{small}
  This printer-friendly document was generated with \LaTeX \  on $createdon.
  \end{small} \end{center}
  \end{document}
EOFpostamble
} # ----------  end of function postamble ----------

#---------------------------------------------------------------------------
#  Convert any international characters to LaTeX's format, also
#  change to unnumbered sections and parts, change chapters to sections.
#  Get rid of autorefs like "Back to top"
#  Note that to insert a single quote ' you have to surround the
#  sed command with double quotes instead of the usual single
#  quotes.
#---------------------------------------------------------------------------

fixes(){
  sed -f - $tempfile > $outfile << EOFsed
  /label/d
  /<\/style>/d
  s/chapter/section/
  s/part{/part\*{/
  s/tion{/tion\*{/
  s/ó/\\\'{o}/g
  s/ñ/\\\~{n}/g
  s/ò/\\\`{o}/g
  s/è/\\\`{e}/g
  s/à/\\\`{a}/g
  s/á/\\\'{a}/g
  s/í/\\\'{i}/g
  s/ú/\\\'{u}/g
  s/ö/\\\"{o}/g
  s/ä/\\\"{a}/g
  s/ü/\\\"{u}/g
  s/é/\\\'{e}/g
EOFsed
} # ----------  end of function fixes ----------


#---------------------------------------------------------------------------
#  Compile the cleaned-up LaTeX code & output as pdf
#---------------------------------------------------------------------------

compile (){
  pdflatex -halt-on-error -output-format pdf --output-directory $outdir $outfile
  cp $outdir/$stem.pdf $basedir/$stem.pdf
}	# ----------  end of function compile  ----------


#---------------------------------------------------------------------------
#  Open it up in a pdf viewer
#---------------------------------------------------------------------------
preview (){
  xdg-open $basedir/$stem.pdf &
}	# ----------  end of function preview  ----------

#cd $basedir
preamble
remove_tags
run_multimarkdown
postamble
fixes
compile
preview

rm -rf $outdir

exit 0
