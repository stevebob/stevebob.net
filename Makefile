all:
	./compile.sh && ./compile.sh --short

sync:
	rsync -Pavz stevebob.net sbox.im: && rsync -Pavz sbox.im sbox.im:
