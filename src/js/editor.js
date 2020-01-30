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
		}, 100);
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
		//this.him.innerHTML = Parser.stylize(this.buffer.getText());

		// Put on editor
		this.him.innerHTML = text;

		// Draw cursor
		this.cursor.draw(this.him);
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
