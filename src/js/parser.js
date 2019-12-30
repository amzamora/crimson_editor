class Parser {
	static stylize(text) {
		let stylized = "";
		let index = {
			pos: 0
		};
		while (index.pos < text.length) {
			stylized += this._nextElement(text, index);
		}

		return stylized;
	}

	static _nextElement(text, index) {
		if (this._isHeader(text, index) === true) {
			return this._getHeader(text, index);
		} else {
			return this._getParagraph(text, index);
		}
	}

	static _isHeader(text, index) {
		let i = index.pos;
		while (text[i] === '#') {
			i++;
		}

		if (i !==  index.pos && text[i] === ' ' && i - index.pos <= 3) {
			return true;
		} else {
			return false;
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

		header += '</span>';

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
		if (text[index.pos + 1] === '\n' || this._isHeader(text, index.pos + 1)) {
			return true;
		} else {
			return false;
		}
	}

}
