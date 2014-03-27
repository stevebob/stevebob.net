
cd resume
erb resume.erb > resume.html
cp resume.html index.html
ruby compilepdf.rb
cd ..

rm -r stevebob.net
ruby generate.rb $1;
cp -r resume output
mv output stevebob.net
