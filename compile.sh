#!/bin/bash

rm -rf output

if test "`echo $1|grep 'https://'`"; then
    dir=`echo $1|sed -e 's/https:\/\/\(.*\)\//secure.\1/g'`
else
    dir=`echo $1|sed -e 's/http:\/\/\(.*\)\//\1/g'`
fi

rm -rf $dir

ruby generate.rb $1
cp -r resume output

mv output $dir
