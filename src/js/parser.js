class Parser {
	static parse(text) {
		let output = "";

		// Replace conflicting characters
		text = text.replace(/&/g, '&amp;');
		text = text.replace(/</g, '&lt;');
		text = text.replace(/>/g, '&gt;');

		// Format text
		text = Parser.format(text);

		let index = {pos: 0};
		while (index.pos < text.length) {
			output += this._next_element(text, index);
		}

		return output;
	}

	// This function is encharged to ensure that there is two new lines between block elements.
	static format(text) {
		let index = {
			pos: 0
		}
		let formatted = '';

		while (index.pos < text.length) {
			// Header
			if (this._isHeader(text, index.pos)) {
				while (index.pos < text.length) {
					if (text[index.pos] === '\n') {
						break;
					}
					formatted += text[index.pos];
					index.pos += 1;
				}
				if (index.pos < text.length) {
					formatted += text[index.pos];
					index.pos += 1;
					if (text[index.pos] !== '\n') {
						formatted += '\n';
					}
				}

			// Paragraph | Blockquote | Lists
			} else {
				let list = false;
				if (this._isList(text, index.pos)) {
					list = true;
				}

				while (index.pos < text.length) {
					if (text[index.pos] === '\n') {
						if (this._isNewElement(text, index)) {
							break;
						}
					}
					if (text[index.pos] !== '\n') {
						formatted += text[index.pos];
					}
					index.pos += 1;
				}
				if (index.pos < text.length) {
					formatted += text[index.pos];
					index.pos += 1;
					if (text[index.pos] !== '\n' && !list) {
						formatted += '\n';

					} else if (text[index.pos] === '\n') {
						formatted += text[index.pos];
						index.pos += 1;
					}
				}
			}
		}

		return formatted;
	}

	static _next_element(text, index) {
		if (this._isHeader(text, index.pos)) {
			return this._getHeader(text, index);

		} else if (this._isList(text, index.pos)) {
			return this._getList(text, index);

		} else {
			return this._getParagraph(text, index);
		}
	}

	static _getHeader(text, index) {
		// Determine what type of header it is
		let i = 0;
		while (text[index.pos + i] === '#') {
			i++;
		}
		let header = `<span class="h${i}">`;

		// Get header content
		while (text[index.pos] !== '\n' && index.pos < text.length) {
			header += text[index.pos];
			index.pos += 1;
		}

		// Move until new element
		header += ' '; // Put ' ' instead of newlines
		header += ' ';
		index.pos += 2;

		header += '</span>';

		return header;
	}

	static _getParagraph(text, index) {
		let paragraph = '<span class="paragraph">';

		// Get content
		while (index.pos < text.length) {
			if (text[index.pos] === '\n') {
				break;
			}

			paragraph += text[index.pos];
			index.pos += 1;
		}

		// Move until new element
		paragraph += ' '; // put ' ' instead of newlines
		paragraph += ' ';
		index.pos += 2;

		paragraph += '</span>';

		return paragraph;
	}


	static _getList(text, index) {
		let list = '<ul>';

		// Get sub items
		while (index.pos < text.length) {
			if (text[index.pos] === '\n') {
				break;
			}

			// Get subItem
			list += '<li><span style="display: none;">- </span>';
			index.pos += 2;
			while (index.pos < text.length) {
				if (text[index.pos] === '\n') {
					list += ' ';
					break;
				}
				list += text[index.pos];
				index.pos += 1;
			}
 			list += '</li>';

			// Advance until new sub item
			index.pos += 1;
		}

		// Move until new element
		list = list.substr(0, list.length - 5) + ' ' + list.substr(list.length - 5); // put ' ' instead of newlines
		index.pos += 1;

		list += '</ul>';

		return list;
	}

	static _isNewElement(text, index) {
		if (text[index.pos + 1] === '\n' || this._isHeader(text, index.pos + 1) || this._isBlockquote(text, index.pos + 1) || this._isList(text, index.pos + 1)) {
			return true;
		} else {
			return false;
		}
	}

	static _isHeader(text, index) {
		if (index === 0 || text[index - 1] === '\n') {
			let i = index;
			while (text[i] === '#') {
				i++;
			}

			if (i !== index && text[i] === ' ' && i - index <= 3) {
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	static _isBlockquote(text, index) {
		if (index === 0 || text[index - 1] === '\n') {
			if (text[index] === '>' && text[index + 1] === ' ') {
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	static _isList(text, index) {
		if (index === 0 || text[index - 1] === '\n') {
			if (text[index] === '-' && text[index + 1] === ' ') {
				return true;
			} else {
				return false;
			}
		}
		return false;
	}

	static moveCursorLeft() {

	}

	static moveCursorRight() {

	}

	static delete() {

	}

	static insert(str) {

	}
}
