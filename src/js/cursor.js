class Cursor {
	constructor(editor) {
		this.editor = editor;
		this.elementWithCursor = undefined;
		this.cursor = '<cursor></cursor>';
		this.pixel_offset = -1;
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

		this.offset = -1;
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

		this.offset = -1;
	}

	moveUp() {
		// Get horizontal offset of cursor on pixels
		if (this.offset === -1) {
 			this.offset = this.elementWithCursor.getElementsByTagName('cursor')[0].offsetLeft;
		}

		// Find line with cursor
		let line = 0;
		let lines = this.elementWithCursor.innerHTML.split('<br>');
		for (let aux of lines) {
			if (aux.includes(this.cursor)) {
				break;
			}
			line++;
		}

		// Realocate cursor
		if (line !== 0) {
			lines[line] = lines[line].replace(this.cursor, '');
			let offset = this._findCharOffset(this.elementWithCursor, lines[line - 1], this.offset - this.elementWithCursor.offsetLeft);
			lines[line - 1] = lines[line - 1].substr(0, offset) + this.cursor + lines[line - 1].substr(offset);

			this.elementWithCursor.innerHTML = lines.join('<br>');
		} else {
			if (this.elementWithCursor.previousElementSibling) {
				lines[line] = lines[line].replace(this.cursor, '');
				this.elementWithCursor.innerHTML = lines.join('<br>');

				let prev = this.elementWithCursor.previousElementSibling;

				lines = prev.innerHTML.split('<br>');
				let offset = this._findCharOffset(prev, lines[lines.length - 1], this.offset - this.elementWithCursor.offsetLeft);
				lines[lines.length - 1] = lines[lines.length - 1].substr(0, offset) + this.cursor + lines[lines.length - 1].substr(offset);

				prev.innerHTML = lines.join('<br>');
				this.elementWithCursor = prev;
			}
		}
	}

	moveDown() {
		// Get horizontal offset of cursor on pixels
		if (this.offset === -1) {
			this.offset = this.elementWithCursor.getElementsByTagName('cursor')[0].offsetLeft;
		}

		// Find line with cursor
		let line = 0;
		let lines = this.elementWithCursor.innerHTML.split('<br>');
		for (let aux of lines) {
			if (aux.includes(this.cursor)) {
				break;
			}
			line++;
		}

		if (line !== lines.length - 1) {
			lines[line] = lines[line].replace(this.cursor, '');
			let offset = this._findCharOffset(this.elementWithCursor, lines[line + 1], this.offset - this.elementWithCursor.offsetLeft);
			lines[line + 1] = lines[line + 1].substr(0, offset) + this.cursor + lines[line + 1].substr(offset);

			this.elementWithCursor.innerHTML = lines.join('<br>');
		} else {
			if (this.elementWithCursor.nextElementSibling) {
				lines[line] = lines[line].replace(this.cursor, '');
				this.elementWithCursor.innerHTML = lines.join('<br>');

				let next = this.elementWithCursor.nextElementSibling;

				lines = next.innerHTML.split('<br>');
				let offset = this._findCharOffset(next, lines[0], this.offset - this.elementWithCursor.offsetLeft);
				lines[0] = lines[0].substr(0, offset) + this.cursor + lines[0].substr(offset);

				next.innerHTML = lines.join('<br>');
				this.elementWithCursor = next;
			}
		}
	}

	insertAtCursor(string) {
		let match = new RegExp(this.cursor).exec(this.elementWithCursor.innerHTML);

		if (string !== '\n') {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index) + string + this.elementWithCursor.innerHTML.substr(match.index);

			if (match.index < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}

		} else {
			let span = document.createElement('span');
			span.classList.add('paragraph');
			span.innerHTML = this.elementWithCursor.innerHTML.substr(match.index);

			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index);

			if (this.elementWithCursor.nextElementSibling) {
				this.editor.insertBefore(span, this.elementWithCursor.nextElementSibling);
			} else {
				this.editor.appendChild(span);
			}

			this._revaluate_element_class(this.elementWithCursor);
			this._revaluate_element_class(span);

			this.elementWithCursor = span;
		}
	}

	deleteAtCursor() {
		let match = new RegExp(this.cursor).exec(this.elementWithCursor.innerHTML);

		if (match.index !== 0) {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index - 1) + this.elementWithCursor.innerHTML.substr(match.index);

			if (match.index < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}
		} else {
			if (this.elementWithCursor.previousElementSibling) {
				this.moveLeft();
				this.elementWithCursor.innerHTML += this.elementWithCursor.nextElementSibling.innerHTML;
				this.editor.removeChild(this.elementWithCursor.nextElementSibling);
				this._revaluate_element_class(this.elementWithCursor);
			}
		}
	}

	/* Private
	   ======= */

	_restartAnimation(cursor) {
		let cln = cursor.cloneNode(true);
		cursor.parentNode.replaceChild(cln, cursor);
	}

	_revaluate_element_class(element) {
		let text = element.innerHTML.replace(this.cursor, '');
		console.log(text);

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

	_findCharOffset(context, string, pixelOffset) {
		let clone = context.cloneNode(false);
		clone.style.display = "inline-block";
		this.editor.appendChild(clone);

		let width = undefined;
		let offset = 0;
		while (offset <= string.length) {
			offset++;
			clone.innerHTML = string.substr(0, offset);

			if (clone.clientWidth > pixelOffset) {
				width = clone.clientWidth;
				break;
			}
		}
		clone.innerHTML = string.substr(0, offset - 1);
		let widthMinus1 = clone.clientWidth;

		if (pixelOffset - widthMinus1 < width - pixelOffset) {
			offset--;
		}

		this.editor.removeChild(clone);
		return offset;
	}
}
