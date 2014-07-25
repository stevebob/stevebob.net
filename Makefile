#SERVER=sherra.tt:
SERVER=/home/steve

all:
	./compile.sh && ./compile.sh --short && ./compile.sh --name

sync:
	rsync -Pavz stevebob.net $(SERVER) && rsync -Pavz sbox.im $(SERVER) && rsync -Pavz blog.sherra.tt $(SERVER) 
