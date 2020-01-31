class Parser {
	/* Public
	   ====== */

	static stylize(text) {
		let stylized = "";
		let index = {
			pos: 0
		};
		while (index.pos < text.length) {
			stylized += this._nextElement(text, index);
		}

		stylized = this._inline_stylize(stylized);

		return stylized;
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

	static insert(buffer, cursor, char) {
		if (char === '\n') {
			let text = buffer.getText();

			// Blockquote
			if (text[cursor.offset - 1] === ' ' && text[cursor.offset - 2] === '>' && (cursor.offset - 3 === -1 || text[cursor.offset - 3] === '\n')) {
				buffer.insertAt(cursor.offset - 3, '\n\n');
				cursor.moveRight(buffer);
				cursor.moveRight(buffer);

			// Else
			} else {
				buffer.insertAt(cursor.offset, '\n\n');
				cursor.moveRight(buffer);
				cursor.moveRight(buffer);
			}
		} else {
			buffer.insertAt(cursor.offset, char);
			cursor.moveRight(buffer);
		}
	}

	static delete(buffer, cursor) {
		if (cursor.offset > 0) {
			let text = buffer.getText();
			if (text[cursor.offset - 1] === '\n') {
				buffer.deleteAt(cursor.offset - 2, 2);
				cursor.moveLeft(buffer);
				cursor.moveLeft(buffer);
			} else {
				// Blockquote
				if (text[cursor.offset - 1] === ' ' && text[cursor.offset - 2] === '>' && (cursor.offset - 3 === -1 || text[cursor.offset - 3] === '\n')) {
					buffer.deleteAt(cursor.offset - 2, 2);
					cursor.moveLeft(buffer);
					cursor.moveLeft(buffer);

				// Paragraph
				} else {
					buffer.deleteAt(cursor.offset - 1, 1);
					cursor.moveLeft(buffer);
				}
			}
		}
	}

	static moveLeft(buffer, cursor) {
		let text = buffer.getText();
		if (text[cursor.offset - 1] === '\n') {
			cursor.moveLeft(buffer);
			cursor.moveLeft(buffer);
		} else {
			// Blockquote
			if (text[cursor.offset - 1] === ' ' && text[cursor.offset - 2] === '>' && (cursor.offset - 3 === -1 || text[cursor.offset - 3] === '\n')) {
				if (text[cursor.offset - 3] === '\n') {
					cursor.moveLeft(buffer);
					cursor.moveLeft(buffer);
					cursor.moveLeft(buffer);
					cursor.moveLeft(buffer);
				}

			// Paragraph
			} else {
				cursor.moveLeft(buffer);
			}
		}
}

	static moveRight(buffer, cursor) {
		let text = buffer.getText();
		if (text[cursor.offset] === '\n') {
			cursor.moveRight(buffer);
			cursor.moveRight(buffer);

			// Blockquote
			if (text[cursor.offset] === '>' && text[cursor.offset + 1] === ' ') {
				cursor.moveRight(buffer);
				cursor.moveRight(buffer);
			}
		} else {
			cursor.moveRight(buffer);
		}
	}

	/* Private
	   ======= */
	static _nextElement(text, index) {
		if (this._isHeader(text, index.pos) === true) {
			return this._getHeader(text, index);
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

		header += '\n</span>';

		return header;
	}

	static _getParagraph(text, index) {
		let paragraph = '<span class="paragraph">';

		// Get content
		while (index.pos < text.length) {
			if (text[index.pos] === '\n') {
				if (this._isNewElement(text, index)) {
					break;
				}

				index.pos += 1;
			}

			paragraph += text[index.pos];
			index.pos += 1;
		}

		paragraph += '</span>';

		return paragraph;
	}

	static _isNewElement(text, index) {
		if (text[index.pos + 1] === '\n' || this._isHeader(text, index.pos + 1) || this._isBlockquote(text, index.pos + 1) || this._isList(text, index.pos + 1)) {
			return true;
		} else {
			return false;
		}
	}

	static _isHeader(text, index) {
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

	static _isBlockquote(text, index) {
		if (text[index] === '>' && text[index + 1] === ' ') {
			return true;
		} else {
			return false;
		}
	}

	static _isList(text, index) {
		if (text[index] === '-' && text[index + 1] === ' ') {
			return true;
		} else {
			return false;
		}
	}

	static _inline_stylize(stylized) {
		// Bold text
		let boldRegex = /\*[^\* \t\n](((?!\n\n)[^\*])*[^\* \t\n])?\*/gm;
		/*stylized = stylized.replace(boldRegex, function(match) {
			return '<span class="notation">*</span><span class=\"bold\">' + match.substring(1, match.length - 1) + '</span><span class="notation">*</span>';
		});*/

		return stylized;
	}

}
