/* A function that receives text and a editor, and convert the text
to html elements on the editor  */

class Parser {
	static putTextOnEditor(text, editor) {
		editor.innerHTML = '<span class="cursor"></span>';

		text = text.split ('\n');
		while (text.length !== 0) {
			let first_char = text[0][0];
			let span = document.createElement('span');

			if (this._header(text[0]) === true) {
				span.innerHTML = text[0];;

				let i = 0;
				while (text[0][i] === '#') {
					i++;
				}
				span.classList.add(`h${i}`);
				text.shift();

			} else if (first_char === '>') {
				span.innerHTML = text[0].substring(1).trim();
				span.classList.add('blockquote');
				text.shift();

			} else {
				span.innerHTML = text[0];
				span.classList.add('paragraph');
				text.shift();
			}

			editor.appendChild(span);
		}
	}

	static _header(string) {
		let i = 0;
		while (string[i] === '#') {
			i++;
		}

		if (string[i] === ' ') {
			return true;
		} else {
			return false;
		}
	}
}
