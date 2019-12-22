class NotebooksEditor {
	constructor (anchor) {
		// Initialize editor
		this.him = document.getElementById(anchor);
		this.him.classList.add('NotebooksEditor');
		this.him.innerHTML = '';
		this.buffer = new Buffer();
		this.cursor = 0;

		// Attach callbacks to manage input
		this.input = Input(this.him);
		let self = this;
		this.input.addEventListener('keyboard-input', function(e) {
			self._onKeyboardInput(e);
		});
		this.him.addEventListener('click', function(e) {
			self._onClick(e);
		});
	}

	setText(text, cursor = -1) {
		this.buffer.setText(text);
		if (cursor !== - 1) {
			this.cursor = cursor;
		} else {
			this.cursor = text.length;
		}
		this._update();
	}

	setFontSize(new_size) {

	}

	getText() {
		let text = "";
		for (let child of this.him.childNodes) {
			text += child.innerHTML;
		}
		return text;
	}

	// Private
	// =======

	_update() {
		this.him.innerHTML = this.buffer.getText();
		this._drawCursor();
		this.him.innerHTML = Parser.stylize(this.him.innerHTML);
	}

	_drawCursor() {
		console.log(this.him.innerHTML.substr(0, this.cursor) + '<cursor>' + this.him.innerHTML.substr(this.cursor));
		this.him.innerHTML = this.him.innerHTML.substr(0, this.cursor) + '|' + this.him.innerHTML.substr(this.cursor);
	}

	// Callbacks
	// =========

	_onKeyboardInput(e) {
		switch (e.value) {
			case 'left-key':
				this.cursor--;
				break;

			case 'right-key':
				this.cursor++;
				break;

			case 'up-key':
				break;

			case 'down-key':
				break;

			case 'deletion':
				break;

			default:
				if (e.value.length === 1) {
					this.buffer.insertAtCursor(e.value);
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
