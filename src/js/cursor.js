class Cursor {
	constructor(editor) {
		this.line = undefined;
		this.offset = undefined;
		this.editor = editor;
		this.elementWithCursor = undefined;
	}

	setPosition(line, offset) {
		this.line = line;
		this.offset = offset;

		// Find html element where cursor should be
		let lineAux = 0;
		for (let child of this.editor.childNodes) {
			let nLines = child.innerHTML.split('\n');
			if (lineAux < line && line <= lineAux + nLines.length) {
				// Add cursor
				child.innerHTML = '<span class="cursor"></span>' + child.innerHTML;

				// Save reference
				this.elementWithCursor = child;
			}
		}

		this._update();
	}

	getPosition() {
		return {line: this.line, offset: this.offset};
	}

	moveLeft() {

	}

	moveRight() {
		this.offset += 1;
		this._update();
	}

	/* Private
	   ======= */

	_update() {
		let cursor = document.getElementsByClassName('cursor')[0];
		let textWidth = this._textWidth(this.elementWithCursor, this.offset);
		cursor.style.left = this._getEditorPadding() + textWidth + 'px';
		this._restartAnimation(cursor);
	}

	_getEditorPadding() {
		let padding = window.getComputedStyle(this.editor, null).getPropertyValue('padding-left');
		return Number(padding.substr(0, padding.length - 2));
	}

	_textWidth(element, offset) {
		// Get text until offset
		let text = element.innerHTML.replace(/<.*>/, '').substring(0, offset); // To change for inline elements

		// Put it on editor with same context
		let copy = document.createElement('span');
		for (let cls of element.classList) {
			copy.classList.add(cls);
		}
		copy.innerHTML = text;
		copy.style.display = "inline-block";
		copy.style.whiteSpace = "pre";

		element.parentNode.appendChild(copy);

		// Measure
		let width = copy.clientWidth;

		// Revert changes and return
		element.parentNode.removeChild(copy);

		return width;
	}

	_maxWidth() {
		return this.elementWithCursor.clientWidth;
	}

	_restartAnimation(cursor) {
		let cln = cursor.cloneNode(true);
		cursor.parentNode.replaceChild(cln, cursor);
	}
}
