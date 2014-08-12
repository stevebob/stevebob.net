#!/bin/bash

rm -rf output

dir=`echo $1|sed -e 's/http:\/\/\(.*\)\//\1/g'`
rm -rf $dir

ruby generate.rb $1
cp -r resume output

mv output $dir
