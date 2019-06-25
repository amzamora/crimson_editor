class Cursor {
	constructor(editor) {
		this.editor = editor;
		this.elementWithCursor = undefined;
		this.offset = undefined; // Offset in the element as plain text

		this.cursor = '<cursor></cursor>';
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
			this.offset = element.innerHTML.length;
			element.innerHTML += this.cursor;
		} else {
			// Find where to put it
		}

		this.elementWithCursor = element;
	}

	moveLeft() {
		let match = new RegExp(this.cursor).exec(this.elementWithCursor.innerHTML);

		// If not at the start of element
		if (match.index > 0) {
			let aux = match.index - 1;
			if (this.elementWithCursor.innerHTML[aux] === '>') {
				while(this.elementWithCursor.innerHTML[aux] !== '<') {
					aux--;
				}
			}

			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace(this.cursor, '');
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, aux) + this.cursor + this.elementWithCursor.innerHTML.substr(aux);

		} else {
			if (this.elementWithCursor.previousElementSibling) {
				this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace(this.cursor, '');
				this.elementWithCursor = this.elementWithCursor.previousElementSibling;
				this.elementWithCursor.innerHTML += this.cursor;
			}
		}
	}

	moveRight() {
		let match = new RegExp(this.cursor).exec(this.elementWithCursor.innerHTML);
		this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace(this.cursor, '');

		// At the end of element
		if (match.index < this.elementWithCursor.innerHTML.length) {
			let aux = match.index;
			if (this.elementWithCursor.innerHTML[aux] === '<') {
				while(this.elementWithCursor.innerHTML[aux] !== '>') {
					aux++;
				}
			}
			aux++;

			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, aux) + this.cursor + this.elementWithCursor.innerHTML.substr(aux);

		} else {
			if (this.elementWithCursor.nextElementSibling) {
				this.elementWithCursor = this.elementWithCursor.nextElementSibling;
				this.elementWithCursor.innerHTML = this.cursor + this.elementWithCursor.innerHTML;
			} else {
				this.elementWithCursor.innerHTML += this.cursor;
			}
		}
	}

	moveUp() {
		// Get horizontal offset of cursor on pixels
		let horizontal_offset = this.elementWithCursor.getElementsByClassName('cursor')[0].offsetLeft;

		// Check if we are in the first line of the current element

		// Find where to put it
	}

	moveDown() {

	}

	insertAtCursor(string) {
		if (string !== '\n') {
			console.log(string.length);
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset) + string + this.elementWithCursor.innerHTML.substr(this.offset);
			this.offset += string.length;

			if (this.offset < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}

		} else {
			let span = document.createElement('span');
			span.classList.add('paragraph');
			span.innerHTML = this.elementWithCursor.innerHTML.substr(this.offset);

			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset);

			if (this.elementWithCursor.nextElementSibling) {
				this.editor.insertBefore(span, this.elementWithCursor.nextElementSibling);
			} else {
				this.editor.appendChild(span);
			}

			this._revaluate_element_class(this.elementWithCursor);
			this._revaluate_element_class(span);

			this.elementWithCursor = span;
			this.offset = 0;
		}
	}

	deleteAtCursor() {
		if (this.offset !== 0) {
			/*this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset - 1) + this.elementWithCursor.innerHTML.substr(this.offset);
			this.offset--;

			if (this.offset < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}*/
		} else {
			/*this.moveLeft();
			this.elementWithCursor.innerHTML += this.elementWithCursor.nextElementSibling.innerHTML;
			this.editor.removeChild(this.elementWithCursor.nextElementSibling);
			this._revaluate_element_class(this.elementWithCursor);*/
		}
	}

	/* Private
	   ======= */

	_restartAnimation(cursor) {
		let cln = cursor.cloneNode(true);
		cursor.parentNode.replaceChild(cln, cursor);
	}

	_putCursorOnText() {
		this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset) + this.cursor + this.elementWithCursor.innerHTML.substr(this.offset);
	}

	_revaluate_element_class(element) {
		let text = this._as_plain_text(element.innerHTML);

		if (text[0] === '#') {
			let i = 0;
			while (text[i] === '#') {
				i++;
			}

			if (text[i] === ' ' && i <= 3) {
				element.className = `h${i}`;
			} else {
				element.className = 'paragraph';
			}

		} else {
			element.className = 'paragraph';
		}
	}

	_get_line_height(element) {
		let clone = element.cloneNode();
		clone.innerHTML = 'a';
		this.editor.appendChild(clone);
		let line_height = clone.clientHeight;
		this.editor.removeChild(clone);

		return line_height;
	}
}
