
cd resume
erb resume.erb > resume.html
cp resume.html index.html
ruby compilepdf.rb
cp resume.pdf StephenSherrattResume.pdf
cd ..

if [ "$1" == "--short" ]
then
    rm -rf sbox.im
else
    rm -rf stevebob.net
fi

ruby generate.rb $1
cp -r resume output

if [ "$1" == "--short" ]
then 
    mv output sbox.im
else
    mv output stevebob.net
fi
