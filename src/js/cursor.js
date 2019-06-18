class Cursor {
	constructor(editor) {
		this.editor = editor;
		this.elementWithCursor = undefined;
	}

	setPosition(element = -1, offset = -1) {
		// -1 means the last element
		if (element === -1) {
			element = this.editor.children[this.editor.children.length - 1];
		} else {
			if (element <= his.editor.children.length - 1) {
				element = this.editor.children[element];
			} else {
				console.log("Error: That HTML element don't exist");
			}
		}

		// -1 means the greatest offset possible
		if (offset === -1) {
			element.innerHTML += '<span class="cursor"></span>';
		} else {
			// Find where to put it
		}

		this.elementWithCursor = element;
		this._update();
	}

	moveLeft() {
		let match = /<span class="cursor"><\/span>/.exec(this.elementWithCursor.innerHTML);
		if (match.index > 0) {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace('<span class="cursor"></span>', '');
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index - 1) + '<span class="cursor"></span>' + this.elementWithCursor.innerHTML.substr(match.index - 1);
		} else {
			if (this.elementWithCursor.previousElementSibling) {
				this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace('<span class="cursor"></span>', '');
				this.elementWithCursor = this.elementWithCursor.previousElementSibling;
				this.elementWithCursor.innerHTML += '<span class="cursor"></span>';
			}
		}
	}

	moveRight() {
		let match = /<span class="cursor"><\/span>/.exec(this.elementWithCursor.innerHTML);
		if (match.index < this.elementWithCursor.innerHTML.replace('<span class="cursor"></span>', '').length) {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace('<span class="cursor"></span>', '');
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index + 1) + '<span class="cursor"></span>' + this.elementWithCursor.innerHTML.substr(match.index + 1);
		} else {
			if (this.elementWithCursor.nextElementSibling) {
				this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace('<span class="cursor"></span>', '');
				this.elementWithCursor = this.elementWithCursor.nextElementSibling;
				this.elementWithCursor.innerHTML = '<span class="cursor"></span>' + this.elementWithCursor.innerHTML;
			}
		}
	}

	insertAtCursor(string) {
		this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace('<span class="cursor"></span>', string + '<span class="cursor"></span>');
	}

	deleteAtCursor() {
		let match = /<span class="cursor"><\/span>/.exec(this.elementWithCursor.innerHTML);
		this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index - 1) + this.elementWithCursor.innerHTML.substr(match.index);

	}

	/* Private
	   ======= */

	_update() {
		let cursor = document.getElementsByClassName('cursor')[0];
		/*let textWidth = this._textWidth(this.elementWithCursor, this.offset);
		cursor.style.left = this._getEditorPadding() + textWidth + 'px';*/
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
