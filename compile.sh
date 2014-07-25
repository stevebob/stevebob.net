#!/bin/bash

rm -rf output

if test "$1" == "--short"
then
    rm -rf sbox.im
elif test "$1" == "--name"
then
    rm -rf blog.sherra.tt
else
    rm -rf stevebob.net
fi

ruby generate.rb $1
cp -r resume output

if test "$1" == "--short"
then 
    mv output sbox.im
elif test "$1" == "--name"
then
    mv output blog.sherra.tt
else
    mv output stevebob.net
fi
