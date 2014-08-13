SERVER=sherra.tt:
#SERVER=/home/steve

all: 
	./resume.sh
	./compile.sh 'http://sherra.tt/'
	./compile.sh 'http://blog.sherra.tt/'
	./compile.sh 'http://sbox.im/'
	./compile.sh 'http://stevebob.net/'

resume:
	./resume.sh

stagingserver:
	./resume.sh
	./compile.sh 'http://staging.stevebob.net/'

syncstaging:
	rsync -Pavz staging.stevebob.net $(SERVER) 

staging:
	./resume.sh
	./compile.sh 'http://localhost/'

sync:
	rsync -Pavz stevebob.net sbox.im blog.sherra.tt sherra.tt $(SERVER) 

clean:
	rm -rf output sbox.im blog.sherra.tt stevebob.net sherra.tt
