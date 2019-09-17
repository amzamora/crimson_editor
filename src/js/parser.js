class Parser {
	// Receives text and a editor, and convert the text to html elements on the editor
	static put_text_on_editor(text, editor) {
		this.text = text;
		this.index = 0;

		// Put elements on editor
		while (this.index !== this.text.length) {
			editor.appendChild(this._get_next_element());

			// Advance until new element
			while(this.text[this.index] === '\n') {
				this.index++;
			}
		}
	}

	static _get_next_element() {
		if (this._is_header(this.index) === true) {
			return this._get_header();
		} else {
			return this._get_paragraph();
		}
	}

	static _is_header(index) {
		let i = index;
		while (this.text[i] === '#') {
			i++;
		}

		if (i - index !== 0 && this.text[i] === ' ' && i - index <= 3) {
			return true;
		} else {
			return false;
		}
	}

	static _get_header() {
		// Determine what type of header it is
		let i = 0;
		while (this.text[this.index + i] === '#') {
			i++;
		}

		// Create header element
		let header = document.createElement(`h${i}`);

		// Get header content
		while (this.text[this.index] !== '\n' && this.index < this.text.length) {
			header.innerHTML += this.text[this.index];
			this.index++;
		}

		return header;
	}

	static _get_paragraph() {
		let paragraph = document.createElement('p');

		// Get paragraph content
		while( this.index < this.text.length) {
			if (this.text[this.index] === '\n') {
				if (this._is_new_element()) {
					break;
				}

				this.index++;
				if (this.text[this.index] !== ' ') {
					paragraph.innerHTML += ' ';
				}
			}

			paragraph.innerHTML += this.text[this.index];
			this.index++;
		}

		return paragraph;
	}

	// This function is meant to be called on a new line
	static _is_new_element() {
		if (this.text[this.index + 1] === '\n' || this._is_header(this.index + 1)) {
			return true;
		} else {
			return false;
		}
	}
}
