function makeCounter() {
	let i = 0;
	return function() {
		i += 1;
		return i;
	}
}
count = makeCounter();

class Cursor {
	constructor(offset, buffer) {
		if (offset < 0 || offset > buffer.length()) {
			throw new Error("Initial offset for cursor is invalid.");
		}

		this.offset = offset;
		this.number = count();
	}

	moveLeft(buffer) {
		if (this.offset > 0) {
			this.offset -= 1;
		}
	}

	moveRight(buffer) {
		if (this.offset < buffer.length()) {
			this.offset += 1;
		}
	}

	moveUp(buffer) {

	}

	moveDown(buffer) {

	}
}
