function makeCounter() {
	let i = 0;
	return function() {
		i += 1;
		return i;
	}
}
count = makeCounter();

class Cursor {
	constructor(offset, buffer) {
		if (offset < 0 || offset > buffer.length()) {
			throw new Error("Initial offset for cursor is invalid.");
		}

		this.offset = offset;
		this.number = count();
	}

	moveLeft(buffer) {
		if (this.offset > 0) {
			this.offset -= 1;
		}
	}

	moveRight(buffer) {
		if (this.offset < buffer.length()) {
			this.offset += 1;
		}
	}

	moveUp(buffer) {

	}

	moveDown(buffer) {

	}

	draw(editor) {
		// Find position of cursor
		// -----------------------
		let offset = Cursor._equivalentOffsetOnHtml(this.offset, editor.innerHTML);

		// All this is to avoid breaking words where they shouldn't (FIX THIS)
		function isWhiteSpace(char) {return char === ' ' || char === '\n' || char === '<' || char === '>'}

		let aux1 = offset - 1;
		while (!isWhiteSpace(editor.innerHTML[aux1])) {
			if (aux1 < 1) {
				aux1 = 0;
				break;
			}
			aux1 -= 1;
		}
		if (aux1 !== 0) {aux1 += 1}

		let aux2 = offset;
		while (!isWhiteSpace(editor.innerHTML[aux2])) {
			if (aux2 > editor.innerHTML.length) {
				aux2 = editor.innerHTML.length;
				break;
			}
			aux2 += 1;
		}

		editor.innerHTML = editor.innerHTML.substr(0, aux1) + '<nobr>' + editor.innerHTML.substring(aux1, offset) + '<erase-me class="cursor"></erase-me>' + editor.innerHTML.substring(offset, aux2) + '</nobr>' + editor.innerHTML.substr(aux2);

		let eraseMe = document.getElementsByTagName('erase-me')[0];
		let offsetLeft = eraseMe.offsetLeft;
		let offsetTop = eraseMe.offsetTop;
		let height = eraseMe.clientHeight;

		// Remove added stuff
		editor.innerHTML = editor.innerHTML.replace('<erase-me class="cursor"></erase-me>', '');
		editor.innerHTML = editor.innerHTML.replace(/<\/?nobr>/g, '');

		// Put cursor on editor
		// --------------------
		editor.innerHTML = `<cursor${this.number} class="cursor"></cursor${this.number}>` + editor.innerHTML;
		let cursor = document.getElementsByTagName(`cursor${this.number}`)[0];
		cursor.style.left = offsetLeft + 'px';
		cursor.style.top = offsetTop + 'px';
		cursor.style.height = height + 'px';
	}

	draw2(editor) {
		let offset = Cursor._equivalentOffsetOnHtml(this.offset, editor.innerHTML);
		editor.innerHTML = editor.innerHTML.substr(0, offset) + '|' + editor.innerHTML.substr(offset);
		console.log(editor.innerHTML.replace(/\n/g, '\\n\n'));
		console.log("\n\n");
	}

	static _equivalentOffsetOnHtml(offset, html) {
		let state = {
			offset: 0,
			equivalent: 0,
			tagOpened: false,
			conflictingCharOpened: false
		}

		while (true) {
			// Check end conditions
			if (state.equivalent >= html.length) {
				break;
			}

			if (state.offset === offset && state.tagOpened !== true && state.conflictingCharOpened !== true && !(html[state.equivalent] === '<' && html[state.equivalent + 1] !== '/')) {
				break;
			}

			// Advance state
			if (html[state.equivalent] === '<') {
				state.tagOpened = true;
				state.equivalent += 1;

			} else if (html[state.equivalent] === '>') {
				state.tagOpened = false;
				state.equivalent += 1;

			} else if (html[state.equivalent] === '&') {
				state.conflictingCharOpened = true;
				state.equivalent += 1;

			} else if (state.conflictingCharOpened === true && html[state.equivalent] === ';') {
				state.conflictingCharOpened = false;
				state.equivalent += 1;
				state.offset += 1;

			} else if (state.tagOpened === true) {
				state.equivalent += 1;

			} else if (state.conflictingCharOpened === true) {
				state.equivalent += 1;

			} else {
				state.offset += 1;
				state.equivalent += 1;
			}
		}

		return state.equivalent;
	}
}
