SERVER=sherra.tt:
#SERVER=/home/steve

all: 
	./resume.sh
	./compile.sh 'http://sherra.tt/'
	./compile.sh 'https://sherra.tt/'
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
	rsync -Pavz stevebob.net sherra.tt secure.sherra.tt $(SERVER) 

clean:
	rm -rf output stevebob.net sherra.tt secure.sherra.tt
