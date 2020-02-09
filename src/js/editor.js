class NotebooksEditor {
	constructor (anchor) {
		// Initialize editor
		this.him = document.getElementById(anchor);
		this.him.classList.add('NotebooksEditor');
		this.him.innerHTML = '';
		this.buffer = new Buffer();

		// Attach callbacks to manage input
		this.input = Input(this.him);
		let self = this;
		this.input.addEventListener('keyboard-input', function(e) {
			self._onKeyboardInput(e);
		});
		this.him.addEventListener('click', function(e) {
			self._onClick(e);
		});
		window.addEventListener('resize', function(e) {
			self._update();
		});
	}

	setText(text, cursor = -1) {
		text = Parser.format(text);
		console.log(text.replace(/\n/g, '\\n\n'));
		this.buffer.setText(text);
		if (cursor !== - 1) {
			this.cursor = new Cursor(cursor, this.buffer);
		} else {
			this.cursor = new Cursor(text.length, this.buffer);
		}

		this._update(); // This is necessary
		let self = this;
		setTimeout(function() {
			self._update(); // This is also necessary
		}, 200);
	}

	setFontSize(new_size) {

	}

	// Private
	// =======

	_update() {
		// Get text
		let text = this.buffer.getText();

		// Replace conflicting characters
		text = text.replace(/&/g, '&amp;');
		text = text.replace(/</g, '&lt;');
		text = text.replace(/>/g, '&gt;');

		// Stylize
		//text = Parser.stylize(text);

		// Put on editor
		this.him.innerHTML = text;

		// Draw cursor
		this._drawCursor(this.cursor);
	}

	_drawCursor(cursor) {
		// Find position of cursor
		// -----------------------
		let offset = this._equivalentOffsetOnHtml(cursor.offset, this.him.innerHTML);

		// All this is to avoid breaking words where they shouldn't (FIX THIS)
		function isWhiteSpace(char) {return char === ' ' || char === '\n' || char === '<' || char === '>'}

		let aux1 = offset - 1;
		while (!isWhiteSpace(this.him.innerHTML[aux1])) {
			if (aux1 < 1) {
				aux1 = 0;
				break;
			}
			aux1 -= 1;
		}
		if (aux1 !== 0) {aux1 += 1}

		let aux2 = offset;
		while (!isWhiteSpace(this.him.innerHTML[aux2])) {
			if (aux2 > this.him.innerHTML.length) {
				aux2 = this.him.innerHTML.length;
				break;
			}
			aux2 += 1;
		}

		// Put false cursor editor to get its position
		this.him.innerHTML = this.him.innerHTML.substr(0, aux1) + '<nobr>' + this.him.innerHTML.substring(aux1, offset) + '<erase-me class="cursor"></erase-me>' + this.him.innerHTML.substring(offset, aux2) + '</nobr>' + this.him.innerHTML.substr(aux2);

		// Remove new lines from text (If they stay the measurement is affected, yet new lines are needed to find the correct cursor offset)
		//this.him.innerHTML = this.him.innerHTML.replace(/\n/g, '');

		// Measure stuff
		let eraseMe = document.getElementsByTagName('erase-me')[0];
		let offsetLeft = eraseMe.offsetLeft;
		let offsetTop = eraseMe.offsetTop;
		let height = eraseMe.clientHeight;

		// Remove added stuff
		this.him.innerHTML = this.him.innerHTML.replace('<erase-me class="cursor"></erase-me>', '');
		this.him.innerHTML = this.him.innerHTML.replace(/<\/?nobr>/g, '');

		// Put real cursor on editor
		// -------------------------
		this.him.innerHTML = `<cursor${this.number} class="cursor"></cursor${this.number}>` + this.him.innerHTML;
		cursor = document.getElementsByTagName(`cursor${this.number}`)[0];
		cursor.style.left = offsetLeft + 'px';
		cursor.style.top = offsetTop + 'px';
		cursor.style.height = height + 'px';
	}

	_equivalentOffsetOnHtml(offset, html) {
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

	// Callbacks
	// =========

	_onKeyboardInput(e) {
		switch (e.value) {
			case 'left-key':
				Parser.moveLeft(this.buffer, this.cursor);
				break;

			case 'right-key':
				Parser.moveRight(this.buffer, this.cursor);
				break;

			case 'up-key':
				break;

			case 'down-key':
				break;

			case 'deletion':
				Parser.delete(this.buffer, this.cursor);
				break;

			default: // Insertion
				if (e.value.length === 1) {
					Parser.insert(this.buffer, this.cursor, e.value);
				}
				break;
		}

		this._update();
	}

	_onClick(e) {
		this.input.focus();
	}
}

// Generates an input box on the editor
function Input(editor) {
	let input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.classList.add('notebooks-editor-input');
	editor.parentElement.appendChild (input);

	// Listen for keypresses
	document.addEventListener('keydown', function(e) {
		if (input === document.activeElement) {
			let aux = new CustomEvent('keyboard-input');

			if (e.keyCode == 37) {
				aux.value = 'left-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 39) {
				aux.value = 'right-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 38) {
				aux.value = 'up-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 40) {
				aux.value = 'down-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 8){
				aux.value = 'deletion';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 13) {
				aux.value = '\n';
				input.dispatchEvent(aux);
			}
		}
	});

	// Listen for input
	input.addEventListener('input', function (e) {
			let aux = new CustomEvent('keyboard-input');
			aux.value = input.value;

			// Reset input box
			input.value = '';

			// Check for deleteContentBackward
			if (e.inputType !== 'deleteContentBackward') {
				input.dispatchEvent(aux);
			}
	});

	return input;
}
