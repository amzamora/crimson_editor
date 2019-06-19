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
		
		// At the start of element
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

		// At the end of element
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

	moveUp() {
		// Get horizontal offset of cursor on pixels
		let horizontal_offset = this.elementWithCursor.getElementsByClassName('cursor')[0].offsetLeft;

		// Check if we are in the first line of the current element
		let line_height = this._get_line_height(this.elementWithCursor);
		let offset_top_element = this.elementWithCursor.offsetTop;
		let offset_top_cursor = this.elementWithCursor.getElementsByClassName('cursor')[0].offsetTop;

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
			let match = /<span class="cursor"><\/span>/.exec(this.elementWithCursor.innerHTML);
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.replace('<span class="cursor"></span>', string + '<span class="cursor"></span>');

			if (match.index < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}
		} else {
			let span = document.createElement('span');
			span.classList.add('paragraph');

			let match = /<span class="cursor"><\/span>/.exec(this.elementWithCursor.innerHTML);
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
		let match = /<span class="cursor"><\/span>/.exec(this.elementWithCursor.innerHTML);
		if (match.index !== 0) {
			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, match.index - 1) + this.elementWithCursor.innerHTML.substr(match.index);

			if (match.index < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}
		} else {
			this.moveLeft();
			this.elementWithCursor.innerHTML += this.elementWithCursor.nextElementSibling.innerHTML;
			this.editor.removeChild(this.elementWithCursor.nextElementSibling);
		}
	}

	/* Private
	   ======= */

	_update() {
		let cursor = document.getElementsByClassName('cursor')[0];
		/*let textWidth = this._textWidth(this.elementWithCursor, this.offset);
		cursor.style.left = this._getEditorPadding() + textWidth + 'px';*/
		this._restartAnimation(cursor);
	}

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
		return string.replace(/<span.*>.*<\/span>/g, '');
	}

	_get_line_height(element) {
		let clone = element.cloneNode();
		clone.innerHTML = 'a';
		this.editor.appendChild(clone);
		let line_height = clone.clientHeight;
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
