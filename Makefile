SERVER=sherra.tt:
#SERVER=/home/steve

all: 
	./resume.sh
	./compile.sh
	./compile.sh --short
	./compile.sh --name

resume:
	./resume.sh

stevebob.net: resume
	./compile.sh

sbox.im: resume
	./compile.sh --short

blog.sherra.tt: resume
	./compile.sh --name

staging:
	./compile.sh --staging

sync:
	rsync -Pavz stevebob.net sbox.im blog.sherra.tt $(SERVER) 

clean:
	rm -rf output sbox.im blog.sherra.tt stevebob.net
