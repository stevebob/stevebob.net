#!/bin/bash

cd resume
erb resume.erb > resume.html
cp resume.html index.html
ruby compilepdf.rb
cp resume.pdf StephenSherrattResume.pdf
cd ..


