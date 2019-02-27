class Cursor {
	constructor() {
		this.line = undefined;
		this.offset = undefined;
	}

	setPosition(line, offset) {
		this.line = line;
		this.offset = offset;
	}

	getPosition() {
		return {line: this.line, offset: this.offset};
	}

	moveLeft() {

	}

	moveRight(editor) {
		console.log("HI");
		let cursor = document.getElementsByClassName('cursor')[0];
		cursor.style.left = "0px";
	}


}
