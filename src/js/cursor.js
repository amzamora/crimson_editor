class Cursor {
	constructor(editor) {
		this.editor = editor;
		this.elementWithCursor = undefined;
		this.offset = undefined; // Offset in the element as plain text
		this.cursor = '<span class="cursor"></span>';
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
		this.elementWithCursor.innerHTML = this._as_plain_text(this.elementWithCursor.innerHTML);

		// If not at the start of element
		if (this.offset > 0) {
			this.offset--;
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset) + this.cursor + this.elementWithCursor.innerHTML.substr(this.offset);

		} else {
			if (this.elementWithCursor.previousElementSibling) {
				this.elementWithCursor = this.elementWithCursor.previousElementSibling;
				this.offset = this.elementWithCursor.innerHTML.length;
				this.elementWithCursor.innerHTML += this.cursor;
			}
		}

		let match = /\w+<span class="cursor"><\/span>\w+/.exec(this.elementWithCursor.innerHTML);
		if (match) {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index) + '<span style="white-space: nowrap;">'+ match[0] + '</span>' + this.elementWithCursor.innerHTML.substr(match.index + match[0].length);
		}
	}

	moveRight() {
		this.elementWithCursor.innerHTML = this._as_plain_text(this.elementWithCursor.innerHTML);

		// At the end of element
		if (this.offset < this.elementWithCursor.innerHTML.replace(this.cursor, '').length) {
			this.offset++;
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset) + this.cursor + this.elementWithCursor.innerHTML.substr(this.offset);

		} else {
			if (this.elementWithCursor.nextElementSibling) {
				this.elementWithCursor = this.elementWithCursor.nextElementSibling;
				this.offset = 0;
				this.elementWithCursor.innerHTML = this.cursor + this.elementWithCursor.innerHTML;
			}
		}

		let match = /\w+<span class="cursor"><\/span>\w+/.exec(this.elementWithCursor.innerHTML);
		if (match) {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index) + '<span style="white-space: nowrap;">'+ match[0] + '</span>' + this.elementWithCursor.innerHTML.substr(match.index + match[0].length);
		}
	}

	moveUp() {
		// Get horizontal offset of cursor on pixels
		let horizontal_offset = this.elementWithCursor.getElementsByClassName('cursor')[0].offsetLeft;

		// Check if we are in the first line of the current element
		let line_height = this._get_line_height(this.elementWithCursor);
		let offset_top_element = this.elementWithCursor.offsetTop;
		let offset_top_cursor = this.elementWithCursor.getElementsByClassName('cursor')[0].offsetTop;

		console.log("line height: " + line_height);
		console.log("cursor_offset_height: " + this.elementWithCursor.getElementsByClassName('cursor')[0].offsetHeight);

		let line = 1;
		while(offset_top_element < offset_top_cursor) {
			offset_top_element += line_height;
			line++;
		}
		console.log(line);

		// Find where to put it
	}

	moveDown() {

	}

	insertAtCursor(string) {
		if (string !== '\n') {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset) + string + this.elementWithCursor.innerHTML.substr(this.offset);
			this.offset += string.length;

			if (this.offset < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}
		} else {
			this.elementWithCursor.innerHTML = this._as_plain_text(this.elementWithCursor.innerHTML);

			let span = document.createElement('span');
			span.classList.add('paragraph');

			span.innerHTML = this.cursor + this.elementWithCursor.innerHTML.substr(this.offset);
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset);
			this.offset = 0;

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
		if (this.offset !== 0) {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset - 1) + this.elementWithCursor.innerHTML.substr(this.offset);
			this.offset--;

			if (this.offset < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}
		} else {
			this.moveLeft();
			this.elementWithCursor.innerHTML += this.elementWithCursor.nextElementSibling.innerHTML;
			this.editor.removeChild(this.elementWithCursor.nextElementSibling);
			this._revaluate_element_class(this.elementWithCursor);
		}
	}

	/* Private
	   ======= */

	_restartAnimation(cursor) {
		let cln = cursor.cloneNode(true);
		cursor.parentNode.replaceChild(cln, cursor);
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

	_as_plain_text(string) {
		return string.replace(/(<span.*?>|<\/span>)/g, '');
	}

	_get_line_height(element) {
		let clone = element.cloneNode();
		clone.innerHTML = 'a';
		this.editor.appendChild(clone);
		let line_height = clone.offsetHeight;
		this.editor.removeChild(clone);

		return line_height;
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

}
