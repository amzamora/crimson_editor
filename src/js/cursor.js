class Cursor {
	constructor(editor) {
		this.editor = editor;
		this.offset = 0;
		this.elementWithCursor = undefined;
		this.cursor = '<cursor></cursor>';
		this.pixelOffset = -1;
	}

	putOnEditor() {
		this.offset = this.editor.innerHTML.length;
		/*this.editor.innerHTML = this.cursor + this.editor.innerHTML;*/
	}

	moveLeft() {

	}

	moveRight() {

	}

	moveUp() {

	}

	moveDown() {

	}

	insertAtCursor(string) {

	}

	deleteAtCursor() {

	}
}
