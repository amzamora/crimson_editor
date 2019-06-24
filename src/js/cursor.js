class Cursor {
	constructor(editor) {
		this.editor = editor;
		this.elementWithCursor = undefined;
		this.offset = undefined; // Offset in the element as plain text
		this.cursor = '<span class="cursor"></span>';

		let self = this;
		window.addEventListener('resize', function(e) {
			for (let child of self.editor.children) {
				self._update(child);
			}
		});
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

		// Update elements
		for (let child of self.editor.children) {
			this._update(child);
		}
	}

	moveLeft() {
		// If not at the start of element
		if (this.offset > 0) {
			this.offset--;

		} else {
			if (this.elementWithCursor.previousElementSibling) {
				this.elementWithCursor = this.elementWithCursor.previousElementSibling;
				this.offset = this.elementWithCursor.innerHTML.length;
			}
		}

		this._update(this.elementWithCursor);
	}

	moveRight() {
		// At the end of element
		if (this.offset < this.elementWithCursor.innerHTML.length) {
			this.offset++;

		} else {
			if (this.elementWithCursor.nextElementSibling) {
				this.elementWithCursor = this.elementWithCursor.nextElementSibling;
				this.offset = 0;
			}
		}

		this._update(this.elementWithCursor);
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
			/*this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset) + string + this.elementWithCursor.innerHTML.substr(this.offset);
			this.offset += string.length;

			if (this.offset < 5) {
				this._revaluate_element_class(this.elementWithCursor);
			}*/

		} else {
			/*let span = document.createElement('span');
			span.classList.add('paragraph');
			span.innerHTML = this.elementWithCursor.innerHTML.substr(this.offset);

			this.elementWithCursor.innerHTML = this.elementWithCursor.innerHTML.substr(0, this.offset);
			//this._update(); Other things should be here. like for wrappping and stuff

			if (this.elementWithCursor.nextElementSibling) {
				this.editor.insertBefore(span, this.elementWithCursor.nextElementSibling);
			} else {
				this.editor.appendChild(span);
			}

			this._revaluate_element_class(this.elementWithCursor);
			this._revaluate_element_class(span);

			this.elementWithCursor = span;
			this.offset = 0;*/
		}

		this._update(this.elementWithCursor);
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

	_update(element) {
		element.innerHTML = this._as_plain_text(element.innerHTML);
		this._wrapText(element);
	}

	_wrapText(element) {
		let clone = element.cloneNode(false);
		clone.style.display = "inline-block";
		this.editor.appendChild(clone);

		let words = element.innerHTML.split(' ');
		clone.innerHTML += words.shift();
		for (let word of words) {
			clone.innerHTML += ' ';

			if (word.length === 0) {
				clone.innerHTML += ' ';
			} else {
				clone.innerHTML += word;
			}

			if (this.elementWithCursor.clientWidth < clone.clientWidth) {
				// Find previos inserted ' ' and replace it with <br>
				let i = clone.innerHTML.length;
				while (i > 0) {
					if (clone.innerHTML[i] === ' ') {
						clone.innerHTML = clone.innerHTML.substr(0, i) + '<br>' + clone.innerHTML.substr(i + 1);
						break;
					}
					i--;
				}
			}
		}

		element.innerHTML = clone.innerHTML;
		this.editor.removeChild(clone);
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
		string = string.replace(/<br>/g, ' ');
		return string.replace(/(<span.*?>|<\/span>)/g, '');
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



	_maxWidth() {
		return this.editor.clientWidth;
	}

}
